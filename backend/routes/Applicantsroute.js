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

module.exports = router;
