const express = require('express');
const router = express.Router();
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const { pool } = require('../db');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// Route to send OTP
router.post('/resend_otp', async (req, res) => {
    const { emailId } = req.body;
  
    // Generate a random OTP (e.g., 6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000);
  
    try {
  
      const updateQuery = `
        UPDATE chat.otp_management 
        SET otp = $1, created_time = NOW() 
        WHERE email = $2 
        RETURNING *`;
      const updateResult = await pool.query(updateQuery, [otp, emailId]);
  
      if (updateResult.rowCount === 0) {
        throw new Error('Email not found in the database.');
      }
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailId,
        subject: 'One Time Password for RealTime Chat Application',
        text: `Your OTP code is: ${otp}`,
      };
  
      await transporter.sendMail(mailOptions);  
  
      res.status(200).json({ message: 'OTP sent successfully to email' });
    } catch (error) {
      console.error('Error resending OTP:', error.message || error);
      res.status(500).json({ message: 'Error sending OTP' });
    }
  });
  
module.exports = router;