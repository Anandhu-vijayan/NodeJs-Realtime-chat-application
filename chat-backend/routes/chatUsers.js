    const express = require('express');
    const { pool } = require('../db'); // Ensure DB is connected
    const router = express.Router();

    // Fetch all users with existing messages
    router.get('/chat', async (req, res) => {
        const { sender_id } = req.query;

        try {
            const query = `
                WITH latest_messages AS (
        SELECT
            u.user_id,
            u.name,
            u.profile_pic,
            m.text,
            m.timestamp,
            ROW_NUMBER() OVER (PARTITION BY u.user_id ORDER BY m.timestamp DESC) AS row_num
        FROM 
            chat.user_details u
        INNER JOIN 
            chat.messages m 
        ON 
            (u.user_id = m.recipient_id AND m.sender_id = $1)
            OR 
            (u.user_id = m.sender_id AND m.recipient_id = $1)
        WHERE 
            u.user_id != $1 -- Exclude the current user
    )
    SELECT 
        user_id, 
        name, 
        profile_pic, 
        text, 
        timestamp
    FROM 
        latest_messages
    WHERE 
        row_num = 1; -- Only fetch the latest message for each user

            `;

            const result = await pool.query(query, [sender_id]);
            const users = result.rows;
            console.log(users);
            res.json(users); // Send filtered users to the frontend
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).json({ message: 'Server error while fetching chats.' });
        }
    });

    module.exports = router;
