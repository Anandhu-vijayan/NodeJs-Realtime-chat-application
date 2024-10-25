const express = require('express');
const { pool } = require('../db'); // Make sure the DB is connected properly
const router = express.Router();

// Fetch all users
router.get('/users', async (req, res) => {
    
    try {
        const query = 'SELECT user_id, name, profile_pic FROM chat.user_details';
        const result = await pool.query(query);
        const users = result.rows;

        res.json(users); // Send users to the frontend
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
});

module.exports = router;
