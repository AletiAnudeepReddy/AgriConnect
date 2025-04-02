const express = require('express');
const router = express.Router();
const { registerLaborer, loginLaborer } = require('../controllers/laborerAuthController');

router.post('/register', registerLaborer);  // Laborer Registration
router.post('/login', loginLaborer);        // Laborer Login

module.exports = router;
