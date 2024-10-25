const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const bcrypt = require('bcrypt');

router.post('/forgot', async (req, res) => {
    const { emailId, password, repassword } = req.body;
    try {
        // Check if email is registered
        const loginData = `SELECT * FROM chat.user_details WHERE email = $1`;
        const loginFetchData = await pool.query(loginData, [emailId]);

        if (loginFetchData.rows.length === 0) {
            return res.status(404).json({ message: 'Email not registered' });
        }

        // Check if passwords match
        if (password !== repassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        const updateQuery = `
            UPDATE chat.user_details 
            SET password = $1, created_time = NOW() 
            WHERE email = $2 
            RETURNING *`;

        const updateResult = await pool.query(updateQuery, [hashedPassword, emailId]);

        res.status(200).json({
            message: 'Password updated successfully',
            // Optionally return token or user details here
        });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'An error occurred while updating the password. Please try again later.' });
    }
});

module.exports = router;
