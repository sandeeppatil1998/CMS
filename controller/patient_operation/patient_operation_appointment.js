let conn = require('../../db/conn');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.patientappointmentlist = (req,res) => {
    const token = req.session.token;
    jwt.verify(token, 'secret', (error, decoded) => {
      console.log("I'm in");
      console.log("decoded",decoded)
        const patient_id = decoded.ID;
        console.log("patientId",patient_id);

        conn.query("select at.*, aa.name as patient_name, bb.name as doctor_name from appointment_tbl as at , user__tbl as aa , user__tbl as bb where at.patient_id= aa.id and at.doctor_id=bb.id and patient_id = ?", [patient_id] , (err, results)=>{
          if(err){
            console.log(err);
            res.json({message:"Patient does not exists"});
          }
          else{
            console.log("result",results);
            console.log("length:",results.length)
            res.render('patient/p_appointmentlist',{allpatients:results,patientid:patient_id})
          } 
        })
      });
    }


    module.exports.patientbookappointmentpage = (req,res) => {
        let patirnt_id = req.params.id;
    let doctors;
    let timeslots;
    conn.query("select id, name from user__tbl where role_id = 3", (err, results) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(results);
            doctors = results;
            conn.query("select * from time_slot", (err, resultsss) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(resultsss);
                    timeslots = resultsss;
                    // res.render('patientappointmentForm', {doctors:doctors, timeslots:timeslots, patientId:patirnt_id});
                    res.render('patient/p_bookappointment', {doctors:doctors, timeslots:timeslots, patientId:patirnt_id});
                }
            });
        }
    });
}



module.exports.patientbookappointment = (req,res) => {
    var doctor_id = req.body.doctor_id;
  var patientwithid = req.body.patient_id;
  var appointment_date = req.body.appointment_date;
  console.log("appointmentdate::::", appointment_date);
  // var rev_appointment_date = appointment_date.split("-").reverse().join("-");
  var appointment_time = req.body.appointment_time;
  var note = req.body.note;
  if(note == undefined|| note == null){
        note = "";
        conn.query("Insert into appointment_tbl (doctor_id,patient_id,appointment_date,apmt_time_slot,note) values (?,?,?,?,?)",[doctor_id,patientwithid,appointment_date,appointment_time,note], (err,results) => {
            if(err){
              console.log(err);
              res.json({message:"Something went wrong"});
            }
            else{
              console.log("result",results);
              
              res.redirect('/p_appointment');
            }
          });
    }else{
        conn.query("Insert into appointment_tbl (doctor_id,patient_id,appointment_date,apmt_time_slot,note) values (?,?,?,?,?)",[doctor_id,patientwithid,appointment_date,appointment_time,note], (err,results) => {
            if(err){
              console.log(err);
              res.json({message:"Something went wrong"});
            }
            else{
              console.log("result",results);
              res.redirect('/p_appointment');
            }
          });
    }
}




module.exports.patientpreviousappointmentlist = (req,res) => {  
    const patient_id = req.params.id;
  const token = req.session.token;
  
  console.log("patient Id ::::", patient_id);

  jwt.verify(token, 'secret', (error, decoded) => {
    console.log("I'm in");
    console.log("decoded",decoded)
    const p_id = decoded.ID;
    console.log("doctorId",p_id);
    conn.query("select * from user__tbl where role_id = ?", [3], (err,results1) => {
      if(err){
        console.log(err);

      }
      else{
        console.log("results:::::",results1);
        doctorId = results1[0].id;
        // "SELECT apt.id, apt.note AS complain, apt.patient_id, pti.issue, ut.name AS patient_name, bb.name AS doctor_name, pit.note, pit.medicine, pit.prescription_date FROM prescription_tbl AS pit JOIN appointment_tbl AS apt ON pit.appointment_id = apt.id JOIN user__tbl AS ut ON pit.patient_id = ut.id JOIN user__tbl AS bb ON pit.doctor_id = bb.id JOIN patient_issue_tbl AS pti ON pit.patient_id = pti.patient_id WHERE pit.patient_id = ? AND pit.doctor_id = ?;",[patient_id,doctorId], (err,results) => {
        conn.query("SELECT apt.id, apt.note AS complain, apt.patient_id, pti.issue, ut.name AS patient_name, bb.name AS doctor_name, pit.note, pit.medicine, pit.prescription_date FROM prescription_tbl AS pit JOIN appointment_tbl AS apt ON pit.appointment_id = apt.id JOIN user__tbl AS ut ON pit.patient_id = ut.id JOIN user__tbl AS bb ON pit.doctor_id = bb.id JOIN patient_issue_tbl AS pti ON pit.patient_id = pti.patient_id WHERE pit.patient_id = ? AND pit.doctor_id = ?;",[patient_id,doctorId], (err,results) => {
          if(err){
          console.log(err);
          res.json({message:"Something went wrong"});
          }
          else{
          console.log("result:::: ",results);
          res.render('patient/p_previousappointment',{allprescription:results});
          }
      });
      }
    })
  
    
  });
}