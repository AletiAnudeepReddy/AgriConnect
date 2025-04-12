const express = require("express");
const router = express.Router();
const {
    addAcceptedLaborer,
    getAcceptedLaborersByFarmer,
    deleteAcceptedLaborersByFarmer,
} = require("../controllers/acceptedLaborerController");

// POST: Accept laborer
router.post("/add", addAcceptedLaborer);

// ✅ GET: Get accepted laborers by farmer ID
router.get("/accepted-laborers/by-farmer/:farmerId", getAcceptedLaborersByFarmer);

// DELETE: Delete all accepted laborers for a farmer (optional)
router.delete("/api/accepted-laborers/by-farmer/:farmerId", deleteAcceptedLaborersByFarmer);
router.delete("/api/accepted-laborers/by-job/:jobId", async (req, res) => {
    const { jobId } = req.params;
    try {
        const result = await require("../models/AcceptedLaborer").deleteMany({ jobId });
        res.status(200).json({ message: "Accepted laborers deleted successfully", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete accepted laborers", error });
    }
});
module.exports = router;
