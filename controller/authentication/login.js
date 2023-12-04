const express = require('express'); 
const app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let conn = require('../../db/conn');

app.use(cookieParser());



app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

const isAuthdoctor = (req, res, next) => {
    
    if (req.session.isAuth && req.session.role == 3) {
        next();
    } else {
        res.redirect("/");
    }
    // var token = req.cookies.token;
};


const isAuthdispencery = (req, res, next) => {
    if (req.session.isAuth && req.session.role == 4) {
        next();
    } else {
        res.redirect("/");
    }
};

const isAuthpatient = (req, res, next) => {
    console.log("isAuthuser",req.session.isAuth,req.session.role);

    if (req.session.isAuth && req.session.role == 2) {
        console.log("isAuthuser if");
        next();
    } else {
        res.redirect("/");
    }


};

module.exports = { isAuthdoctor, isAuthdispencery, isAuthpatient };


module.exports.landingpage = (req,res) => {
	console.log("hello");
    res.render('authentication/index');
}


module.exports.loginpage = (req,res) => {
    console.log("hello")
    res.render('authentication/login',{message:req.session.message});
}

module.exports.send_email = (req,res) => {
    // res.send("Email Sent");
    console.log("Email Sent");
  }

module.exports.login = (req,res) => {
    var email = req.body.email;
    var password1 = req.body.password;


    conn.query("Select * from user__tbl where email = ? ",[email], async (err,results) => {
        if(err){
          console.log(err);
          req.session.message="Something went wrong"
          res.json({message:"Something went wrong"});
          res.redirect('/');
        }
        else{
            console.log("result",results);
            
            if(results.length == 0 || !(await bcrypt.compare(password1, results[0].password))){
                req.session.message="Invalid Email or Password";
                console.log("Invalid Email or Password");
                res.redirect('/',{status:"error",message:"Invalid Email or Password"});
            } else {
                if(results[0].is_active == 0){
                    req.session.message = "Please activate your account";
                    console.log("Please activate your account");
                    res.redirect('/');
                }
                else{
                    req.session.isAuth = true;
                    req.session.role = results[0].role_id;
                    const token = jwt.sign({ID:results[0].id}, 'secret', {expiresIn: '21900h'}, { withCredentials: true });
                    console.log("token", token)
                    var ID = results[0].id;
                    global_patient_id = ID;
                    console.log("jwt:-",token);

                    // req.session.tokenData = {
                    //     token: token,
                    //     expiration: Date.now() + 3600000 // Set expiration time (e.g., 1 hour from now)
                    // };

                    req.session.token = token;

                    // console.log("cookie:-",req.cookies.token);
                    
                    if(results[0].role_id == 2){
                        console.log("patient page");
                        // res.json({message:"super admin page"});
                        // req.session.message="Login Successfull!"
                        req.session.message = "Login Successfull!";
                        res.redirect('/p_dashboard');
                    }else if(results[0].role_id == 3){
                        console.log("doctor page");
                        // res.json({message:"admin page"});
                        req.session.message = "Login Successfull!";
                        res.redirect('/d_dashboard');
                    }else if(results[0].role_id == 4){
                        // res.json({message:"user page"});
                        console.log("dispencery page");
                        req.session.message = "Login Successfull!";
                        res.redirect('/dispencerydashboard');
                    }else{
                        console.log("role not found");
                        res.redirect('/');
                    }
                }
            }
        }
    });
}

function authMiddleware(req, res, next) {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }
  
    try {
      // Verify the token and decode its payload
      const decoded = jwt.verify(token, "secret");
  
      // Attach the user ID from the token to the request object for further use
      req.userId = decoded.ID;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
  