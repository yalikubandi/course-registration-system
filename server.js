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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount API routes before static files
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle root route explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle specific frontend routes
const frontendRoutes = ['/login', '/dashboard', '/courses', '/payment', '/registration'];
frontendRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});