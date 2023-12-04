let conn = require('../../db/conn');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.patientdashboard = (req,res) => {

    const token = req.session.token;
    jwt.verify(token, 'secret', (error, decoded) => {
      console.log("I'm in");
      console.log("decoded",decoded)
        const patient_id = decoded.ID;
        console.log("patientId",patient_id);
          conn.query("SELECT COUNT(*) as total_appointment FROM prescription_tbl where patient_id = ?", [patient_id], (err, results)=>{
            if(err){
              console.log(err);
            }else{
              console.log("Results1:", results);
              res.render('patient/p_dashboard',{total_appointment_count:results[0].total_appointment});
            }
        });
    });
}


module.exports.patientprofilepage = (req,res) => {
    const token = req.session.token;
    jwt.verify(token, 'secret', (error, decoded) => {
      console.log("I'm in");
      console.log("decoded",decoded)
        const patient_id = decoded.ID;
        console.log("patientId",patient_id);
        conn.query("select * from user__tbl where id = ?",[patient_id],(err,result)=> {
          if(err){
            console.log(err);
          }
          else{
            res.render('patient/p_profile',{allpatients:result});
          }

        });
    });
}


module.exports.patientprofileeditpage = (req,res) => {
    const token = req.session.token;
    jwt.verify(token, 'secret', (error, decoded) => {
      console.log("I'm in");
      console.log("decoded",decoded)
        const patient_id = decoded.ID;
        console.log("patientId",patient_id);
          conn.query("select * from user__tbl where id = ?",[patient_id], (err,results) => {
            if(err){
                console.log(err);
                res.json({message:"Something went wrong"});
            }
            else{
                console.log("result:::: ",results);
                res.render("patient/p_editprofilepage",{allpatients:results});
            }
        });
      });
    }


module.exports.patientprofileedit = (req,res) => {
    var patientid = req.body.patient_id;
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var address = req.body.address;
  var gender = req.body.gender;
  var age = req.body.age;

  // update the data in user tabel in database from query
  conn.query("update user__tbl SET name = ? , email = ? , gender = ?, age = ?, mobile = ?, address = ? where id = ?",[name,email,gender,age,mobile,address,patientid], (err,results) => {
    if(err){
        console.log(err);
        res.json({message:"Something went wrong"});
    }
    else{
        console.log("result:::: ",results);
        res.redirect(`/p_profilepage`);
    }

  });
}
