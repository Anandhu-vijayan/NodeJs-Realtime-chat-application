const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { pool } = require('../db');
const jwt = require('jsonwebtoken');
const router = express.Router();
// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);
router.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const loginData = `SELECT * FROM chat.user_details WHERE email = $1`;
        const loginFetchData = await pool.query(loginData, [emailId]);

        // Check if the user exists
        if (loginFetchData.rows.length === 0) {
            return res.status(404).json({ message: 'Email not registered' });
        } else {
            const user = loginFetchData.rows[0]; // Get the user object
            const storedHashPassword = user.password; // The hashed password from the database
            const isPasswordValid = await bcrypt.compare(password, storedHashPassword); // Compare plain-text password with hashed password
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const jFlag=user.join_flag;
            const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token , jFlag});
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
