const AcceptedLaborer = require("../models/AcceptedLaborer");

// POST - Add Accepted Laborer (with duplicate check)
exports.addAcceptedLaborer = async (req, res) => {
    try {
        const { farmerId, jobId, laborerId, laborerName } = req.body;

        // Check if already accepted
        const existing = await AcceptedLaborer.findOne({ farmerId, jobId, laborerId });
        if (existing) {
            return res.status(409).json({ message: "Laborer already accepted for this job." });
        }

        const newEntry = new AcceptedLaborer({ farmerId, jobId, laborerId, laborerName });
        await newEntry.save();
        res.status(201).json({ message: "Accepted laborer stored successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error saving accepted laborer", error: err });
    }
};

// GET - Accepted Laborers by Farmer ID
exports.getAcceptedLaborersByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const data = await AcceptedLaborer.find({ farmerId }).populate("farmerId jobId laborerId");
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching accepted laborers", error: err });
    }
};

// DELETE - Accepted Laborers by Farmer ID
exports.deleteAcceptedLaborersByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;
        await AcceptedLaborer.deleteMany({ farmerId });
        res.status(200).json({ message: "Accepted laborers deleted for farmer" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting accepted laborers", error: err });
    }
};
