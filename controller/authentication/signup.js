const { query } = require("express");


// require message.json file
// const alert = require('../../message.json');

var conn = require('../../db/conn');
const path = require('path');
const bcrypt = require('bcryptjs');
const sendMail = require('../../commonapi/sendmail');
const randomstring = require('randomstring');
require('../../router/route')
require('dotenv').config();



module.exports.signuppage = (req,res) => {
  //  req.session.message = "";
   
    res.render('authentication/signup',{message:req.session.message});
}

module.exports.signup = async(req,res) => {
  
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var address = req.body.address;
    var gender = req.body.gender;
    var age = req.body.age;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirmpassword;
    var hasedPswd = await bcrypt.hash(password, 10);

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
    
    let sql="SELECT * FROM user__tbl WHERE email='"+email+"'";
    conn.query(sql, (err,results) => {
      if(err){
        console.log(err);
        // res.json({message:"Something went wrong"});
      }
      else{
        if(results.length > 0){
          req.session.message = "Email already exists, Please Login/or try signing up with another email";
          console.log("Email already exists, Please Login/or try signing up with another email");
          res.redirect('/signup');
        }else{
          if(password != confirm_password){
            // console.log("Password and Confirm Password does not match");
            req.session.message="Password and Confirm Password does not match";
            res.redirect('/signup');
          }
          else{
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
                  let mailSubject = "Email Activation Link";
                  const randomToken = randomstring.generate();
                  let content = `<h1>Hi ${name}</h1>
                  <p>Click on the link below to activate your account</p>

                  <a href="http://${process.env.SERVER_HOST}:${process.env.PORT}/activatepage/${randomToken}">Click here</a>
                  `;

                  sendMail(email, mailSubject, content);

                  conn.query("Update user__tbl set tokken = ? where email = ?",[randomToken,email], (err,results) => {
                    if(err){
                      console.log(err);
                      // res.json({message:"Something went wrong"});
                    }
                    else{
                      req.session.message = "Please check your email for activation link";
                      res.redirect('/');
                    }
                  });
                }
                });
              }
            });
          }
        }
      }
    });
}


module.exports.activatepage = (req,res) => {
  tokken = req.params.token;

  res.render('authentication/activate',{tokken:tokken});
}


module.exports.activate = (req,res) => {

  conn.query("Select * from user__tbl where tokken = ? ",[req.params.token], (err,results) => {
    if(err){
      console.log(err);
      res.json({message:"Something went wrong"});
    }
    else{
      if(results.length > 0){
        conn.query("Update user__tbl set is_active = ? where tokken = ?",[1,req.params.token], (err,results) => {
          if(err){
            console.log(err);
            // res.json({message:"Something went wrong"});
          }
          else{
            // req.session.message = "Account activated successfully, Please Login";
            res.redirect('/');
          }
        });
      }else{
        // req.session.message = "Invalid token";
        res.redirect('/signup');
      }
    }
  });
}