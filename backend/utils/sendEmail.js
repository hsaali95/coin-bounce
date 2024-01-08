const nodemailer = require("nodemailer");
const { SMTP_USER_AND_PASSWORD, SMTP_HOST, SMTP_PORT } = require("../config");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: 25,
      secure: false,
      auth: {
        user: SMTP_USER_AND_PASSWORD,
        pass: SMTP_USER_AND_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "ahmed.ali@softvira.com",
      to: email,
      subject: subject,
      text: text,
      html: "<b>Hello world?</b>", // html body
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
