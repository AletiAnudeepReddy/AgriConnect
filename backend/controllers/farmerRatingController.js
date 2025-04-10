const FarmerRating = require("../models/FarmerRating");

// POST - Add rating
exports.addFarmerRating = async (req, res) => {
    try {
        const { laborerId, laborerName, farmerId, jobId, rating, comment } = req.body;

        const newRating = new FarmerRating({ laborerId, laborerName, farmerId, jobId, rating, comment });
        await newRating.save();
        res.status(201).json({ message: "Farmer rating submitted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error submitting farmer rating", error });
    }
};

// GET - All ratings for a specific farmer
exports.getFarmerRatings = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const ratings = await FarmerRating.find({ farmerId }).sort({ createdAt: -1 });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching farmer ratings", error });
    }
};
