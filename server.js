const express = require('express');
const path = require('path');
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

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Fallback to index.html (if needed for SPA-style routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});