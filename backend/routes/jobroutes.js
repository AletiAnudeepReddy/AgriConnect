const express = require('express');
const router = express.Router();
const { createJob, getAllJobs } = require('../controllers/jobcontroller');

router.post('/create', createJob);
router.get('/all', getAllJobs); // This is for laborers

module.exports = router;
