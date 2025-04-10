const express = require("express");
const router = express.Router();
const {
    addAcceptedLaborer,
    getAcceptedLaborersByFarmer,
    deleteAcceptedLaborersByFarmer,
} = require("../controllers/acceptedLaborerController");

// POST: Accept laborer
router.post("/api/accepted-laborers/add", addAcceptedLaborer);

// ✅ GET: Get accepted laborers by farmer ID
router.get("/accepted-laborers/by-farmer/:farmerId", getAcceptedLaborersByFarmer);

// DELETE: Delete all accepted laborers for a farmer (optional)
router.delete("/api/accepted-laborers/by-farmer/:farmerId", deleteAcceptedLaborersByFarmer);
router.get("/check", async (req, res) => {
    const { farmerId, laborerId, jobId } = req.query;

    try {
        const existing = await Rating.findOne({ farmerId, laborerId, jobId });
        if (existing) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (err) {
        console.error("Check error:", err);
        res.status(500).json({ message: "Error checking rating" });
    }
});
module.exports = router;
