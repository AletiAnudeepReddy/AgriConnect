const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', authenticateUser, (req, res) => {
    res.json({ message: 'Welcome to the protected dashboard!', user: req.user });
});

module.exports = router;
