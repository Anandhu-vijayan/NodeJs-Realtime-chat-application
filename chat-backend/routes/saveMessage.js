const express = require('express');
const { pool } = require('../db'); // Ensure the database pool is imported
const router = express.Router();

// Define your API routes
router.get('/messages', async (req, res) => {
    const { sender_id, recipient_id } = req.query;
    try {
        console.log(sender_id, recipient_id);
        const result = await pool.query(
            `SELECT * FROM chat.messages
            WHERE (sender_id = $1 AND recipient_id = $2)
               OR (sender_id = $2 AND recipient_id = $1)
            ORDER BY timestamp ASC`,
            [sender_id, recipient_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// WebSocket logic
const socketLogic = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('sendMessage', async (message) => {
            try {
                await pool.query(
                    'INSERT INTO chat.messages (sender_id, recipient_id, text, timestamp) VALUES ($1, $2, $3, $4)',
                    [message.sender_id, message.recipient_id, message.text, message.timestamp]
                );
                io.to(message.recipient_id).emit('receiveMessage', message);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = { router, socketLogic };
