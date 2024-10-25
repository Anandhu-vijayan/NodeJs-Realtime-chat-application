const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { pool } = require('../db'); // Ensure your db connection is set up
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination for uploaded files
        const dir = path.join(__dirname, '../uploads/'); // Create an 'uploads' folder
        fs.exists(dir, (exist) => {
            if (!exist) {
                fs.mkdirSync(dir); // Create the directory if it doesn't exist
            }
            cb(null, dir);
        });
        console.log('Saving file to: ', path.join(__dirname, 'uploads'));

    },
    
    filename: (req, file, cb) => {
        // Generate an encrypted filename
        const encryptedName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
        cb(null, encryptedName);
    }
});

// Initialize multer
const upload = multer({ storage });

// API to save name and image
router.post('/save-profile', upload.single('profileImage'), async (req, res) => {
    const { name } = req.body;
    const profileImage = req.file; // Get the uploaded file information
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the "Authorization: Bearer <token>" header

    if (!name || !profileImage) {
        return res.status(400).json({ message: 'Name and profile image are required.' });
    }

    try {
        // Verify the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract user ID from the token

        const encryptedImageName = profileImage.filename; // Use the encrypted filename for storing in DB
        
        // Update the user's name and profile picture in the database
        const updateQuery = `
            UPDATE chat.user_details 
            SET name = $1, profile_pic = $2, join_flag = 1
            WHERE user_id = $3
        `;

        await pool.query(updateQuery, [name, encryptedImageName, userId]);

        return res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
