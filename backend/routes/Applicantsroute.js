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

module.exports = router;
