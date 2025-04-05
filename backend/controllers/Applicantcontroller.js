const Applicant = require("../models/Applicants");

// ✅ POST: Apply for a job
const applyForJob = async (req, res) => {
    try {
        const { fullName, experience, location, rating, jobId, farmerId, laborerId } = req.body;

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
        res.status(201).json({ message: "Application submitted successfully", applicant: savedApplicant });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Failed to apply", error });
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
