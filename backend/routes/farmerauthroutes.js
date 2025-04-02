const express = require('express');
const router = express.Router();
const { registerFarmer, loginFarmer } = require('../controllers/farmerAuthController');

router.post('/register', registerFarmer);  // Farmer Registration
router.post('/login', loginFarmer);        // Farmer Login

module.exports = router;