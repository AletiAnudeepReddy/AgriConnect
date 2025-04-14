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
// Express route example
router.get("/api/accepted-farmer/check", async (req, res) => {
    const { farmerId, jobId, laborerId } = req.query;
    const existing = await AcceptedFarmer.findOne({ farmerId, jobId, laborerId });

    if (existing) {
        return res.json({ found: true });
    } else {
        return res.json({ found: false });
    }
});

module.exports = router;
