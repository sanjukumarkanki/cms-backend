const express = require('express');
const app = express();
const cors = require("cors")
const mysql = require('mysql');

const cron = require('node-cron');
const { addDays, format, isSunday } = require("date-fns");

app.use(express.json());
// app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Update * to specific origin if needed
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(3003, () => {
    console.log("Server is running on port 3003");
});

// const connection = mysql.createConnection({
//     host: 'https://cms-backend-5297.onrender.com',
//     port: 3306,
//     user: 'root',
//     password: 'Appugaru@104', // Provide your MySQL password here
//     database: 'ciondatabase'
// });

const connection = mysql.createConnection({
    host : 'bavbwnskgspsg4hoezuh-mysql.services.clever-cloud.com',
    database: 'bavbwnskgspsg4hoezuh',
    user: 'uvwarr5nxly8rt9h',
    port : 3306,
    password: 'ePWGgtAiz9G7TIylKiPD'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
    const createTablesQuery = `create table IF NOT EXISTS allleads(
        id INT primary KEY auto_increment,
        phoneNumber BIGINT not null default 0000000000,
        callerName	 varchar(200) default 'Enter Here',
        patientName varchar(200) default 'Enter Here',
        dateOfContact   DATE ,
        leadChannel	enum("Web Form", "Whatsapp",
        "call","Just Dial","Walk Im", "Referral",
        "Gmb", "Social Media","Youtube"),
        campaign enum("Organic", "Op","Pet Ct",
        "Biopsy", "Surgery", "Influencer",
        "Pediatric"),
        coachName	enum("Mustafa", "Rani", "Ruthvik"),
        age INT,
        gender enum("Male","Female","Others"),
        typeOfCancer	varchar(200),
        location TEXT,
        email TEXT,
        relationsToPatient TEXT,
        coachNotes TEXT,
        inboundOutbound TEXT,
        relevant boolean default 0,
        interested boolean default 1,
        conv boolean default 0,
        preOp boolean default 0,
        level enum("Very Hot", "Hot", "Cold",
        "Closed"),
        stage enum("Lead", "Op","Diag","Ip")
    );`
    connection.query(createTablesQuery, (error, results, fields) => {
        if (error) {
            console.error('Error creating tables: ' + error.stack);
            return;
        }
        console.log('Tables created successfully');
    });
    const createTablesQuery2 = `create table IF NOT EXISTS followup_table(
        leadId int not null,
        followupId int ,
        leadStage TEXT,
        time TIME DEFAULT '09:30:00',
        date DATE,
        status enum("Scheduled", "Booked", "Missed", "Done", "Cancelled"),
        coachNotes TEXT
    );`
    connection.query(createTablesQuery2, (error, results, fields) => {
        if (error) {
            console.error('Error creating tables: ' + error.stack);
            return;
        }
        console.log('Tables created successfully');
    });


    const insertQuery = `INSERT INTO allleads (phoneNumber,  callerName, patientName,  leadChannel, campaign,
        coachName, age, gender, typeOfcancer, location, email, relationsToPatient, coachNotes, inboundOutbound, relevant, 
        interested, conv, preOp, level, stage) VALUES
       (1234567890,  'John Doe', 'Alice Doe',  'Web Form', 'Organic', 'Rani', 45, 'Female', 'Breast Cancer', 'New York', 'alice@example.com', 'Spouse', 'Follow up after surgery', 'Inbound', true, true, true, true, 'very hot', 'LEAD'),
       (2345678901,  'Jane Smith', 'Bob Smith',  'Whatsapp', 'Pet Ct', 'Mustafa', 60, 'Male', 'Prostate Cancer', 'Los Angeles', 'bob@example.com', 'Sibling', 'Interested in treatment options', 'Outbound', true, true, false, false, 'Hot', 'Op'),
       (3456789012,  'Emily Brown', 'Chris Brown',  'CALL', 'Biopsy', 'Ruthvik', 55, 'Male', 'Lung Cancer', 'Chicago', 'chris@example.com', 'Child', 'Needs further tests', 'Inbound', false, true, false, true, 'cold', 'Diag'),
       (4567890123,  'Michael Johnson', 'David Johnson',  'Just Dial', 'Biopsy', 'Rani',  70, 'Male', 'Colorectal Cancer', 'Houston', 'david@example.com', 'Friend', 'Not sure about treatment options', 'Outbound', true, false, false, false, 'closed', 'IP');
       `
    connection.query(insertQuery, (error, results, fields) => {
        if (error) {
            console.error('Error creating tables: ' + error.stack);
            return;
        }
        console.log('Tables created successfully');
    });


});

// Route to get leads
app.get("/get-leads", async (req, res) => {
    try {
        const rows = await executeQuery(`SELECT * FROM allleads `);
        const convertedArray = rows.map(each => {
            const date = new Date(each.dateOfContact); 
            const formattedDate = date.toISOString().split('T')[0]; 
            return {
                id: each.id,
                phoneNumber: each.phoneNumber,
                callerName: each.callerName,
                patientName: each.patientName,
                dateOfContact: formattedDate, // Use the formatted date
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
        res.status(500).send('Error executing query');
    }
});

app.get("/patiens/:id", async (req,res) => {
    const {id} = req.params
    try{
        const getUserDetails = await executeQuery(`SELECT * FROM allleads WHERE id = ${id};`);
        if (getUserDetails.length > 0) {
            const userDetails = getUserDetails[0]; 
            res.status(200).json(userDetails);
        } else {
            res.status(404).json({ message: "User details not found" });
        }
        
    }catch(err){
        res.status(400).send(err)
    }
})

app.get("/get-specific-key/:id/:key", async(req,res) => {
    const {id,key} = req.params
    try{
        const getUserDetails = await executeQuery(`SELECT ${key} FROM allleads WHERE id = ${id};`);
        if (getUserDetails.length > 0) {
            const userDetails = getUserDetails[0]; 
            if(key === "dateOfContact"){
               const convertDate = formatDate(userDetails.dateOfContact)
               res.status(200).json({dateOfContact : convertDate});
            }else{
                res.status(200).json(userDetails);
            }

        } else {
            res.status(404).json({ message: "User details not found" });
        }
        
    }catch(err){
        res.status(400).send(err)
    }
})

// Route to add The New Lead
app.post("/add-lead", async (req, res) => {
    const {
      phoneNumber,
      callerName,
      age,
      campaign,
      coachNotes,
      coachName,
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
      typeOfCancer
    } = req.body;

    try {
      const rows = await executeQuery(`
        INSERT INTO allleads (phoneNumber, callerName, age, campaign, coachName, conv,
           email, gender, inboundOutbound, interested, coachNotes, leadchannel, level, location, patientName,
           preOp, relationsToPatient, relevant, stage,  typeOfCancer, dateOfContact)
        VALUES (
         ${parseInt(phoneNumber)}, '${callerName}', ${age}, '${campaign}', '${coachName}', '${conv}',
         '${email}', '${gender}', '${inboundOutbound}', '${interested}', '${coachNotes}', '${leadChannel}', '${level}', '${location}', '${patientName}',
         '${preOp}', '${relationsToPatient}', '${relevant}', 'Lead',  '${typeOfCancer}', now()
        );
      `);
  
      res.send({ message: "New Lead Added Successfully" });
    } catch (err) {
      res.status(500).send({ message: err.message });
      console.log(err);
    }
});

  
app.put("/update-lead", async (req, res) => {
    const { field, id, value, followupId } = req.body;
    console.log(req.body, 'update-lead')
    async function updateEachCell(){
        const rows = await executeQuery(`SELECT * FROM allleads WHERE id = ${id}`);
        if(rows.length > 0){
            const updateValue = await executeQuery(`UPDATE allleads SET ${field}='${value}' WHERE id = ${id}`);
            res.status(200).send("Lead updated successfully");
        }else{
            res.status(404).send("Lead not found");
        }
    }
    try {       
        if(field === "level" && value === "closed"){
            const updateStatus = await executeQuery(`UPDATE followup_table SET status='Cancelled' WHERE leadId = ${id} AND followupId = ${followupId}`);
            console.log(updateStatus,'update');
            updateEachCell()
        }else{
           updateEachCell()
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update lead");
    }
});


app.put("/update-followup-lead", async (req, res) => {
    const { field, id, value, followupId, leadStage } = req.body;
    try {
        if(field === "date"  ){
            const getAllLeadsValues = await executeQuery(`SELECT * FROM followup_table WHERE leadId = ${id} AND followupId = ${followupId}`)
            const updatedDate = new Date(value);
            if(getAllLeadsValues[0].status === "Scheduled"){
                const getallLEadFollowup = await executeQuery(`SELECT * FROM followup_table WHERE leadId = ${id} AND followupId between ${followupId } AND 4`);
                const followupDates = [formatDate(updatedDate)]
                console.log(getallLEadFollowup, 'fdf', getallLEadFollowup.length)
                console.log(followupDates)

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

                const updateQueries = followupDates.map((date, index) =>
                `UPDATE followup_table SET date = '${date}'  WHERE leadId = ${id} AND followupId = ${followupId + index}`
            );
    
            // Execute the update queries
            for (const query of updateQueries) {
                await executeQuery(query);
            }

            res.status(200).send({message : "Sucessfully added"})

            }
        }
        else{
            const updateValue = await executeQuery(` UPDATE followup_table
            SET ${field}='${value}'
            WHERE leadId = ${parseInt(id)} AND followupId = ${followupId} AND leadStage = '${leadStage}'`);
            res.status(200).send("Lead updated successfully");
        }
    } 
 catch (err) {
        console.error(err);
        res.status(500).send("Failed to update lead");
    }
});

// Route to add the follow-up
app.post("/add-followup", async (req, res) => {
    const { id, stage } = req.body;
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1)
    if(currentDate.getDay() === "0"){
        currentDate.setDate(currentDate.getDate() + 1)
    }
    let followupDates = [formatDate(currentDate)];
    const getTheLeadStageValues = await executeQuery(`SELECT * FROM followup_table WHERE leadId = ${id}`);
    const filterStageRows = getTheLeadStageValues.filter(each => each.leadStage === stage);

    if (filterStageRows.length > 0) {
        res.status(404).send({ message: "The Lead Stage Already Exists" });
    } else {
        try {
            if (stage === "Op") {
                const filterPreviousRows = getTheLeadStageValues.filter(each => each.leadStage === "Lead" && each.status !== "Cancelled");
                console.log(filterPreviousRows, 'previous');
                const updateRows = await executeQuery(`UPDATE followup_table SET status = 'Cancelled' WHERE leadId = ${id} AND leadStage = 'Lead' AND status != 'Cancelled'`);
                console.log(updateRows, 'update');
            } else if (stage === "Diag") {
                // Update follow-up records
                const updateRows = await executeQuery(`
                    UPDATE followup_table 
                    SET status = 'Cancelled' 
                    WHERE leadId = ${id} 
                    AND leadStage IN ('Lead', 'Op') 
                    AND status != 'Cancelled'
                `);

                console.log(updateRows, 'update');
            }
            else if (stage === "Ip"){
                const updateRows = await executeQuery(`
                UPDATE followup_table 
                SET status = 'Cancelled' 
                WHERE leadId = ${id} 
                AND leadStage IN ('Lead', 'Op', 'Diag') 
                AND status != 'Cancelled'
            `);

            console.log(updateRows, 'update');
            }

            const daysDifferance = stage === "Ip" ? 14 : 1
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

            const values = followupDates.map((each, index) =>
            `(${id}, ${index + 1}, '${stage}', '${each}', 'Scheduled', 'default')`
            );

            const sql = await executeQuery(`
                INSERT INTO followup_table (
                    leadId, followupId,  leadStage, date, status, coachNotes
                )
                VALUES ${values}
            `);
            res.status(200).json({ message: "Follow-up records inserted successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

});

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


app.get("/patient-followups/:id", async (req,res) => {
    const { id } = req.params;
    try{
        const sql = await executeQuery( `SELECT * FROM followup_table WHERE leadId = ${id} AND status != 'Cancelled' ORDER BY date DESC`);
        const convertedArray = sql.map((each, index) => ({
                fuLead : `${each.leadStage} ${index+1}`,
                leadId: each.leadId,
                leadStage: each.leadStage,
                followupId : each.followupId,
                date: formatDate(each.date),
                coachNotes : each.coachNotes,
                status: each.status,

        }));

        res.status(200).json(convertedArray);
    } catch (err) {
        console.error(err, 'errrrrrr');
        res.status(500).json({ error: "Internal server error" });
    }
})


app.get("/dashboard-followups", async ( req,res) => {
    try{
        const fetchDetails = await executeQuery(`SELECT allleads.id, allleads.patientName, allleads.stage, allleads.level, allleads.phoneNumber,  followup_table.coachNotes, followup_table.followupId,followup_table.time, allleads.coachName
        FROM ciondatabase.allleads
        INNER JOIN followup_table ON allleads.id = followup_table.leadId
        WHERE DATE(followup_table.date) = DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND followup_table.status != "Cancelled" AND allleads.level != "closed" ;`);
        res.status(200).send(fetchDetails)
    }
    catch(err){
        res.status(400).send(err)
        // console.log(err)
    }
})


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



async function deleteFolloups() {
    try {
        const response = await executeQuery(`
        UPDATE followup_table
        SET status='Missed'
        WHERE DATE(date) = DATE_ADD(CURDATE(), INTERVAL 2 DAY) AND  status = "Scheduled"`);
        console.log(response)
    } catch (error) {
        console.error('Error deleting data:', error.message);
        console.log(err)
    }
}

cron.schedule('54 09 * * *', () => {
    deleteFolloups();
}, {
    scheduled: true,
   
});
