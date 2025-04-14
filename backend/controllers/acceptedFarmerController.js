// controllers/acceptedFarmerController.js
const AcceptedFarmer = require('../models/acceptedFarmer');

// POST - Store accepted farmer-laborer-job
exports.acceptFarmer = async (req, res) => {
  try {
    const { farmerFullName, farmerId, laborerId, jobId } = req.body;

    const newEntry = new AcceptedFarmer({
      farmerFullName,
      farmerId,
      laborerId,
      jobId,
    });

    await newEntry.save();
    res.status(201).json({ success: true, message: 'Accepted farmer stored', data: newEntry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving accepted farmer', error: err });
  }
};

// GET - Show all accepted farmers for a laborer
exports.getAcceptedFarmersByLaborer = async (req, res) => {
  try {
    const { laborerId } = req.params;

    const entries = await AcceptedFarmer.find({ laborerId });
    res.status(200).json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching accepted farmers', error: err });
  }
};

// DELETE - Remove accepted entry when needed (e.g., after rating)
exports.deleteAcceptedFarmerByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const result = await AcceptedFarmer.deleteMany({ jobId });
    res.status(200).json({ success: true, message: 'Accepted farmer deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting entry', error: err });
  }
};
