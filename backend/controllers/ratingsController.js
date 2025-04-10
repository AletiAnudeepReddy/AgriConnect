const Rating = require("../models/Ratings");

// POST: Submit rating and comment
exports.addRating = async (req, res) => {
    try {
        const { farmerId, farmerName, laborerId, jobId, rating, comment } = req.body;

        const newRating = new Rating({
            farmerId,
            farmerName,
            laborerId,
            jobId,
            rating,
            comment
        });

        await newRating.save();
        res.status(201).json({ message: "Rating submitted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit rating.", error });
    }
};

// GET: All ratings for a laborer (now includes farmerName directly)
exports.getRatingsByLaborer = async (req, res) => {
    try {
        const { laborerId } = req.params;
        const ratings = await Rating.find({ laborerId });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch ratings.", error });
    }
};
