const express = require('express');
const router = express.Router();

const {
  createJob,
  deleteJob,
  getAllJobs,
  getJobsByFarmerId
} = require('../controllers/jobcontroller');

router.post('/create', createJob);
router.get('/all', getAllJobs);
router.get('/farmer/:farmerId', getJobsByFarmerId);
router.delete('/:jobId', deleteJob);

module.exports = router;
