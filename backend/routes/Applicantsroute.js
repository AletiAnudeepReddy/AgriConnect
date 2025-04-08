const express = require("express");
const router = express.Router();

// ✅ Correct path to the controller file
const {
    applyForJob,
    getApplicantsByJob,
    deleteApplicant
} = require("../controllers/Applicantcontroller"); // Make sure file exists

// ✅ Define routes with actual functions
router.post("/apply", applyForJob);
router.get("/job/:jobId", getApplicantsByJob);
router.delete("/:applicantId", deleteApplicant);

const Applicant = require("../models/Applicants");
router.get("/by-laborer/:laborerId", async (req, res) => {
    try {
        const laborerId = req.params.laborerId;
        const applications = await Applicant.find({ laborerId: laborerId });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications" });
    }
});
// Get all applicants for a specific farmer
router.get('/by-farmer/:farmerId', async (req, res) => {
    const { farmerId } = req.params;
    try {
        const applicants = await Applicant.find({ farmerId });
        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch applicants", error });
    }
});
router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updated = await Applicant.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update status", error: err });
    }
});


module.exports = router;
