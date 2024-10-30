const express = require('express');
const { checkConnection } = require('./db'); // Import the checkConnection function
const path = require('path');
const signupRoutes = require('./routes/signup'); // Import your signup routes
const verifyOtpRoutes = require('./routes/verify-otp'); // Import your verify-otp routes
const loginRoutes = require('./routes/login');
const forgotPassword = require('./routes/forgotPassword');
const verifyToken = require('./routes/verify-token');
const saveData = require('./routes/saveData');
const peopleList = require('./routes/PeopleList');
const sendRequest = require('./routes/sendRequest');
const notifiCation = require('./routes/notification');

// Import http and socket.io
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3001', // Allow only this origin
    credentials: true, // Enable if your requests require credentials (e.g., cookies)
}));

// Check database connection
checkConnection();

// Use your routes
app.use('/api', signupRoutes); // Mount signup routes on /api endpoint
app.use('/api', verifyOtpRoutes);
app.use('/api', loginRoutes);
app.use('/api', forgotPassword);
app.use('/api', verifyToken);
app.use('/api', saveData);
app.use('/api', peopleList);
app.use('/api', sendRequest);
app.use('/api', notifiCation);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create an HTTP server and attach Socket.IO with CORS configuration
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001', // The front-end URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle incoming events, e.g., notifications
    socket.on('sendNotification', (data) => {
        // Broadcast the notification to other connected clients
        socket.broadcast.emit('notificationReceived', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
