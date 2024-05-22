const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const cron = require("node-cron");
const { addDays, format, isSunday } = require("date-fns");

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const presentDate = new Date();

// Mysql Database Connection
const connection = mysql.createConnection({
  host: "bavbwnskgspsg4hoezuh-mysql.services.clever-cloud.com",
  database: "bavbwnskgspsg4hoezuh",
  user: "uvwarr5nxly8rt9h",
  password: "ePWGgtAiz9G7TIylKiPD",
  port: 3306,
});

connection.connect((err) => {
  try {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      return;
    }
    console.log("Connected to database as id " + connection.threadId);
  } catch (err) {
    console.log(err);
  }

  // const createTablesQuery = `SELECT * FROM   followup_table`;
  // connection.query(createTablesQuery, (error, results, fields) => {
  //   if (error) {
  //     console.error("Error creating allleads table: " + error.stack);
  //     return;
  //   }
  //   console.log(results);
  //   console.log("Table 'allleads' created successfully");
  // });

  // const createTablesQuery = `CREATE TABLE IF NOT EXISTS users (
  //   id INT PRIMARY KEY AUTO_INCREMENT,
  //   email TEXT,
  //   password varchar(50)
  // )`;
  // connection.query(createTablesQuery, (error, results, fields) => {
  //   if (error) {
  //     console.error("Error creating allleads table: " + error.stack);
  //     return;
  //   }
  //   console.log("Table users  created successfully");
  // });

  // const createTablesQuery = `
  //  SELECT * FROM users
  // `;
  // connection.query(createTablesQuery, (error, results, fields) => {
  //   if (error) {
  //     console.error("Error creating allleads table: " + error.stack);
  //     return;
  //   }
  //   console.log("Table users  created successfully");
  //   console.log(results);
  // });

  // const createTablesQuery = `CREATE TABLE IF NOT EXISTS allleads (
  //   id INT PRIMARY KEY AUTO_INCREMENT,
  //   phoneNumber BIGINT NOT NULL DEFAULT '0000000000',
  //   callerName VARCHAR(200) DEFAULT 'Enter Here',
  //   patientName VARCHAR(200) DEFAULT 'Enter Here',
  //   dateOfContact DATE,
  //   leadChannel ENUM('Web Form', 'WhatsApp', 'Call', 'Just Dial', 'Walk In', 'Referral', 'GMB', 'Social Media', 'YouTube'),
  //   campaign ENUM('Organic', 'Op', 'PET CT', 'Biopsy', 'Surgery', 'Influencer', 'Pediatric'),
  //   coachName ENUM('Mustafa', 'Rani', 'Ruthvik'),
  //   age INT,
  //   gender ENUM('Male', 'Female', 'Others'),
  //   typeOfCancer VARCHAR(200),
  //   location TEXT,
  //   email TEXT,
  //   relationsToPatient TEXT,
  //   coachNotes TEXT,
  //   inboundOutbound TEXT,
  //   relevant BOOLEAN DEFAULT 0,
  //   interested BOOLEAN DEFAULT 1,
  //   conv BOOLEAN DEFAULT 0,
  //   preOp BOOLEAN DEFAULT 0,
  //   level ENUM('Very Hot', 'Hot', 'Cold', 'Closed'),
  //   stage ENUM('Lead', 'Op', 'Diag', 'Ip')
  // )`;
  // connection.query(createTablesQuery, (error, results, fields) => {
  //   if (error) {
  //     console.error("Error creating allleads table: " + error.stack);
  //     return;
  //   }
  //   console.log("Table 'allleads' created successfully");
  // });

  // const createFollowupTableQuery = `CREATE TABLE IF NOT EXISTS followup_table (
  //   leadId INT NOT NULL,
  //   followupId INT,
  //   leadStage TEXT,
  //   time TIME DEFAULT '09:30:00',
  //   date DATE,
  //   status ENUM('Scheduled', 'Missed', 'Done', 'Cancelled'),
  //   coachNotes TEXT
  // )`;
  // connection.query(createFollowupTableQuery, (error, results, fields) => {
  //   if (error) {
  //     console.error("Error creating followup_table: " + error.stack);
  //     return;
  //   }
  //   console.log("Table 'followup_table' created successfully");
  // });

  // const insertQuery = `INSERT INTO allleads (phoneNumber,  callerName, patientName,  leadChannel, campaign,
  //    coachName, age, gender, typeOfcancer, location, email, relationsToPatient, coachNotes, inboundOutbound, relevant,
  //     interested, conv, preOp, level, stage) VALUES
  //    (1234567890,  'John Doe', 'Alice Doe',  'Web Form', 'Organic', 'Rani', 45, 'Female', 'Breast Cancer', 'New York', 'alice@example.com', 'Spouse', 'Follow up after surgery', 'Inbound', true, true, true, true, 'very hot', 'LEAD'),
  //    (2345678901,  'Jane Smith', 'Bob Smith',  'WhatsApp', 'PET CT', 'Mustafa', 60, 'Male', 'Prostate Cancer', 'Los Angeles', 'bob@example.com', 'Sibling', 'Interested in treatment options', 'Outbound', true, true, false, false, 'Hot', 'Op'),
  //    (3456789012,  'Emily Brown', 'Chris Brown',  'CALL', 'Biopsy', 'Ruthvik', 55, 'Male', 'Lung Cancer', 'Chicago', 'chris@example.com', 'Child', 'Needs further tests', 'Inbound', false, true, false, true, 'cold', 'Diag'),
  //    (4567890123,  'Michael Johnson', 'David Johnson',  'Just Dial', 'Biopsy', 'Rani',  70, 'Male', 'Colorectal Cancer', 'Houston', 'david@example.com', 'Friend', 'Not sure about treatment options', 'Outbound', true, false, false, false, 'closed', 'IP');
  //    `;
  // connection.query(insertQuery, (error, results, fields) => {
  //   if (error) {
  //     console.error("Error creating tables: " + error.stack);
  //     return;
  //   }
  //   console.log("Tables created successfully");
  // });
});

// The middileware for every Api first it will check authentication than only excutes the api
const authenticateToken = (request, response, next) => {
  let jwtToken;
  // To get token based on Headers authorization
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }

  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    // If the jwt token is verifed than it goes to next api other wise it will through unauthorized erro
    jwt.verify(jwtToken, "token", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
};

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findEmailExistsOrNot = await executeQuery(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    // To check the current email already exists or not
    if (findEmailExistsOrNot.length > 0) {
      // It will check the stored password and  current user entered password
      if (findEmailExistsOrNot[0].password === password) {
        // If the password mateched than the jwt token will be genrated here
        const payload = {
          email: findEmailExistsOrNot[0].email,
        };
        // To check authentication in frontend and backend this part will genrate the jwt token
        const jwtToken = jwt.sign(payload, "token");
        res.status(200).send({ token: jwtToken });
      } else {
        res.status(400).send({ message: "Invalid Password" });
      }
    } else {
      res.status(400).send({ message: "Invalid Email" });
    }
  } catch (e) {
    console.log(e);
  }
});

// Route to get leads
app.get("/get-leads", authenticateToken, async (req, res) => {
  try {
    const rows = await executeQuery(`SELECT * FROM allleads ORDER BY id DESC `);
    // To convert the date into YYYY-MM-DD format converting the recieved data
    const convertedArray = rows.map((each) => {
      const date = new Date(each.dateOfContact);
      return {
        ...each,
        dateOfContact: formatDate(each.dateOfContact),
      };
    });
    res.json(convertedArray);
  } catch (err) {
    res.status(500).send("Error executing query");
  }
});

app.get("/patiens/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const getUserDetails = await executeQuery(
      `SELECT * FROM allleads WHERE id = ${id};`
    );
    if (getUserDetails.length > 0) {
      const userDetails = getUserDetails[0];
      res.status(200).json(userDetails);
    } else {
      res.status(404).json({ message: "User details not found" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/get-specific-key/:id/:key", authenticateToken, async (req, res) => {
  const { id, key } = req.params;
  try {
    // To get the specific value
    const getUserDetails = await executeQuery(
      `SELECT ${key} FROM allleads WHERE id = ${id};`
    );
    if (getUserDetails.length > 0) {
      // To convert the date value into YYYY-MM-DD
      const userDetails = getUserDetails[0];
      if (key === "dateOfContact") {
        // At the top formatDate function formatDate will convert the date
        const convertDate = formatDate(userDetails.dateOfContact);
        res.status(200).json({ dateOfContact: convertDate });
      } else {
        res.status(200).json(userDetails);
      }
    } else {
      res.status(404).json({ message: "User details not found" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route to add The New Lead
app.post("/add-lead", authenticateToken, async (req, res) => {
  // First it will get all the values from the frontend than insets into all leads
  const {
    phoneNumber,
    callerName,
    age,
    coachNotes,
    coachName,
    campaign,
    conv,
    email,
    gender,
    inboundOutbound,
    interested,
    leadChannel,
    level,
    location,
    patientName,
    preOp,
    relationsToPatient,
    relevant,
    stage,
    typeOfCancer,
    dateOfContact,
  } = req.body;

  try {
    const rows = await executeQuery(`
        INSERT INTO allleads (phoneNumber, callerName, campaign, age,  coachName, conv,
           email, gender, inboundOutbound, interested, coachNotes, leadchannel, level, location, patientName,
           preOp, relationsToPatient, relevant, stage,  typeOfCancer, dateOfContact)
        VALUES (
         ${parseInt(
           phoneNumber
         )}, '${callerName}','${campaign}', ${age},   '${coachName}',  '${conv}',
         '${email}', '${gender}', '${inboundOutbound}', '${interested}', '${coachNotes}', '${leadChannel}', '${level}', '${location}', '${patientName}',
         '${preOp}', '${relationsToPatient}', '${relevant}', 'Lead',  '${typeOfCancer}', '${dateOfContact}'
        );
      `);
    res.send({ message: "New Lead Added Successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.put("/update-lead", authenticateToken, async (req, res) => {
  let { field, id, value, followupId } = req.body;

  async function updateEachCell() {
    try {
      // To get leads based on lead id
      const rows = await executeQuery(
        `SELECT * FROM allleads WHERE id = ${id}`
      );
      /*
       if the rows value length > 0  then it will update the value 
       that is updated in the frontend. For example If the coach 
       changes the PatientName to something than the field will 
       become patientName and value become the changed value */

      if (rows.length > 0) {
        const updateValue = await executeQuery(
          `UPDATE allleads SET ${field}='${value}' WHERE id = ${id}`
        );
        res.status(200).send("Lead updated successfully");
      } else {
        res.status(404).send("Lead not found");
      }
    } catch (err) {
      res.status(500).send("Failed to updated lead");
    }
  }

  try {
    // If the Filed = level and changed value = closed, than it will change all the previous stage status value to Cancelled
    if (field === "level" && value === "Closed") {
      const updateStatus = await executeQuery(
        `UPDATE followup_table SET status='Cancelled' WHERE leadId = ${id} AND status = 'Scheduled'`
      );
      updateEachCell();
    } else {
      updateEachCell();
    }
  } catch (err) {
    res.status(500).send("Failed to update lead");
  }
});

app.put("/update-followup-lead", authenticateToken, async (req, res) => {
  const { field, id, value, followupId, leadStage } = req.body;
  try {
    // Field means the changed field in the frontend not the changed value
    if (field === "date") {
      // To get all the
      // const getAllLeadsValues = await executeQuery(
      //   `SELECT * FROM followup_table WHERE leadId = ${id} AND followupId = ${followupId}`
      // );
      const getallLEadFollowup = await executeQuery(
        `SELECT * FROM followup_table WHERE leadId = ${id} AND followupId between ${followupId} AND 4`
      );
      const followupDates = [value];
      const differanceDays = leadStage === "Ip" ? 14 : 1;
      // To getNext businness days with mentiond getallLEadFollowup variable
      function getNextBusinessDay(startDate, days) {
        let currentDate = startDate;
        let count = 0;
        while (count < days) {
          currentDate = addDays(currentDate, differanceDays);
          if (!isSunday(currentDate)) {
            count++;
          }
        }

        return format(currentDate, "yyyy-MM-dd");
      }
      // To iterate based on length of the getallLEadFollowup variable
      for (let i = 1; i <= getallLEadFollowup.length - 1; i++) {
        const today = followupDates.at(-1);
        const nextBusinessDay = getNextBusinessDay(today, 1);
        followupDates.push(nextBusinessDay);
      }

      // To update all the retirved followup dates
      const updateQueries = followupDates.map(
        (date, index) =>
          `UPDATE followup_table SET date = '${date}'  WHERE leadId = ${id} AND followupId = ${
            followupId + index
          }`
      );

      // Execute the update queries
      for (const query of updateQueries) {
        await executeQuery(query);
      }

      res.status(200).send({ message: "Sucessfully added" });
    } else {
      // To update the followup values directly into followup_table
      const updateValue = await executeQuery(`UPDATE followup_table
            SET ${field}='${value}'
            WHERE leadId = ${parseInt(
              id
            )} AND followupId = ${followupId} AND leadStage = '${leadStage}'`);
      res.status(200).send("Lead updated successfully");
    }
  } catch (err) {
    res.status(500).send("Failed to update lead");
  }
});

// Route to add the follow-up
app.post("/add-followup", authenticateToken, async (req, res) => {
  const { id, stage } = req.body;
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  // To check whether current day is sunday or not
  if (currentDate.getDay() === 0) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // All following business days will be assigned to this variable by default the first date will be current date
  let followupDates = [formatDate(currentDate)];
  // To get the all  stage Values
  const getTheLeadStageValues = await executeQuery(
    `SELECT * FROM followup_table WHERE leadId = ${id}`
  );
  // To check whether the current stage value exists or not
  const filterStageRows = getTheLeadStageValues.filter(
    (each) => each.leadStage === stage
  );
  // This Condition checks whether the current stage already exists
  if (filterStageRows.length > 0) {
    res.status(404).send({ message: "This lead Id Already Exsits" });
  } else {
    try {
      if (stage === "Op") {
        // To get all the Lead Values
        // const filterPreviousRows = getTheLeadStageValues.filter(
        //   (each) => each.leadStage === "Lead" && each.status !== "Cancelled"
        // );

        // To Update all the Previous Lead value status to Cancelled if it was scheduled
        const updateRows = await executeQuery(
          `UPDATE followup_table SET status = 'Cancelled' WHERE leadId = ${id} AND leadStage = 'Lead' AND status != 'Cancelled'`
        );
      } else if (stage === "Diag") {
        // To Update all the Previous Lead value AND OP  status to Cancelled if it was scheduled
        const updateRows = await executeQuery(`
                    UPDATE followup_table 
                    SET status = 'Cancelled' 
                    WHERE leadId = ${id} 
                    AND leadStage IN ('Lead', 'Op') 
                    AND status != 'Cancelled'
                `);
      } else if (stage === "Ip") {
        // To Update all the Previous Lead value AND OP  AND IP status to Cancelled if it was scheduled
        const updateRows = await executeQuery(`
                UPDATE followup_table 
                SET status = 'Cancelled' 
                WHERE leadId = ${id} 
                AND leadStage IN ('Lead', 'Op', 'Diag') 
                AND status != 'Cancelled'
            `);
      }
      // To pass differance between followupdates based on stage if stage === "Ip" than 14 days otherwise 1 day
      const daysDifferance = stage === "Ip" ? 14 : 1;

      function getNextBusinessDay(startDate, days) {
        let currentDate = startDate;
        let count = 0;

        while (count < days) {
          currentDate = addDays(currentDate, 1);
          if (!isSunday(currentDate)) {
            count++;
          }
        }

        return format(currentDate, "yyyy-MM-dd");
      }
      // To get following 3 dates with 3 iterations
      for (let i = 1; i <= 3; i++) {
        // It will access the followupdates last index value
        const today = followupDates.at(-1);
        const nextBusinessDay = getNextBusinessDay(today, 1);
        //to append to followup date array at the end
        followupDates.push(nextBusinessDay);
      }

      // To insert the followups into followup table by running map query
      const values = followupDates.map(
        (each, index) =>
          `(${id}, ${index + 1}, '${stage}', '${each}', 'Scheduled', 'default')`
      );

      const sql = await executeQuery(`
    INSERT INTO followup_table (
        leadId, followupId,  leadStage, date, status, coachNotes
    )
    VALUES ${values.join(",")}
   `);
      res
        .status(200)
        .json({ message: "Follow-up records inserted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

app.get("/patient-followups/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // To get all the patient followup from followup_table based lead id
    const sql = await executeQuery(
      `SELECT * FROM followup_table WHERE leadId = ${id} AND status != 'Cancelled' ORDER BY date DESC`
    );
    // To convert the followup date into YYYY-MM-DD, to add the extra value fuLead
    const convertedArray = sql.map((each, index) => ({
      ...each,
      fuLead: `${each.leadStage} ${each.followupId}`,
      date: formatDate(each.date),
    }));

    res.status(200).json(convertedArray);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/dashboard-followups", authenticateToken, async (req, res) => {
  const currentDate = new Date();
  const dateConvert = formatDate(currentDate);
  // const getTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const istHours = currentDate.toLocaleString("en-IN", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  const istMinutes = currentDate.toLocaleString("en-IN", {
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const istSeconds = currentDate.toLocaleString("en-IN", {
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const getTime = `${istHours}:${istMinutes}:${istSeconds}`;
  try {
    const fetchDetails = await executeQuery(` SELECT
        allleads.id,
        allleads.patientName,
        allleads.stage,
        allleads.level,
        allleads.phoneNumber,
        followup_table.date,
        followup_table.coachNotes,
        followup_table.followupId,
        followup_table.time,
        followup_table.status,
        allleads.coachName
    FROM
        allleads
    INNER JOIN
        followup_table
    ON
        allleads.id = followup_table.leadId
    WHERE
      followup_table.date = '${dateConvert}'
        AND followup_table.time <= '${getTime}'
        AND status != 'Done' AND status != 'Cancelled' AND status != 'Missed'
        AND allleads.level != 'Closed'
        ORDER BY
        CASE allleads.level
            WHEN 'Very Hot' THEN 1
            WHEN 'Hot' THEN 2
            WHEN 'Cold' THEN 3
            ELSE 4
        END
    `);
    return res.status(200).send(fetchDetails);
  } catch (err) {
    return res.status(400).send(err);
  }
});

// Route get all followups
app.get("/day-wise-followups/:date", authenticateToken, async (req, res) => {
  const { date } = req.params;
  try {
    // To get all the followups- from followup_table based on desired date
    const fetchDetails = await executeQuery(`SELECT 
        allleads.id,allleads.callerName,  allleads.patientName, allleads.stage, followup_table.coachNotes,followup_table.followupId, followup_table.followupId,followup_table.date
        FROM allleads
        INNER JOIN followup_table ON allleads.id = followup_table.leadId
        WHERE DATE(followup_table.date) = '${date}'     AND followup_table.status != "Cancelled" AND followup_table.status != "Done" AND allleads.level != "Closed"
        ORDER BY allleads.id DESC
        ;`);
    // To change the date format Into YYYY-MM-DD
    const convertedArray = fetchDetails.map((each) => ({
      ...each,
      date: formatDate(each.date),
      stage: `${each.stage} ${each.followupId}`,
      id: each.id,
    }));
    res.status(200).send(convertedArray);
  } catch (err) {
    res.status(400).send(err);
  }
});

// app.get("/dashboard-followups", authenticateToken, async (req, res) => {
//   // date.setDate(date.getDate());
//   const dateConvert = formatDate(presentDate);
//   const getTime = `${presentDate.getHours()}:${presentDate.getMinutes()}:${presentDate.getSeconds()}`;
//   try {
//     const fetchDetails = await executeQuery(` SELECT
//         allleads.id,
//         allleads.patientName,
//         allleads.stage,
//         allleads.level,
//         allleads.phoneNumber,
//         followup_table.date,
//         followup_table.coachNotes,
//         followup_table.followupId,
//         followup_table.time,
//         followup_table.status,
//         allleads.coachName
//     FROM
//         allleads
//     INNER JOIN
//         followup_table
//     ON
//         allleads.id = followup_table.leadId
//     WHERE
//       followup_table.date = '${dateConvert}'
//         AND followup_table.time <= '${getTime}'
//         AND status != 'Done' AND status != 'Cancelled'
//         AND allleads.level != 'Closed'
//         ORDER BY
//         CASE allleads.level
//             WHEN 'Very Hot' THEN 1
//             WHEN 'Hot' THEN 2
//             WHEN 'Cold' THEN 3
//             WHEN 'Closed' THEN 4
//             ELSE 5
//         END
//     `);
//     res.status(200).send(fetchDetails);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

function executeQuery(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function deleteFolloups(req, res) {
  try {
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() - 1);
    const dateConvert = formatDate(currentDate);
    /*
     At the end of the day the current day scheduled 
     followups still in scheduled than it will update that
     particular followup status to Missed */
    const response = await executeQuery(`
        UPDATE followup_table
        SET status='Missed'
        WHERE DATE_FORMAT(followup_table.date, '%Y-%m-%d') LIKE '${dateConvert}'  AND  status LIKE 'Scheduled'`);
  } catch (e) {
    res.status(500).send("Failed To Update Followup Table");
  }
}

// CRON schedule to assign a task that automatically call the function on every day night 11 : 59
cron.schedule(
  "50 11 * * *",
  () => {
    deleteFolloups();
  },
  {
    scheduled: true,
  }
);

// const emitter = new EventEmitter();

// emitter.on("error", (err) => {
//   // Handle the error here
//   console.error("An error occurred:", err);
// });
