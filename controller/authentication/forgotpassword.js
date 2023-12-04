var conn = require('../../db/conn');
const bcrypt = require('bcryptjs');


const sendMail = require('../../commonapi/sendmail');
const randomstring = require('randomstring');

module.exports.forgotpasswordpage = (req,res) => {
    res.render('authentication/forgotpassword',{message:req.session.message});
}

module.exports.forgotpassword = (req,res) => {
    var email = req.body.email;

    conn.query("Select * from user__tbl where email = ? ",[email], (err,results) => {
        if(err){
          console.log(err);
          res.json({message:"Something went wrong"});
        }
        else{
          if(results.length > 0){
            let mailSubject = "Reset Password Link";
            const randomToken = randomstring.generate();
            let content = `<h1>Hi ${results[0].name}</h1>
            <p>Click on the link below to reset your password</p>

            <a href="http://localhost:4000/resetpassword/${randomToken}">Click here</a>
            `;

            sendMail(email, mailSubject, content);

            conn.query("Update user__tbl set tokken = ? where email = ?",[randomToken,email], (err,results) => {
              if(err){
                console.log(err);
                res.json({message:"Something went wrong"});
              }
              else{
                req.session.message = "Please check your email for reset password link";
                console.log("Please check your email for reset password link");
                res.redirect('/');
              }
            });
          }else{
            req.session.message = "Email does not exists, Please try again";
            res.redirect('/forgotpassword');
          }
        }
    });
}


module.exports.resetpasswordpage = (req,res) => {
    var tokken = req.params.token;
    res.render('authentication/resetpassword',{tokken:tokken});
}

module.exports.resetpassword = async(req,res) => {

    var password = req.body.password;
    var confirm_password = req.body.confirmpassword;
    var tokken = req.params.token;
    var hasedPswd = await bcrypt.hash(password, 10);

    conn.query("Select * from user__tbl where tokken = ? ",[tokken], (err,results) => {
        if(err){
          console.log(err);
          res.json({message:"Something went wrong"});
        }
        else{
          if(results.length > 0){
            if(password != confirm_password){
                console.log("Password and Confirm Password does not match");
              req.session.message="Password and Confirm Password does not match";
              res.redirect('/resetpassword');
            }
            else{
              conn.query("Update user__tbl set password = ? where tokken = ?",[hasedPswd,tokken], (err,results) => {
                if(err){
                  console.log(err);
                  res.json({message:"Something went wrong"});
                }
                else{
                  req.session.message = "Password reset successfully, Please login";
                  res.redirect('/');
                }
              });
            }
          }else{
            req.session.message = "Invalid token, Please try again";
            res.redirect('/resetpassword');
          }
        }
    });
}

