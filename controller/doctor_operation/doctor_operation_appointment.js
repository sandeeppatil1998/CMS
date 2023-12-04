let conn = require('../../db/conn');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');





module.exports.approveappointmentpage = (req,res) => {
    const token = req.session.token;
    jwt.verify(token, 'secret', (error, decoded) => {
      console.log("I'm in");
      console.log("decoded",decoded)
      const doctorId = decoded.ID;
      console.log("doctorId",doctorId);
      conn.query("select appointment_tbl.id,user__tbl.id as patientid,user__tbl.name,appointment_tbl.appointment_date,time_slot.time,appointment_tbl.note,appointment_tbl.status from appointment_tbl INNER JOIN user__tbl ON user__tbl.id=appointment_tbl.patient_id INNER JOIN time_slot ON appointment_tbl.apmt_time_slot=time_slot.id where status = 'pending' and doctor_id = ?",[doctorId], (err,results) => {
          if(err){
          console.log(err);
          res.json({message:"Something went wrong"});
          }
          else{
          console.log("result:::: ",results);
          res.render("doctor/d_approveappointment",{alldoctorappointment:results, message:req.session.message});
          }
      });
  });
}



module.exports.approveappointment = (req,res) => {
    var apntmnt_id = req.params.id;
const token = req.session.token;

jwt.verify(token, 'secret', (error, decoded) => {
  console.log("I'm in");
  console.log("decoded",decoded)
  const doctorId = decoded.ID;
  console.log("doctorId",doctorId);
  conn.query("Update appointment_tbl SET status = 'Approved' where id=? ",[apntmnt_id], (err,results) => {
      if(err){
      console.log(err);
      res.json({message:"Something went wrong"});
      }
      else{
      console.log("result:::: ",results);
      req.session.message = "Appointment Approved! Please Follow Up.";
      res.redirect('/d_appointment');
      }
  });
});
}


module.exports.rejectappointment = (req,res) => {
    var apntmnt_id = req.params.id;
const token = req.session.token;

jwt.verify(token, 'secret', (error, decoded) => {
  console.log("I'm in");
  console.log("decoded",decoded)
  const doctorId = decoded.ID;
  console.log("doctorId",doctorId);
  conn.query("Update appointment_tbl SET status = 'Rejected' where id=? ",[apntmnt_id], (err,results) => {
      if(err){
      console.log(err);
      res.json({message:"Something went wrong"});
      }
      else{
      console.log("result:::: ",results);
      req.session.message = "Appointment Rejected!";
      res.redirect('/d_appointment');
      }
  });
});
}



module.exports.todayappointment = (req,res) => {
    const token = req.session.token;

  // get today's date in a form of 2023-05-01T18:30:00.000Z format
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var formattedDate = yyyy+'-'+mm+'-'+dd;

  console.log("Formatted Date:::  ",formattedDate);
  
  jwt.verify(token, 'secret', (error, decoded) => {
    console.log("I'm in");
    console.log("decoded",decoded)
    const doctorId = decoded.ID;
    console.log("doctorId",doctorId);
    conn.query("select appointment_tbl.id,user__tbl.id as patientid,user__tbl.name,appointment_tbl.appointment_date,time_slot.time,appointment_tbl.note,appointment_tbl.status from appointment_tbl INNER JOIN user__tbl ON user__tbl.id=appointment_tbl.patient_id INNER JOIN time_slot ON appointment_tbl.apmt_time_slot=time_slot.id where appointment_date= ? and doctor_id = ? and status = 'Approved'",[formattedDate,doctorId], (err,results) => {
        if(err){
        console.log(err);
        res.json({message:"Something went wrong"});
        }
        else{
        console.log("result1:::: ",results);
        res.render("doctor/d_todayappointment",{alldoctorappointment:results});
        }
    });
  });
}



