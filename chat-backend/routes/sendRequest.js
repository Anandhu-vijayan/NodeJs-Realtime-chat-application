const express = require('express');
const { pool } = require('../db'); // Make sure the DB is connected properly
const router = express.Router();

router.post('/send-request', async (req, res) => {
  const { sender_id, recipient_id } = req.body;
  
    try {
      console.log("datas:",sender_id,"data",recipient_id)
      const existingRequest = await pool.query(
        'SELECT * FROM chat.request_table WHERE sender_id = $1 AND recipient_id = $2 AND status = $3',
        [sender_id, recipient_id, 'pending']
      );
  
      if (existingRequest.rows.length > 0) {
        return res.status(400).json({ message: 'Request already sent' });
      }
  
      await pool.query(
        'INSERT INTO chat.request_table (sender_id, recipient_id, status , created_at) VALUES ($1, $2, $3 ,NOW())',
        [sender_id, recipient_id, 'pending']
      );
  
      res.status(200).json({ message: 'Request sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send request' });
    }
  });
  
  

module.exports = router;