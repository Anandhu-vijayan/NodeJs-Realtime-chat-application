const express = require('express');
const { checkConnection } = require('./db'); // Import the checkConnection function
const signupRoutes = require('./routes/signup'); // Import your signup routes
const verifyOtpRoutes = require('./routes/verify-otp'); // Import your verify-otp routes

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
const cors = require('cors');
app.use(cors());

// Check database connection
checkConnection();

// Use your routes
app.use('/api', signupRoutes); // Mount signup routes on /api endpoint
app.use('/api', verifyOtpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
