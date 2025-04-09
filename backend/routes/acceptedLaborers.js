const express = require("express");
const router = express.Router();
const controller = require("../controllers/AcceptedLaborerController");

router.post("/add", controller.addAcceptedLaborer);
router.get("/by-farmer/:farmerId", controller.getAcceptedLaborersByFarmer);
router.delete("/by-farmer/:farmerId", controller.deleteAcceptedLaborersByFarmer);

module.exports = router;
