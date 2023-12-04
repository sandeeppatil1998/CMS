let conn = require('../../db/conn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.patientprescriptiondetails = (req,res) => {
    var appointment_id = req.params.id;
  const token = req.session.token;

  console.log("appointment_id:::: ",appointment_id);
  // SELECT apt.*, ut.name, pit.issue from appointment_tbl as apt, user__tbl as ut, patient_issue_tbl as pit, prescription_tbl as pt WHERE ut.id=apt.patient_id and apt.id=pt.appointment_id AND pit.id = pt.side_effects and apt.id = 17;

  // SELECT COUNT(*) FROM prescription_tbl, appointment_tbl WHERE appointment_tbl.patient_id=prescription_tbl.patient_id AND appointment_tbl.patient_id=7;
  conn.query("SELECT apt.*, ut.name, pit.issue, pit.id as issue_id,bb.name as docname from appointment_tbl as apt, user__tbl as ut,user__tbl as bb, patient_issue_tbl as pit WHERE bb.id= apt.doctor_id AND ut.id=apt.patient_id AND pit.patient_id=apt.patient_id AND apt.id= ?",[appointment_id], (err,results) => {


    if(err){
    console.log(err);
  }else{
    console.log("RESULTS1::::    ", results);
    conn.query("SELECT COUNT(*) as previous_prescription , patient_id FROM prescription_tbl where patient_id=?",[ results[0].patient_id], (err,results1) => {
      if(err){
        console.log(err);
      }else{

        console.log("RESULTS::::    ", results1);
        if(results1[0].patient_id == null){
          res.redirect(`/d_prescription/${appointment_id}`);
        }else{
        res.render('doctor/d_patientcheckupdetails',{appointment_detail:results , count_prescription:results1});
        }
      }
    });
  }
});
}

module.exports.doctorpatientpreviousappointmnetdetails = (req,res) => {
    const patient_id = req.params.id;
  const token = req.session.token;
  
  console.log("patient Id ::::", patient_id);

  jwt.verify(token, 'secret', (error, decoded) => {
    console.log("I'm in");
    console.log("decoded",decoded)
    const doctorId = decoded.ID;
    console.log("doctorId",doctorId);
  
    conn.query("Select pit.appointment_id,pit.patient_id,pti.issue, ut.name as patient_name,bb.name as doctor_name,pit.note,pit.medicine,pit.prescription_date from prescription_tbl as pit, user__tbl as ut, user__tbl as bb,patient_issue_tbl as pti where pit.patient_id=pti.patient_id and pit.patient_id= ut.id and pit.doctor_id= bb.id and pit.patient_id = ? and pit.doctor_id= ?",[patient_id,doctorId], (err,results) => {
        if(err){
        console.log(err);
        res.json({message:"Something went wrong"});
        }
        else{
        console.log("result:::: ",results);
        res.render('doctor/d_doctorpreviousappointment',{allprescription:results});
        }
    });
  });
}


module.exports.prescriptionpage = (req,res) => {
    var appointment_id = req.params.id;
  const token = req.session.token;

  console.log("appointment_id:::: ",appointment_id);

  conn.query("SELECT apt.*,ul.name,pit.issue, pit.id as issue_id,bb.name as docname from appointment_tbl as apt, user__tbl as ul,user__tbl as bb, patient_issue_tbl as pit WHERE bb.id= apt.doctor_id and ul.id= apt.patient_id and pit.patient_id=apt.patient_id and apt.id= ?",[appointment_id], (err,results) => {
  if(err){
    console.log(err);
  }else{
    console.log("RESULTS1 in prescription::::    ", results);
    res.render('doctor/d_prescription',{appointment_detail:results});
  }
});
}


module.exports.prescription = (req,res) => {
    const {appointment_id,patient_id,doctor_id,issue,medicine_list,date,issue_id,note} = req.body;
    const token = req.session.token;
    conn.query("update patient_issue_tbl SET issue = ? where patient_id = ?",[issue,patient_id], (err,results) => {
        if(err){
          console.log(err);
        }else{
          console.log("RESULTS1::::    ", results);
          conn.query("insert into prescription_tbl (appointment_id,patient_id,doctor_id,side_effects,note,medicine,prescription_date) values (?,?,?,?,?,?,?)",[appointment_id,patient_id,doctor_id,issue_id,note,medicine_list,date], (err,results1) => {
            if(err){
              console.log(err);
            }else{
              conn.query("update appointment_tbl SET status = ? where id = ?",["Done",appointment_id], (err,results2) => {
                if(err){
                  console.log(err);
                }else{
                  
      
                }
              });
              console.log("RESULTS::::    ", results1);
              req.session.message = "Prescription Added Successfully";
              res.redirect('/d_todayappointment');
            }
          });
        }
      });
}