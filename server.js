const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const authRoutes = require('./backend/routes/auth');
const paymentRoutes = require('./backend/routes/payment');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Fallback to index.html for any unmatched frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
