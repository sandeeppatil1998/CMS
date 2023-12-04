var express = require('express');
var app = express();

require('./db/conn')

const bodyParser = require('body-parser');
var path = require('path');
const ejs = require("ejs");
const fs = require("fs");
const nodemailer = require("nodemailer");
const cors = require('cors');

const allowedOrigins = [
  'https://clickstomemories.com',
  'https://ayushmanhomeo.com',
  'http://159.89.205.90:3000'
  // Add more origins as needed
];

const corsOptions = {
  origin: allowedOrigins,
};

// app.use(cors({ origin: 'https://clickstomemories.com' }));
app.use(cors(corsOptions));


const flash = require('connect-flash');

// var cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { log } = require('console');
const router = require('./router/route');

app.use(router);

// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

require('dotenv').config();


const static_path = path.join(__dirname, "public");
const template_path = path.join(__dirname, "templates/views");
const partials_path = path.join(__dirname, "./templates/partials");
const image_path = path.join(__dirname, "./public/image");


const admin_path = path.join(__dirname, "./templates/views/admin");
console.log(admin_path);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, image_path)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });

  const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    }
  });

  app.use(session({ 
    secret: 'secret', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 3600000 }
  }));

  const isAuthsuperadmin = (req, res, next) => {
    if (req.session.isAuth && req.session.role == 1) {
      next();
    } else {
      res.redirect("/");
    }
  };

const isAuthadmin = (req, res, next) => {
    if (req.session.isAuth && req.session.role == 2) {
      next();
    } else {
      res.redirect("/");
    }
  };

const isAuthuser = (req, res, next) => {
    if (req.session.isAuth && req.session.role == 3) {
      next();
    } else {
      res.redirect("/");
    }
  };

  module.exports = isAuthuser;




app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(express.static(static_path));
app.set('view engine', "ejs");
app.set("views", template_path);  
// app.set('views', [template_path, admin_path]);








// this is for CTM

app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  app.use(express.json());


  const SMTP_MAIL = "clickstomemories@gmail.com";
const SMTP_PASSWORD = "tsac yggm vnoj dity";
const SMTP_PORT = 587;
const SMTP_SERVER = "smtp.gmail.com"; 

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER,
  port: SMTP_PORT,
  secure: false, // use SSL
  requireTLS: true,
  auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD
  }
});

  app.post("/send_contact_form_details" , async(req,res) => {
    console.log("hi")
    console.log(req.body);
    const {name, phone, email, message} = req.body;

    if (!name || !phone || !email || !message) {
        return res.status(400).json({ error: 'Please Fill All The Field' });
    }
    console.log(name)
    let admin_email = "clickstomemories@gmail.com"
    let user_email = email
    let mailSubject = "Contact Us Form"
    let contents = `<!doctype html>
    <html lang="en-US">
    <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>Form</title>
    <style type="text/css">
              a:hover {
                text-decoration: underline !important;
              }
    </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <table cellspacing="0" cellpadding="0" width="100%" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
    <tr>
    <td>
    <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" cellpadding="0" cellspacing="0">
    <tr>
    <td>
    <br>
    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:570px;background-color: #ffffff; border-radius:3px; text-align:center; box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
    <tr>
    <td style="padding:0 35px; ">
    <h1 style="color:#1d9bf0; font-weight:700; margin-top:2px;font-size:20px;font-family:Arial, Helvetica, sans-serif;text-align:center; line-height:2">Contact Us Form Details</h1>
    <h1 style="color:#455056; font-weight:500; margin-top:10px;font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; line-height:2; font-weight: bold; text-align: center;">Name: ${name}</span></h1>
    <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Phone: ${phone}</span></h1>
    <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Email: ${email}</span></h1>

    <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Message: ${message}</span></h1>

                              <!-- Include the image tags here -->
    <span style=" margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
    </td>
    </tr>
    <tr style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
    <td style="height:100px; width : 100%; background-color:#0cbbe1 ;">
    <h1 style=" color:white;padding:0 35px; font-weight:500; margin-top:2px;font-size:15px;font-family:'Rubik',sans-serif;vertical-align:start; line-height:2; font-weight: bold;">Click To Memories</h1>
    <br>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td style="height:20px;">&nbsp;</td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`;

    const mailOptions = {
        from: SMTP_MAIL,
        to: admin_email,
        subject: mailSubject,
        html: contents
    };

    const usermailOptions = {
        from: SMTP_MAIL,
        to: user_email,
        subject: mailSubject,
        html: contents
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        const user_info = await transporter.sendMail(usermailOptions);
        console.log(info);
        console.log(user_info);
        return res.json({ message: 'Email sent successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send the email' });
    }

  });


  app.post('/send-email', async (req, res) => {

    let package_name = req.body.package_name;
    console.log("package_name",package_name);
    if (package_name === "Baby Photoshoot With Family Photoshoot" || package_name === "Kids Photoshoot With Family Photoshoot") {
        console.log(req.body);
        const { candid,email, mailSubject, content, theme1, theme2, date, time, price } = req.body;


        if (!email || !mailSubject || !content || !candid || !theme1 || !theme2 || !date || !time || !price) {
            return res.status(400).json({ error: 'Missing email, mailSubject, or content in the request body' });
        }

        console.log('Sending email to ', content);

        let contentObject = JSON.parse(content);

        console.log(contentObject);
        let name = contentObject.Name;
        let phone = contentObject.Phone;

        let selectedImagesUrls1 = contentObject.ImageName1;
        let selectedImagesUrls2 = contentObject.ImageName2;

        console.log(name);
        console.log(phone);
        console.log(theme1);
        console.log(theme2);
        console.log(selectedImagesUrls1);
        console.log(selectedImagesUrls2);
        // Instead of splitting, parse the JSON array
        const imageUrls1 = JSON.parse(selectedImagesUrls1);
        const imageUrls2 = JSON.parse(selectedImagesUrls2);

        const containsNull = array => array.some(url => url === null);

       

        if(containsNull(imageUrls1)) {

            console.log("imageUrls1 contains null");
            return res.status(400).json({ error: 'imageUrls1 contains null' });
        }

        if(containsNull(imageUrls2)) {

            console.log("imageUrls2 contains null");
            return res.status(400).json({ error: 'imageUrls2 contains null' });
        }

        // Create an array of image tags using a loop
        const imageTags1 = imageUrls1.map(url => `<img src="${url.trim()}" style="max-width: 100%; height: auto; margin : 10px;" />`).join('');
        console.log(imageTags1);

        const imageTags2 = imageUrls2.map(url => `<img src="${url.trim()}" style="max-width: 100%; height: auto; margin : 10px;" />`).join('');
        console.log(imageTags2);
        

        let admin_email = "clickstomemories@gmail.com";

        let user_contents = `<!doctype html>
        <html lang="en-US">
        <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Form</title>
        <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
        </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <table cellspacing="0" cellpadding="0" width="100%" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
        <td>
        <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" cellpadding="0" cellspacing="0">
        <tr>
        <td>
        <br>
        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:570px;background-color: #ffffff; border-radius:3px; text-align:center; box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <tr>
        <td style="padding:0 35px; ">
       
        <h1 style="color:#1d9bf0; font-weight:700; margin-top:2px;font-size:20px;font-family:Arial, Helvetica, sans-serif;text-align:center; line-height:2">Order placed successfully.</h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px;font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; line-height:2; font-weight: bold; text-align: center;">Name: ${name}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Phone: ${phone}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Email: ${email}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Option: ${candid}</span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Package Name: ${package_name} </span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Date: ${date} </span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Start Time: ${time} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Amount : ${price} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Selected Images: </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Theme 1: ${theme1} </span></h1>                       
        ${imageTags1} <!-- Include the image tags here -->
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Theme 2: ${theme2} </span></h1>
                                ${imageTags2} <!-- Include the image tags here -->
        <span style=" margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
        </td>
        </tr>
        <tr style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <td style="height:100px; width : 100%; background-color:#0cbbe1 ;">
        <h1 style=" color:white;padding:0 35px; font-weight:500; margin-top:2px;font-size:15px;font-family:'Rubik',sans-serif;vertical-align:start; line-height:2; font-weight: bold;">Click To Memories</h1>
        <br>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td style="height:20px;">&nbsp;</td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`;


        let admin_contents = `<!doctype html>
        <html lang="en-US">
        <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Form</title>
        <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
        </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <table cellspacing="0" cellpadding="0" width="100%" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
        <td>
        <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" cellpadding="0" cellspacing="0">
        <tr>
        <td>
        <br>
        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:570px;background-color: #ffffff; border-radius:3px; text-align:center; box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <tr>
        <td style="padding:0 35px; ">
       
        <h1 style="color:#1d9bf0; font-weight:700; margin-top:2px;font-size:20px;font-family:Arial, Helvetica, sans-serif;text-align:center; line-height:2">Order received successfully.</h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px;font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; line-height:2; font-weight: bold; text-align: center;">Name: ${name}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Phone: ${phone}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Email: ${email}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Option: ${candid}</span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Package Name: ${package_name} </span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Date: ${date} </span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Start Time: ${time} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Amount : ${price} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Selected Images: </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Theme 1: ${theme1} </span></h1>                       
        ${imageTags1} <!-- Include the image tags here -->
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Theme 2: ${theme2} </span></h1>
                                ${imageTags2} <!-- Include the image tags here -->
        <span style=" margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
        </td>
        </tr>
        <tr style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <td style="height:100px; width : 100%; background-color:#0cbbe1 ;">
        <h1 style=" color:white;padding:0 35px; font-weight:500; margin-top:2px;font-size:15px;font-family:'Rubik',sans-serif;vertical-align:start; line-height:2; font-weight: bold;">Click To Memories</h1>
        <br>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td style="height:20px;">&nbsp;</td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`;

        const mailOptions = {
            from: SMTP_MAIL,
            to: email,
            subject: mailSubject,
            html: user_contents
        };

        const adminmailOptions = {
            from: SMTP_MAIL,
            to: admin_email,
            subject: mailSubject,
            html: admin_contents
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            const admin_info = await transporter.sendMail(adminmailOptions);
            console.log(admin_info);
            console.log(info);
            console.log(`Email sent successfully to ${email}`);
            return res.json({ message: 'Email sent successfully'});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send the email' });
        }

    }else if (package_name == "Maternity Photoshoot" || package_name == "Familly Photoshoot & Couple Photoshoot") {

        console.log(req.body);
        const { candid,email, mailSubject, content, date, time, price } = req.body;


        if (!email || !mailSubject || !content || !candid || !date || !time || !price) {
            return res.status(400).json({ error: 'Missing email, mailSubject, or content in the request body' });
        }

        console.log('Sending email to ', content);

        let contentObject = JSON.parse(content);

        console.log(contentObject);
        let name = contentObject.Name;
        let phone = contentObject.Phone;

        let selectedImagesUrls = contentObject.ImageName;

        console.log(name);
        console.log(phone);
        console.log(selectedImagesUrls);
        // Instead of splitting, parse the JSON array
        const imageUrls = JSON.parse(selectedImagesUrls);

        const containsNull = array => array.some(url => url === null);

        if(containsNull(imageUrls)) {

            console.log("imageUrls contains null");
            return res.status(400).json({ error: 'imageUrls contains null' });
        } 

        // Create an array of image tags using a loop
        const imageTags = imageUrls.map(url => `<img src="${url.trim()}" style="max-width: 100%; height: auto; margin : 10px;" />`).join('');
        console.log(imageTags);
        
        console.log("imageUrls",imageTags);

        let admin_email = "clickstomemories@gmail.com";

        let user_contents = `<!doctype html>
        <html lang="en-US">
        <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Form</title>
        <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
        </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <table cellspacing="0" cellpadding="0" width="100%" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
        <td>
        <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" cellpadding="0" cellspacing="0">
        <tr>
        <td>
        <br>
        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:570px;background-color: #ffffff; border-radius:3px; text-align:center; box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <tr>
        <td style="padding:0 35px; ">
        <h1 style="color:#1d9bf0; font-weight:700; margin-top:2px;font-size:20px;font-family:Arial, Helvetica, sans-serif;text-align:center; line-height:2">Order placed successfully.</h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px;font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; line-height:2; font-weight: bold; text-align: center;">Name: ${name}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Phone: ${phone}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Email: ${email}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Option: ${candid}</span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Package Name: ${package_name} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Date: ${date} </span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Start Time: ${time} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Amount: ${price} </span></h1>  
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Selected Images: </span></h1>
                                ${imageTags} <!-- Include the image tags here -->
        <span style=" margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
        </td>
        </tr>
        <tr style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <td style="height:100px; width : 100%; background-color:#0cbbe1 ;">
        <h1 style=" color:white;padding:0 35px; font-weight:500; margin-top:2px;font-size:15px;font-family:'Rubik',sans-serif;vertical-align:start; line-height:2; font-weight: bold;">Click To Memories</h1>
        <br>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td style="height:20px;">&nbsp;</td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`;

        let admin_contents = `<!doctype html>
        <html lang="en-US">
        <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Form</title>
        <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
        </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <table cellspacing="0" cellpadding="0" width="100%" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
        <td>
        <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" cellpadding="0" cellspacing="0">
        <tr>
        <td>
        <br>
        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:570px;background-color: #ffffff; border-radius:3px; text-align:center; box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <tr>
        <td style="padding:0 35px; ">
        <h1 style="color:#1d9bf0; font-weight:700; margin-top:2px;font-size:20px;font-family:Arial, Helvetica, sans-serif;text-align:center; line-height:2">Order received successfully.</h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px;font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; line-height:2; font-weight: bold; text-align: center;">Name: ${name}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Phone: ${phone}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Email: ${email}</span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Option: ${candid}</span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Package Name: ${package_name} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Date: ${date} </span></h1> 
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Start Time: ${time} </span></h1>
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif; font-weight: bold; text-align: center;">Amount: ${price} </span></h1>  
        <h1 style="color:#455056; font-weight:500; margin-top:10px; font-size:15px;font-family:'Rubik',sans-serif;text-align:justify; ; font-weight: bold; text-align: center;">Selected Images: </span></h1>
                                ${imageTags} <!-- Include the image tags here -->
        <span style=" margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
        </td>
        </tr>
        <tr style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <td style="height:100px; width : 100%; background-color:#0cbbe1 ;">
        <h1 style=" color:white;padding:0 35px; font-weight:500; margin-top:2px;font-size:15px;font-family:'Rubik',sans-serif;vertical-align:start; line-height:2; font-weight: bold;">Click To Memories</h1>
        <br>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td style="height:20px;">&nbsp;</td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`;

        const mailOptions = {
            from: SMTP_MAIL,
            to: email,
            subject: mailSubject,
            html: user_contents
        };

        const adminmailOptions = {
            from: SMTP_MAIL,
            to: admin_email,
            subject: mailSubject,
            html: admin_contents
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            const admin_info = await transporter.sendMail(adminmailOptions);
            console.log(admin_info);
            console.log(info);
            console.log(`Email sent successfully to ${email}`);
            return res.json({ message: 'Email sent successfully'});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send the email' });
        }

    }else {
        console.log("Form not submitted")
    }

    
});



app.listen(process.env.PORT, () => {
    console.log(`port is Listening at http://${process.env.SERVER_HOST}:${process.env.PORT}/`);
});
