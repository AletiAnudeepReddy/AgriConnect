const Applicant = require("../models/Applicants");
const Farmer = require("../models/Farmer"); 
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure transporter (use real credentials or environment variables in production)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS

    }
});

const applyForJob = async (req, res) => {
    try {
        const { fullName, experience, location, rating, jobId, farmerId, laborerId } = req.body;

        const existing = await Applicant.findOne({ laborerId, jobId });
        if (existing) {
            return res.status(400).json({ message: "Already applied for this job." });
        }

        const newApplicant = new Applicant({
            fullName,
            experience,
            location,
            rating,
            jobId,
            farmerId,
            laborerId
        });

        const savedApplicant = await newApplicant.save();

        // ✅ Fetch Farmer Email
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            console.log("❌ Farmer not found for ID:", farmerId);
            return res.status(404).json({ message: "Farmer not found" });
        }
        if (farmer && farmer.email) {
            const mailOptions = {
                from: 'yourgmail@gmail.com',
                to: farmer.email,
                subject: 'New Job Application Received',
                text: `Hello ${farmer.name},\n\nYou have received a new application from ${fullName} for your job post.\n\nDetails:\nExperience: ${experience}\nLocation: ${location}\nRating: ${rating}\n\nPlease login to your dashboard to view more.\n\nRegards,\nAgriConnect`
            };

            // ✅ Send email
            await transporter.sendMail(mailOptions);
            console.log("Email sent to farmer:", farmer.email);
        }

        res.status(201).json({ message: "Application submitted successfully", applicant: savedApplicant });

    } catch (error) {
        console.error("❌ Error applying for job:", error.message); // More readable
        res.status(500).json({ message: "Failed to apply", error: error.message });
    }
};


// ✅ GET: Get all applicants for a specific job
const getApplicantsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const applicants = await Applicant.find({ jobId });
        res.status(200).json(applicants);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ message: "Failed to fetch applicants", error });
    }
};

// ✅ DELETE: Delete an applicant by ID
const deleteApplicant = async (req, res) => {
    try {
        const { applicantId } = req.params;

        await Applicant.findByIdAndDelete(applicantId);
        res.status(200).json({ message: "Applicant deleted successfully" });
    } catch (error) {
        console.error("Error deleting applicant:", error);
        res.status(500).json({ message: "Failed to delete applicant", error });
    }
};

module.exports = {
    applyForJob,
    getApplicantsByJob,
    deleteApplicant
};
