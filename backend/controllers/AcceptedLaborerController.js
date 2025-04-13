const axios = require("axios");
const AcceptedLaborer = require("../models/AcceptedLaborer");
const Laborer = require("../models/Labor");
require("dotenv").config();

// POST - Add Accepted Laborer (with duplicate check)
exports.addAcceptedLaborer = async (req, res) => {
    try {
        const { farmerId, jobId, laborerId, laborerName } = req.body;

        // Check if already accepted
        const existing = await AcceptedLaborer.findOne({ farmerId, jobId, laborerId });
        if (existing) {
            return res.status(409).json({ message: "Laborer already accepted for this job." });
        }

        // Save to DB
        const newEntry = new AcceptedLaborer({ farmerId, jobId, laborerId, laborerName });
        await newEntry.save();

        // Get laborer mobile number
        const laborer = await Laborer.findById(laborerId);
        if (!laborer || !laborer.phone) {
            return res.status(201).json({ message: "Accepted, but laborer's mobile number not found." });
        }

        // Send SMS via Fast2SMS
        const message = `Hello ${laborerName}, your job application has been accepted! Please be ready to work.`;

        const smsPayload = {
            route: "p",
            message: message,
            language: "english",
            flash: 0,
            numbers: laborer.phone // Ex: "9876543210"
        };
        console.log("Sending SMS to:", laborer.phone);

        const config = {
            headers: {
                authorization: process.env.FAST2SMS_API_KEY, // Lowercase key
                "Content-Type": "application/json"
            }
        };

        const smsRes = await axios.post("https://www.fast2sms.com/dev/bulkV2", smsPayload, config);

        res.status(201).json({
            message: "Accepted laborer stored and SMS sent successfully.",
            smsResponse: smsRes.data
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            message: "Error saving accepted laborer or sending SMS",
            error: err.message
        });
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
