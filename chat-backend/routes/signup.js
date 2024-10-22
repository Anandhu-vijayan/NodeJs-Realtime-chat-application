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
router.post('/signup', async (req, res) => {
  const { emailId } = req.body;

  // Generate a random OTP (e.g., 6-digit)
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const checkQuery = `SELECT * FROM chat.otp_management WHERE email = $1`;
    const checkResult = await pool.query(checkQuery, [emailId]);

    if (checkResult.rows.length > 0) {
      // If email exists, update OTP and created_time
      res.status(200).json({ message: 'Email Already Exists' });

    } else {
      // If email does not exist, insert new record
      const insertQuery = `
        INSERT INTO chat.otp_management (email, otp, created_time) 
        VALUES ($1, $2, NOW()) 
        RETURNING *`;
      const insertResult = await pool.query(insertQuery, [emailId, otp]);

      console.log('OTP inserted:', insertResult.rows[0]);
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailId,
      subject: 'One Time Password for RealTime Chat Application',
      text: `Your OTP code is: ${otp}`
    };

    await transporter.sendMail(mailOptions);

    // Store OTP in your database or temporary storage if needed

    res.status(200).json({ message: 'OTP sent successfully to email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

module.exports = router;
