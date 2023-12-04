const express = require('express');
const app = express();
const router = express.Router();
const session = require('express-session');
var path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const image_path = path.join(__dirname, "../public/image");

console.log("imagepath:", image_path)

var userlogin = require('../controller/authentication/login');

app.use(cookieParser());

router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, image_path)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
  
  // Create upload object with storage options
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    }
  });

  module.exports = storage;






const authenticationlogin = require('../controller/authentication/login');
const authenticationsignup = require('../controller/authentication/signup');
const authenticationforgotpassword = require('../controller/authentication/forgotpassword');
const authenticationlogout = require('../controller/authentication/logout');

const doctoroperation_patient = require('../controller/doctor_operation/doctor_operation_patient');
const doctoroperation_appointment = require('../controller/doctor_operation/doctor_operation_appointment')
const doctoroperation_prescription = require('../controller/doctor_operation/doctor_operation_prescription');


const patientoperation_profile = require('../controller/patient_operation/patient_operation_profile');
const patientoperation_appointment = require('../controller/patient_operation/patient_operation_appointment');



router.get('/', authenticationlogin.landingpage);
router.get('/login',authenticationlogin.loginpage);
router.get('/signup', authenticationsignup.signuppage);
router.get('/logout', authenticationlogout.logout);
router.get('/forgotpassword', authenticationforgotpassword.forgotpasswordpage);
router.get('/resetpassword/:token', authenticationforgotpassword.resetpasswordpage);
router.get('/activatepage/:token', authenticationsignup.activatepage);



router.post('/login', express.urlencoded({ extended: true }), authenticationlogin.login);
router.post('/signup', express.urlencoded({ extended: true }),upload.single('image'), authenticationsignup.signup);
router.post('/forgotpassword', express.urlencoded({ extended: true }), authenticationforgotpassword.forgotpassword);
router.post('/resetpassword/:token', express.urlencoded({ extended: true }), authenticationforgotpassword.resetpassword);
router.post('/activate/:token', authenticationsignup.activate);


router.get('/d_dashboard',userlogin.isAuthdoctor, doctoroperation_patient.doctordashboard);
router.get('/d_patientslist',userlogin.isAuthdoctor, doctoroperation_patient.patientslist);
router.get('/d_bookappointment/:id', userlogin.isAuthdoctor, doctoroperation_patient.bookappointmentpage);
router.get('/d_viewpatientprofile/:id',userlogin.isAuthdoctor,doctoroperation_patient.viewpatientprofile);
router.get('/d_editprofilepage/:id',userlogin.isAuthdoctor,doctoroperation_patient.editpatientprofilepage);
router.get('/d_patientpreviousappointment/:id',userlogin.isAuthdoctor,doctoroperation_patient.patientpriviousappointment);


router.post('/d_bookappointment',express.urlencoded({ extended: true }),doctoroperation_patient.bookappointment);
router.post('/d_addpatient', express.urlencoded({ extended: true }),upload.single('image'),doctoroperation_patient.addpatient);
router.post('/d_editpatientprofile',express.urlencoded({ extended: true }),doctoroperation_patient.editpatientprofile);



router.get('/d_approveappointment/:id',userlogin.isAuthdoctor,doctoroperation_appointment.approveappointment);
router.get('/d_rejectappointment/:id', userlogin.isAuthdoctor,doctoroperation_appointment.rejectappointment);
router.get('/d_appointment',userlogin.isAuthdoctor,doctoroperation_appointment.approveappointmentpage);
router.get('/d_todayappointment',express.urlencoded({ extended: true }),userlogin.isAuthdoctor,doctoroperation_appointment.todayappointment);


router.get('/d_patientprescriptiondetails/:id',express.urlencoded({ extended: true }),userlogin.isAuthdoctor,doctoroperation_prescription.patientprescriptiondetails);
router.get('/d_doctorpatientpreviousappointdetails/:id',express.urlencoded({ extended: true }), userlogin.isAuthdoctor, doctoroperation_prescription.doctorpatientpreviousappointmnetdetails);
router.get('/d_prescription/:id',express.urlencoded({ extended: true }),userlogin.isAuthdoctor,doctoroperation_prescription.prescriptionpage);

router.post('/d_prescription',express.urlencoded({ extended: true }),userlogin.isAuthdoctor,doctoroperation_prescription.prescription);




// Patient routes

router.get('/p_dashboard',userlogin.isAuthpatient, patientoperation_profile.patientdashboard);
router.get('/p_profilepage',userlogin.isAuthpatient,patientoperation_profile.patientprofilepage);
router.get('/p_editprofilepage/:id',userlogin.isAuthpatient,patientoperation_profile.patientprofileeditpage);

router.get('/p_appointment',userlogin.isAuthpatient,patientoperation_appointment.patientappointmentlist);
router.get('/p_bookappointment/:id',userlogin.isAuthpatient,patientoperation_appointment.patientbookappointmentpage);
router.get('/p_previousappointment/:id',userlogin.isAuthpatient,patientoperation_appointment.patientpreviousappointmentlist);


router.post('/p_bookappointment',express.urlencoded({ extended: true }),patientoperation_appointment.patientbookappointment);
router.post('/p_editprofilepage',express.urlencoded({ extended: true }),userlogin.isAuthpatient,patientoperation_profile.patientprofileedit);



module.exports = router;
