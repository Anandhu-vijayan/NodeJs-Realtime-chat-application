const express = require('express');
const { pool } = require('../db'); // Make sure the DB is connected properly
const router = express.Router();

router.get('/friend-requests', async (req, res) => {
    const { userId } = req.query;
  
    try {
      const result = await pool.query(
        `SELECT u.name,u.profile_pic,r.sender_id, r.status FROM chat.request_table r
        JOIN chat.user_details u ON r.sender_id = u.user_id
        WHERE r.recipient_id = $1 AND status = 'pending'`,
        [userId]
      );
      res.json(result.rows); // Send the list of friend requests to the frontend
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      res.status(500).json({ message: 'Server error while fetching friend requests.' });
    }
  });
  module.exports = router;