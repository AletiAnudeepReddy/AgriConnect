const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingsController");
const Rating = require('../models/Ratings'); 

router.post("/add", ratingController.addRating);
router.get("/by-laborer/:laborerId", ratingController.getRatingsByLaborer);
// Check if a rating already exists
router.get("/check", async (req, res) => {
    const { farmerId, laborerId, jobId } = req.query;

    try {
        const existing = await Rating.findOne({ farmerId, laborerId, jobId });
        res.json({ exists: !!existing });
    } catch (error) {
        console.error("Error checking rating:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
