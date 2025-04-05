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
