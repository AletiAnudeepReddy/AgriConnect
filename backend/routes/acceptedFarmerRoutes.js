// routes/acceptedFarmerRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/acceptedFarmerController');

// POST
router.post('/accepted-farmer', controller.acceptFarmer);

// GET
router.get('/accepted-farmers/:laborerId', controller.getAcceptedFarmersByLaborer);

// DELETE
router.delete('/accepted-farmer/job/:jobId', controller.deleteAcceptedFarmerByJobId);

module.exports = router;
