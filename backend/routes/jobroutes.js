const express = require('express');
const router = express.Router();

const {
  createJob,
  deleteJob,
  getAllJobs,
  getJobsByFarmerId,
  completeJobAndCleanup
} = require('../controllers/jobcontroller');

router.post('/create', createJob);
router.get('/all', getAllJobs);
router.get('/farmer/:farmerId', getJobsByFarmerId);
router.delete('/:jobId', deleteJob);
router.delete("/complete/:jobId", completeJobAndCleanup);

module.exports = router;
