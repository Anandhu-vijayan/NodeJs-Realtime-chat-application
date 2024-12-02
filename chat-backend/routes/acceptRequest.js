const express = require('express');
const { pool } = require('../db'); // Make sure the DB is connected properly
const router = express.Router();

router.post('/accept-request', async (req, res) => {
    const { sender_id, recipient_id } = req.body;
  
    try {
        console.log(sender_id,recipient_id)
      // Update the request status to 'accepted'
      const updateQuery = `
        UPDATE chat.request_table
        SET status = 'accepted'
        WHERE sender_id = $1 AND recipient_id = $2 AND status = 'pending'
      `;
  
      const result = await pool.query(updateQuery, [sender_id, recipient_id]);
  
      if (result.rowCount > 0) {
        res.status(200).json({ message: 'Friend request accepted successfully.' });  
         }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ message: 'Failed to accept the friend request.' });
    }
  });
  module.exports = router;
  