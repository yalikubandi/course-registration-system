const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./backend/routes/auth');
const paymentRoutes = require('./backend/routes/payment');

const app = express();

app.use(express.static('public'));
// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});