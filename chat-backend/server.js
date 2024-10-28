const express = require('express');
const { checkConnection } = require('./db'); // Import the checkConnection function
const path = require('path');
const signupRoutes = require('./routes/signup'); // Import your signup routes
const verifyOtpRoutes = require('./routes/verify-otp'); // Import your verify-otp routes
const loginRoutes = require('./routes/login')
const forgotPassword = require('./routes/forgotPassword')
const verifyToken = require('./routes/verify-token')
const saveData = require('./routes/saveData')
const peopleList = require('./routes/PeopleList')
const sendRequest = require('./routes/sendRequest')
const notifiCation = require('./routes/notification')

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
const cors = require('cors');
app.use(cors());

// Check database connection
checkConnection();

// Use your routes
app.use('/api', signupRoutes); // Mount signup routes on /api endpoint
app.use('/api', verifyOtpRoutes);
app.use('/api', loginRoutes);
app.use('/api', forgotPassword);
app.use('/api',verifyToken);
app.use('/api',saveData);
app.use('/api',peopleList);
app.use('/api',sendRequest);
app.use('/api',notifiCation);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
