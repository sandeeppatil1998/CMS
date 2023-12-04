let conn = require('../../db/conn');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



module.exports.doctordashboard = (req,res) => {


  var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var formattedDate = yyyy+'-'+mm+'-'+dd;


    // const tokenData = req.session.tokenData;
    // if (!tokenData || Date.now() > tokenData.expiration) {
    //     // Token is expired or not found, redirect to login
    //     res.redirect('/');
    // } else {
    //     // Token is valid, continue processing
        
    //     // Access the token
    //     const token = tokenData.token;

    var token = req.session.token;

  console.log("token:",token);
  jwt.verify(token, "secret", (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      res.redirect('/');
    } else {
      console.log("decodedToken:",decodedToken);
      // req.session.isAuth = true;
      // req.session.role = decodedToken.role;
      // req.session.user_id = decodedToken.user_id;
      // req.session.email = decodedToken.email;

    

    
    conn.query("SELECT COUNT(*) as patient_count FROM user__tbl WHERE role_id = 2;", (err, results1)=>{
        if(err){
          console.log(err);
        }else{
          console.log("Results1:", results1);
          conn.query("SELECT COUNT(*) as today_appointment FROM appointment_tbl WHERE appointment_date = ? and status = 'Approved';",[formattedDate], (err, results2)=>{
            if(err){
              console.log(err);
            }else{
              console.log("Results2:", results2);
              conn.query("SELECT COUNT(*) as total_appointment FROM prescription_tbl;", (err, results3)=>{
                if(err){
                  console.log(err);
                }else{
                  console.log("Results3:", results3);
                  res.render('doctor/d_dashboard',{patient_count:results1[0].patient_count, total_appointment_count:results3[0].total_appointment, today_appointment_count:results2[0].today_appointment})
                }
              });
            }
          });
        }
    });
  }
  });
// }
};


module.exports.addpatient = (req,res) => {
    var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var address = req.body.address;
  var gender = req.body.gender;
  var age = req.body.age;
  var password = req.body.password;
  var hasedPswd = bcrypt.hashSync(password, 15);

  // console.log("Images from request body:::",images);

  const imagePath = req.file ? req.file.path : null;
  // const actual_image = req.file.path;
  console.log("imagePath",imagePath);
  // console.log("actual_image:::::::::",actual_image);

  let imagePaths="";
  if(imagePath == null){
    imagePaths = "profile.png";
  };
  if(imagePath != null){
    imagePaths = imagePath.replace(/\\/g, "/");
    imagePaths = path.basename(imagePaths);
  }

  console.log("imagePaths",imagePaths);

  //get the basename from the imagePaths

  // imagePaths = path.basename(imagePaths);


  // imagePaths = imagePaths.replace("public", "");
  console.log("imagePaths::::",imagePaths);



  conn.query("Select * from user__tbl where email = ? ",[email], (err,results) => {
    if(err){
      console.log(err);
      res.json({message:"Something went wrong"});
    }
    else{
      if(results.length > 0){
        req.session.message = "Email already exists, Please Login/or try signing up with another email";
        res.redirect('/d_patientslist');
      }else{
        conn.query("Insert into user__tbl (name,email,gender,age,password,mobile,address,image,role_id) values (?,?,?,?,?,?,?,?,?)",[name,email,gender,age,hasedPswd,mobile,address,imagePaths,2], (err,results) => {
          if(err){
            console.log(err);
            res.json({message:"Something went wrong"});
          }
          else{
            conn.query("Insert into patient_issue_tbl (patient_id,issue) values (?,?)",[results.insertId,""], (err,results1) => {
              if(err){ 
                console.log(err);
                res.json({message:"Something went wrong"});
              }
              else{
                console.log("Add patient Results:", results1);
                req.session.message = "Patient Added Successfully!";
                res.redirect('/d_patientslist');
              }
            });
            
          }
        });
      }
    }
  });
};



module.exports.patientslist = (req,res) => {
  console.log("req.session.message::::patientlist");
    conn.query("select * from user__tbl where role_id = 2", (err,results) => {
        if(err){
            console.log(err);
            res.json({message:"Something went wrong"});
        }
        else{
            console.log("result:::: ",results);
            res.render("doctor/d_patients",{allpatients:results, message:req.session.message});
        }
    });
};



module.exports.viewpatientprofile = (req,res) => {
    var patientid = req.params.id;

  conn.query("select * from user__tbl where id = ?",[patientid], (err,results) => {
    if(err){
        console.log(err);
        res.json({message:"Something went wrong"});
    }
    else{
        console.log("result:::: ",results);
        res.render("doctor/d_patientprofile",{allpatients:results});
    }
});
}



module.exports.editpatientprofilepage = (req,res) => {
    var patientid = req.params.id;

  conn.query("select * from user__tbl where id = ?",[patientid], (err,results) => {
    if(err){
        console.log(err);
        res.json({message:"Something went wrong"});
    }
    else{
        console.log("result:::: ",results);
        res.render("doctor/d_editpatientprofile",{allpatients:results});
    }
});
}


module.exports.editpatientprofile = (req,res) => {
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
        res.redirect(`/d_viewpatientprofile/${patientid}`);
    }

  });
}


module.exports.bookappointmentpage = (req,res) => {
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
                    res.render('doctor/d_bookappointment', {doctors:doctors, timeslots:timeslots, patientId:patirnt_id});
                }
            });
        }
    });
    
};



module.exports.bookappointment = (req,res) => {
    console.log("I'm in to appointment");
    var patientwithid = req.body.patient_id;
    var appointment_date = req.body.appointment_date;
    var appointment_time = req.body.appointment_time;
    var note = req.body.note;

    const token = req.session.token;
    jwt.verify(token, 'secret', (error, decoded) => {
      console.log("I'm in");
      console.log("decoded",decoded)
        const doctor_id = decoded.ID;
        console.log("patientId",doctor_id);

        if(note == undefined|| note == null){
            note = "";
            conn.query("Insert into appointment_tbl (doctor_id,patient_id,appointment_date,apmt_time_slot,note) values (?,?,?,?,?)",[doctor_id,patientwithid,appointment_date,appointment_time,note], (err,results) => {
                if(err){
                  console.log(err);
                  res.json({message:"Something went wrong"});
                }
                else{
                  console.log("result",results);
                  res.redirect('/appointment');
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
                  res.redirect('/d_appointment');
                }
              });
        }
        
    });
};




module.exports.patientpriviousappointment = (req,res) => {
    const patient_id = req.params.id;
    console.log("patient Id ::::", patient_id);
  const token = req.session.token;
  
  console.log("patient Id ::::", patient_id);

  jwt.verify(token, 'secret', (error, decoded) => {
    console.log("I'm in");
    console.log("decoded",decoded)
    const doctorId = decoded.ID;
    console.log("doctorId",doctorId);
  
    conn.query("SELECT apt.id, apt.note AS complain, apt.patient_id, pti.issue, ut.name AS patient_name, bb.name AS doctor_name, pit.note, pit.medicine, pit.prescription_date FROM prescription_tbl AS pit JOIN appointment_tbl AS apt ON pit.appointment_id = apt.id JOIN user__tbl AS ut ON pit.patient_id = ut.id JOIN user__tbl AS bb ON pit.doctor_id = bb.id JOIN patient_issue_tbl AS pti ON pit.patient_id = pti.patient_id WHERE pit.patient_id = ? AND pit.doctor_id = ?;",[patient_id,doctorId], (err,results) => {
        if(err){
        console.log(err);
        res.json({message:"Something went wrong"});
        }
        else{
        console.log("result for previous appointment:::: ",results);
        res.render('doctor/d_previousappointment',{allprescription:results});
        }
    });
  });
}

