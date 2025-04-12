const Rating = require('../models/Ratings'); // adjust path as needed
const vader = require('vader-sentiment');

const analyzeLaborerSentiment = async (req, res) => {
    const { laborerId } = req.params;

    try {
        const ratings = await Rating.find({ laborerId });

        if (ratings.length === 0) {
            return res.status(200).json({ sentiment: "No Reviews 😐" });
        }

        let totalCompound = 0;
        ratings.forEach(r => {
            const score = vader.SentimentIntensityAnalyzer.polarity_scores(r.comment);
            totalCompound += score.compound;
        });

        const avg = totalCompound / ratings.length;
        let sentiment = "Average 😐";
        if (avg > 0.3) sentiment = "Good 😊";
        else if (avg < -0.3) sentiment = "Bad 😞";

        res.status(200).json({ sentiment });
    } catch (err) {
        console.error("Sentiment Error:", err);
        res.status(500).json({ message: "Error analyzing sentiment" });
    }
};

module.exports = { analyzeLaborerSentiment };
