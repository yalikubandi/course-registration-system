const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Process payment
router.post('/process', (req, res) => {
    const { user_id, cardName, cardNumber, expiryDate, cvv, amount } = req.body;

    // Basic validation
    if (!user_id || !cardName || !cardNumber || !expiryDate || !cvv || !amount) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert payment into database
    db.query(
        'INSERT INTO payments (user_id, card_name, card_number, expiry_date, cvv, amount) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, cardName, cardNumber, expiryDate, cvv, amount],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(201).json({ message: 'Payment processed successfully' });
        }
    );
});

module.exports = router;