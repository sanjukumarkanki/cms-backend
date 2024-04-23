const express = require('express');
const app = express();
const cors = require("cors")
const mysql = require('mysql');

app.use(express.json());
app.use(cors())

app.listen(3003, () => {
    console.log("Server is running on port 3003");
});

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ciondatabase'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Route to get leads
app.get("/get-leads", async (req, res) => {
    try {
        const rows = await executeQuery(`SELECT * FROM allleads `);
        // const convertedArray = rows.map(each => ({
        //     id: each.lead_id,
        //     phoneNumber: each.phone_number,
        //     callerName: each.caller_name,
        //     patientName: each.patient_name,
        //     dateOfContact: each.date_of_contact,
        //     leadChannel: each.lead_channel,
        //     campaign:each.campaign,
        //     coachName: each.coach_name,
        //     age: each.age,
        //     gender: each.age,
        //     typeOfCancer: each.type_of_cancer,
        //     location: each.location,
        //     email: each.email,
        //     relationsToPatient:each.relations_to_patient,
        //     coachNotes: each.coach_notes,
        //     inboundOutbound: each.inbound_outbound,
        //     relevant: each.relevant,
        //     interested: each.interested,
        //     conv: each.conv,
        //     preOp: each.pre_op,
        //     level: each.level,
        //     stage: each.stage
        // }))
        res.json(rows);
    } catch (err) {
        console.error('Error executing query: ' + err.stack);
        res.status(500).send('Error executing query');
    }
});

app.get("/patiens/:id", async (req,res) => {
    const {id} = req.params
    try{
        const getUserDetails = await executeQuery(`SELECT * FROM allleads WHERE id = ${id};`);
        if (getUserDetails.length > 0) {
            const userDetails = getUserDetails[0]; // Access the first (and only) element of the array
            const convertedArray = {
                id: userDetails.lead_id,
                phoneNumber: userDetails.phone_number,
                callerName: userDetails.caller_name,
                patientName: userDetails.patient_name,
                dateOfContact: userDetails.date_of_contact,
                leadChannel: userDetails.lead_channel,
                campaign: userDetails.campaign,
                coachName: userDetails.coach_name,
                age: userDetails.age,
                gender: userDetails.age, // Note: Should this be userDetails.gender?
                typeOfCancer: userDetails.type_of_cancer,
                location: userDetails.location,
                email: userDetails.email,
                relationsToPatient: userDetails.relations_to_patient,
                coachNotes: userDetails.coach_notes,
                inboundOutbound: userDetails.inbound_outbound,
                relevant: userDetails.relevant,
                interested: userDetails.interested,
                conv: userDetails.conv,
                preOp: userDetails.pre_op,
                level: userDetails.level,
                stage: userDetails.stage
            };
            res.status(200).json(convertedArray);
            console.log(convertedArray)
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
      coachName,
      coachNotes,
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
        INSERT INTO allleads ( phoneNumber, callerName, age, campaign, coachName, coachNotes, conv,
           email, gender, inboundOutbound, interested, leadchannel, level, location, patientName, preOp, relationsToPatient, relevant, stage, typeOfCancer)
        VALUES (
         ${parseInt(phoneNumber)},  '${callerName}', '${age}', '${campaign}', '${coachName}', '${coachNotes}', '${conv}',
 '${email}', '${gender}', '${inboundOutbound}', '${interested}', '${leadChannel}', '${level}', '${location}', '${patientName}',
          '${preOp}', '${relationsToPatient}', '${relevant}', '${stage}', '${typeOfCancer}'
        );
      `);
  
      res.send({ message: "New Lead Added Successfully" });
    } catch (err) {
      res.status(500).send({ message: err.message });
      console.log(err)
    }
  });
  
app.put("/update-lead", async (req, res) => {
    const { field, id, value } = req.body;
    try {
        const rows = await executeQuery(`SELECT * FROM ciondatabase.allleads WHERE id = ${id}`);
        if(rows.length > 0){
            const updateValue = await executeQuery(`UPDATE ciondatabase.allleads SET ${field}='${value}' WHERE id = ${id}`);
            res.status(200).send("Lead updated successfully");
        }else{
            res.status(404).send("Lead not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update lead");
    }
});


// Function to execute a SQL query
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
