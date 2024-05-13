// const express = require("express");
// const app = express();
// const cors = require("cors");
// const mysql = require("mysql");

// const cron = require("node-cron");
// const { addDays, format, isSunday } = require("date-fns");

// app.use(express.json());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // Update * to specific origin if needed
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.listen(3003, () => {
//   console.log("Server is running on port 3003");
// });

// const connection = mysql.createConnection({
//   host: "bavbwnskgspsg4hoezuh-mysql.services.clever-cloud.com",
//   database: "bavbwnskgspsg4hoezuh",
//   user: "uvwarr5nxly8rt9h",
//   port: 3306,
//   password: "ePWGgtAiz9G7TIylKiPD",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to database: " + err.stack);
//     return;
//   }
//   console.log("Connected to database as id " + connection.threadId);

//   //     const date = new Date();
//   //     const dateConvert = formatDate(date)
//   //     const getTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
//   //     const createTablesQuery = `SELECT
//   //     allleads.id,
//   //     allleads.patientName,
//   //     allleads.stage,
//   //     allleads.level,
//   //     allleads.phoneNumber,
//   //     DATE_FORMAT(followup_table.date, '%Y-%m-%d') AS date,
//   //     followup_table.coachNotes,
//   //     followup_table.followupId,
//   //     followup_table.time,
//   //     allleads.coachName
//   // FROM
//   //     allleads
//   // INNER JOIN
//   //     followup_table
//   // ON
//   //     allleads.id = followup_table.leadId
//   //     WHERE date = '${dateConvert}' AND time <= '${getTime}'
//   //     ORDER BY
//   //     CASE allleads.level
//   //       WHEN 'Very Hot' THEN 1
//   //       WHEN 'Hot' THEN 2
//   //       WHEN 'Cold' THEN 3
//   //       WHEN 'Closed' THEN 4
//   //       ELSE 5
//   //     END;
//   // ;
//   // `
//   //     connection.query(createTablesQuery, (error, results, fields) => {
//   //         if (error) {
//   //             console.error('Error creating tables: ' + error.stack);
//   //             return;
//   //         }
//   //         console.log(results);
//   //     });

//   // const createTablesQuery = `DROP TABLE allleads`
//   // connection.query(createTablesQuery, (error, results, fields) => {
//   //     if (error) {
//   //         console.error('Error creating tables: ' + error.stack);
//   //         return;
//   //     }
//   //     console.log(fields)
//   //     console.log(results)
//   // });

//   const createTablesQuery = `create table IF NOT EXISTS allleads(
//         id INT primary KEY auto_increment,
//         phoneNumber BIGINT not null default 0000000000,
//         callerName	 varchar(200) default 'Enter Here',
//         patientName varchar(200) default 'Enter Here',
//         dateOfContact   DATE ,
//         leadChannel	enum("Web Form", "Whatsapp",
//         "call","Just Dial","Walk In", "Referral",
//         "Gmb", "Social Media","Youtube"),
//         campaign enum("Organic", "Op","Pet Ct",
//         "Biopsy", "Surgery", "Influencer",
//         "Pediatric"),
//         coachName	enum("Mustafa", "Rani", "Ruthvik"),
//         age INT,
//         gender enum("Male","Female","Others"),
//         typeOfCancer	varchar(200),
//         location TEXT,
//         email TEXT,
//         relationsToPatient TEXT,
//         coachNotes TEXT,
//         inboundOutbound TEXT,
//         relevant boolean default 0,
//         interested boolean default 1,
//         conv boolean default 0,
//         preOp boolean default 0,
//         level enum("Very Hot", "Hot", "Cold",
//         "Closed"),
//         stage enum("Lead", "Op","Diag","Ip")
//     );`;
//   connection.query(createTablesQuery, (error, results, fields) => {
//     if (error) {
//       console.error("Error creating tables: " + error.stack);
//       return;
//     }
//   });
//   const createTablesQuery2 = `create table IF NOT EXISTS followup_table(
//         leadId int not null,
//         followupId int ,
//         leadStage TEXT,
//         time TIME DEFAULT '09:30:00',
//         date DATE,
//         status enum("Scheduled",  "Missed", "Done", "Cancelled"),
//         coachNotes TEXT
//     );`;
//   connection.query(createTablesQuery2, (error, results, fields) => {
//     if (error) {
//       console.error("Error creating tables: " + error.stack);
//       return;
//     }
//   });

//   // const insertQuery = `INSERT INTO allleads (phoneNumber,  callerName, patientName,  leadChannel, campaign,
//   //     coachName, age, gender, typeOfcancer, location, email, relationsToPatient, coachNotes, inboundOutbound, relevant,
//   //     interested, conv, preOp, level, stage) VALUES
//   //    (1234567890,  'John Doe', 'Alice Doe',  'Web Form', 'Organic', 'Rani', 45, 'Female', 'Breast Cancer', 'New York', 'alice@example.com', 'Spouse', 'Follow up after surgery', 'Inbound', true, true, true, true, 'very hot', 'LEAD'),
//   //    (2345678901,  'Jane Smith', 'Bob Smith',  'Whatsapp', 'Pet Ct', 'Mustafa', 60, 'Male', 'Prostate Cancer', 'Los Angeles', 'bob@example.com', 'Sibling', 'Interested in treatment options', 'Outbound', true, true, false, false, 'Hot', 'Op'),
//   //    (3456789012,  'Emily Brown', 'Chris Brown',  'CALL', 'Biopsy', 'Ruthvik', 55, 'Male', 'Lung Cancer', 'Chicago', 'chris@example.com', 'Child', 'Needs further tests', 'Inbound', false, true, false, true, 'cold', 'Diag'),
//   //    (4567890123,  'Michael Johnson', 'David Johnson',  'Just Dial', 'Biopsy', 'Rani',  70, 'Male', 'Colorectal Cancer', 'Houston', 'david@example.com', 'Friend', 'Not sure about treatment options', 'Outbound', true, false, false, false, 'closed', 'IP');
//   //    `
//   // connection.query(insertQuery, (error, results, fields) => {
//   //     if (error) {
//   //         console.error('Error creating tables: ' + error.stack);
//   //         return;
//   //     }
//   //     console.log('Tables created successfully');
//   // });
// });

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const EventEmitter = require("events");

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
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);

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

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
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
  console.log(req.body);
  try {
    const findEmailExistsOrNot = await executeQuery(
      `SELECT * FROM users WHERE email = '${email}'`
    );

    if (findEmailExistsOrNot.length > 0) {
      if (findEmailExistsOrNot[0].password === password) {
        const payload = {
          email: findEmailExistsOrNot[0].email,
        };
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

    const convertedArray = rows.map((each) => {
      const date = new Date(each.dateOfContact);
      return {
        id: each.id,
        phoneNumber: each.phoneNumber,
        callerName: each.callerName,
        patientName: each.patientName,
        dateOfContact: formatDate(date), // Use the formatted date
        leadChannel: each.leadChannel,
        campaign: each.campaign,
        coachName: each.coachName,
        age: each.age,
        gender: each.gender,
        typeOfCancer: each.typeOfCancer,
        location: each.location,
        email: each.email,
        relationsToPatient: each.relationsToPatient,
        coachNotes: each.coachNotes,
        inboundOutbound: each.inboundOutbound,
        relevant: each.relevant,
        interested: each.interested,
        conv: each.conv,
        preOp: each.preOp,
        level: each.level,
        stage: each.stage,
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
    const getUserDetails = await executeQuery(
      `SELECT ${key} FROM allleads WHERE id = ${id};`
    );
    if (getUserDetails.length > 0) {
      const userDetails = getUserDetails[0];
      if (key === "dateOfContact") {
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
      const rows = await executeQuery(
        `SELECT * FROM allleads WHERE id = ${id}`
      );
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
  console.log(req.body, "update");
  try {
    if (field === "date") {
      const getAllLeadsValues = await executeQuery(
        `SELECT * FROM followup_table WHERE leadId = ${id} AND followupId = ${followupId}`
      );
      const getallLEadFollowup = await executeQuery(
        `SELECT * FROM followup_table WHERE leadId = ${id} AND followupId between ${followupId} AND 4`
      );
      const followupDates = [value];
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
      for (let i = 1; i <= getallLEadFollowup.length - 1; i++) {
        const today = followupDates.at(-1);
        const nextBusinessDay = getNextBusinessDay(today, 1);
        followupDates.push(nextBusinessDay);
      }
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
      const updateValue = await executeQuery(` UPDATE followup_table
            SET ${field}='${value}'
            WHERE leadId = ${parseInt(
              id
            )} AND followupId = ${followupId} AND leadStage = '${leadStage}'`);
      res.status(200).send("Lead updated successfully");
      console.log(updateValue);
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
  if (currentDate.getDay() === 0) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  let followupDates = [formatDate(currentDate)];
  const getTheLeadStageValues = await executeQuery(
    `SELECT * FROM followup_table WHERE leadId = ${id}`
  );
  const filterStageRows = getTheLeadStageValues.filter(
    (each) => each.leadStage === stage
  );
  if (filterStageRows.length > 0) {
    res.status(404).send({ message: "This lead Id Already Exsits" });
  } else {
    try {
      if (stage === "Op") {
        const filterPreviousRows = getTheLeadStageValues.filter(
          (each) => each.leadStage === "Lead" && each.status !== "Cancelled"
        );
        const updateRows = await executeQuery(
          `UPDATE followup_table SET status = 'Cancelled' WHERE leadId = ${id} AND leadStage = 'Lead' AND status != 'Cancelled'`
        );
      } else if (stage === "Diag") {
        // Update follow-up records
        const updateRows = await executeQuery(`
                    UPDATE followup_table 
                    SET status = 'Cancelled' 
                    WHERE leadId = ${id} 
                    AND leadStage IN ('Lead', 'Op') 
                    AND status != 'Cancelled'
                `);
      } else if (stage === "Ip") {
        const updateRows = await executeQuery(`
                UPDATE followup_table 
                SET status = 'Cancelled' 
                WHERE leadId = ${id} 
                AND leadStage IN ('Lead', 'Op', 'Diag') 
                AND status != 'Cancelled'
            `);
      }

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

      for (let i = 1; i <= 3; i++) {
        const today = followupDates.at(-1);
        const nextBusinessDay = getNextBusinessDay(today, 1);
        followupDates.push(nextBusinessDay);
      }

      console.log(followupDates);

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
      const getFollowupData = await executeQuery(
        `SELECT * FROM followup_table WHERE leadId = ${id}`
      );
      console.log(getFollowupData);
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
    const sql = await executeQuery(
      `SELECT * FROM followup_table WHERE leadId = ${id} AND status != 'Cancelled' ORDER BY date DESC`
    );
    const convertedArray = sql.map((each, index) => ({
      fuLead: `${each.leadStage} ${each.followupId}`,
      leadId: each.leadId,
      leadStage: each.leadStage,
      followupId: each.followupId,
      date: formatDate(each.date),
      coachNotes: each.coachNotes,
      status: each.status,
    }));

    res.status(200).json(convertedArray);
  } catch (err) {
    console.error(err, "errrrrrr");
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/dashboard-followups", authenticateToken, async (req, res) => {
  // date.setDate(date.getDate());
  const dateConvert = formatDate(presentDate);
  console.log(dateConvert)
  const getTime = `${presentDate.getHours()}:${presentDate.getMinutes()}:${presentDate.getSeconds()}`;
  console.log(getTime)
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
    `);
      console.log(fetchDetails)
    res.status(200).send(fetchDetails);
  } catch (err) {
    res.status(400).send(err);
  }
});

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

// Route get all followups
app.get("/day-wise-followups/:date", authenticateToken, async (req, res) => {
  const { date } = req.params;
  try {
    const fetchDetails = await executeQuery(`SELECT 
        allleads.id,allleads.callerName,  allleads.patientName, allleads.stage, followup_table.coachNotes,followup_table.followupId, followup_table.followupId,followup_table.date
        FROM allleads
        INNER JOIN followup_table ON allleads.id = followup_table.leadId
        WHERE DATE(followup_table.date) = '${date}'     AND followup_table.status != "Cancelled" AND followup_table.status != "Done" AND allleads.level != "Closed"
        ORDER BY allleads.id DESC
        ;`);
    const convertedArray = fetchDetails.map((each) => ({
      id: each.id,
      callerName: each.callerName,
      coachNotes: each.coachNotes,
      followupId: each.followupId,
      date: formatDate(each.date),
      patientName: each.patientName,
      stage: `${each.stage} ${each.followupId}`,
    }));
    res.status(200).send(convertedArray);
  } catch (err) {
    res.status(400).send(err);
  }
});

async function deleteFolloups() {
  try {
    const response = await executeQuery(`
        UPDATE followup_table
        SET status='Missed'
        WHERE DATE(date) = DATE_ADD(CURDATE()) AND  status = "Scheduled"`);
  } catch (e) {
    res.status(500).send("Failed To Update Followup Table");
  }
}

cron.schedule(
  "54 09 * * *",
  () => {
    deleteFolloups();
  },
  {
    scheduled: true,
  }
);

const emitter = new EventEmitter();

emitter.on("error", (err) => {
  // Handle the error here
  console.error("An error occurred:", err);
});
