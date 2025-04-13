const AcceptedLaborer = require("../models/AcceptedLaborer");
const Laborer = require("../models/Labor");
const twilio = require("twilio");
require("dotenv").config();

// Twilio config
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// POST - Add Accepted Laborer (with Twilio SMS)
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

        // Get laborer's mobile number
        const laborer = await Laborer.findById(laborerId);
        if (!laborer || !laborer.phone) {
            return res.status(201).json({ message: "Accepted, but laborer's mobile number not found." });
        }

        // Format and send SMS
        const message = `Hello ${laborerName}, your job application has been accepted! Please be ready to work.`;

        try {
            const sms = await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: "+91" + laborer.phone // Assuming Indian numbers
            });

            res.status(201).json({
                message: "Accepted laborer stored and SMS sent via Twilio.",
                smsSid: sms.sid
            });
        } catch (smsError) {
            console.error("❌ SMS sending failed:", smsError.message);
            res.status(201).json({
                message: "Laborer accepted, but SMS failed to send.",
                error: smsError.message
            });
        }

    } catch (err) {
        console.error("❌ Error in addAcceptedLaborer:", err.message);
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
