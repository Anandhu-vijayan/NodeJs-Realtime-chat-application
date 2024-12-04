const express = require('express');
const { checkConnection } = require('./db');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import routes
const signupRoutes = require('./routes/signup');
const verifyOtpRoutes = require('./routes/verify-otp');
const loginRoutes = require('./routes/login');
const forgotPassword = require('./routes/forgotPassword');
const verifyToken = require('./routes/verify-token');
const saveData = require('./routes/saveData');
const peopleList = require('./routes/PeopleList');
const sendRequest = require('./routes/sendRequest');
const notifiCation = require('./routes/notification');
const acceptRequest = require('./routes/acceptRequest');
const chatList = require('./routes/chatUsers');
const { router: saveMessageRoutes, socketLogic: saveMessageSocket } = require('./routes/saveMessage');
// Import http and socket.io
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
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
app.use('/api', acceptRequest);
app.use('/api', saveMessageRoutes);
app.use('/api', chatList);

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
    // console.log('A user connected:', socket.id);

    // Handle incoming events, e.g., notifications
    socket.on('sendNotification', (data) => {
        // Broadcast the notification to other connected clients
        socket.broadcast.emit('notificationReceived', data);
    });
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
    });
});
saveMessageSocket(io); // Pass Socket.IO to saveMessage

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
});
