const nodemailer = require("nodemailer");
const fs = require("fs");

const sendOTP = async (email, otp) => {
  try {
    // Use Gmail SMTP for free email sending
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password
      }
    });

    fs.readFile("./email/otp.html", { encoding: "utf-8" }, async (e, html) => {
      if (e) {
        console.error('Error reading email template:', e);
        return;
      }

      html = html.replace("${otp}", otp);

      const mailOptions = {
        from: {
          name: "Password Manager",
          address: process.env.GMAIL_USER,
        },
        to: email,
        subject: "Two-Factor Authentication - Password Manager",
        html: html,
        text: `Your verification code is ${otp}. This code expires in 60 seconds.`,
      };

      console.log('Sending email to:', email);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    });
  } catch (e) {
    console.error('Error in sendOTP function:', e);
  }
};

module.exports = {
  sendOTP
};