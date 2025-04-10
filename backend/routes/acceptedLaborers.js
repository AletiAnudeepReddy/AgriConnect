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

module.exports = router;
