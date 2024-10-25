const express = require('express');
const { pool } = require('../db'); // Ensure your db connection is set up
const jwt = require('jsonwebtoken');
const router = express.Router();

// Token verification endpoint
router.post('/verify-token', async (req, res) => {
    const { token } = req.body;

    // Verify the token using the same secret
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract the user ID from the decoded token

        // Fetch user details from the database
        const userQuery = `SELECT email, profile_pic FROM chat.user_details WHERE user_id = $1`;
        const userData = await pool.query(userQuery, [userId]);

        if (userData.rows.length === 0) {
            return res.status(404).json({ valid: false, message: 'User not found' });
        }

        // Return user data and mark token as valid
        const user = userData.rows[0];
        return res.json({
            valid: true,
            user: {
                email: user.email,
                profilePic: user.profile_pic, // Assuming profilePic is stored in DB
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
});

module.exports = router;
