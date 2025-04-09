const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingsController");

router.post("/add", ratingController.addRating);
router.get("/by-laborer/:laborerId", ratingController.getRatingsByLaborer);

module.exports = router;
