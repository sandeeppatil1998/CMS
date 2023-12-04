const nodemailer = require('nodemailer');
const {SMTP_MAIL, SMTP_PASSWORD, SMTP_PORT, SMTP_SERVER} = process.env;

const sendMail = async (email, mailSubject, content) => {
    try{
        console.log(SMTP_MAIL, SMTP_PASSWORD, SMTP_PORT, SMTP_SERVER);
        console.log(email, mailSubject, content);
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
        const mailOptions = {
            from: SMTP_MAIL,
            to: email,
            subject: mailSubject,
            html: content
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch(error){
        console.log(error);
    }


}

module.exports = sendMail;