const express = require('express');
const { pool } = require('../db'); // Make sure the DB is connected properly
const router = express.Router();

// Fetch all users
router.get('/users', async (req, res) => {
    const { sender_id } =req.query;
    // console.log("sender_id",sender_id);
    try {
      const query = `
        SELECT 
          u.user_id, 
          u.name, 
          u.profile_pic,
          CASE 
            WHEN r.sender_id = $1 THEN r.status  -- Current user sent the request
            WHEN r.recipient_id = $1 AND  r.status = 'pending' THEN 'Accept' -- Current user received the request
            WHEN r.recipient_id = $1 THEN r.status
            ELSE 'Send Request'
          END AS request_status
        FROM 
          chat.user_details u
        LEFT JOIN 
          chat.request_table r 
        ON 
          (u.user_id = r.recipient_id AND r.sender_id = $1) 
          OR 
          (u.user_id = r.sender_id AND r.recipient_id = $1)
        WHERE 
          u.user_id != $1; -- Exclude the current user
      `;
        const result = await pool.query(query, [sender_id]);
        // console.log(result);
        const users = result.rows;
        // console.log(users);
        res.json(users); // Send users to the frontend
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
});

module.exports = router;
