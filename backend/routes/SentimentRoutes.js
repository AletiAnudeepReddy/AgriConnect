const express = require('express');
const router = express.Router();
const { analyzeLaborerSentiment } = require('../controllers/SentimentController');

router.get('/laborer/:laborerId', analyzeLaborerSentiment);

module.exports = router;
