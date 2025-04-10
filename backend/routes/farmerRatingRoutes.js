const express = require("express");
const router = express.Router();
const farmerRatingController = require("../controllers/farmerRatingController");

router.post("/add", farmerRatingController.addFarmerRating);
router.get("/by-farmer/:farmerId", farmerRatingController.getFarmerRatings);

module.exports = router;
