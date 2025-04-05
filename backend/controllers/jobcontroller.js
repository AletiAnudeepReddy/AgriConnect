const Job = require('../models/jobs');

// @desc   Create a new job
// @route  POST /jobs/create
exports.createJob = async (req, res) => {
  try {
    const {
      farmer_id,
      title,
      location,
      date,
      timings,
      wages,
      workers_required
    } = req.body;

    if (!farmer_id || !title || !location || !date || !timings || !wages || !workers_required) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newJob = new Job({
      farmer_id,
      title,
      location,
      date,
      timings,
      wages,
      workers_required
    });

    const savedJob = await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: savedJob });

  } catch (err) {
    console.error("Error in createJob:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc   Get all jobs (for laborers dashboard)
// @route  GET /jobs/all
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('farmer_id', 'fullname farm_location');
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error in getAllJobs:", err);
    res.status(500).json({ error: "Server error while fetching jobs" });
  }
};

exports.getJobsByFarmerId = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const jobs = await Job.find({ farmer_id: farmerId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: "No jobs found for this farmer" });
    }

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error in getJobsByFarmerId:", err);
    res.status(500).json({ error: "Server error while fetching jobs by farmer" });
  }
};

// @desc   Delete a job by ID
// @route  DELETE /jobs/:jobId
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully", deletedJob });
  } catch (err) {
    console.error("Error in deleteJob:", err);
    res.status(500).json({ error: "Server error while deleting job" });
  }
};
