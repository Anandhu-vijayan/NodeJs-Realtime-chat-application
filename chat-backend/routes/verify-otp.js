// routes/verify-otp.js
const express = require('express');
const router = express.Router();
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const bcrypt = require('bcrypt');
const { pool } = require('../db'); // Assuming you have a db.js file that exports your PostgreSQL pool

// Route to verify OTP and sign up
router.post('/verify-otp', async (req, res) => {
  const { emailId, otp, password } = req.body;

  try {
    // Step 1: Check if OTP is correct by querying from the database
    const checkOtpQuery = `SELECT otp FROM chat.otp_management WHERE email = $1 ORDER BY created_time DESC LIMIT 1`;
    const otpResult = await pool.query(checkOtpQuery, [emailId]);
    // console.log('Query Result:', otpResult.rows[0].otp);
    if (otpResult.rows.length === 0) {
      if (otpResult.rows[0].otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
    }
    // Step 2: Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Step 3: Generate a unique user_id, starting from CA1000 and incrementing by 1
    const userIdQuery = `SELECT user_id FROM chat.user_details ORDER BY user_id DESC LIMIT 1`;
    const userIdResult = await pool.query(userIdQuery);

    let newUserId;
    if (userIdResult.rows.length > 0) {
      const lastUserId = userIdResult.rows[0].user_id;
      const lastUserNumber = parseInt(lastUserId.slice(2)); // Extract the number part (after "CA")
      newUserId = `CA${lastUserNumber + 1}`;
    } else {
      newUserId = 'CA1000'; // Start with CA1000 if no users exist
    }
    // Step 4: Insert user data into the users table
    const insertUserQuery = `
      INSERT INTO chat.user_details (user_id, email, password, created_time) 
      VALUES ($1, $2, $3, NOW()) 
      RETURNING *`;
    const insertUserResult = await pool.query(insertUserQuery, [newUserId, emailId, hashedPassword]);

    // Step 5: Send success response
    res.status(200).json({
      message: 'OTP verified and user registered successfully',
      user: insertUserResult.rows[0],
    });
  } catch (error) {
    console.error('Errors verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

module.exports = router;
