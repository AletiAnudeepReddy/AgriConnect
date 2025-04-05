const mongoose = require('mongoose');

const laborerSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: {
        type: String,
        enum: ['plowing', 'harvesting', 'sowing', 'watering', 'fertilizing'],
        required: true
    },
    experience: { type: Number, default: 0 },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Virtual field: laborer_id
laborerSchema.virtual('laborer_id').get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included when toJSON or toObject is called
laborerSchema.set('toJSON', { virtuals: true });
laborerSchema.set('toObject', { virtuals: true });

const Laborer = mongoose.model('Laborer', laborerSchema);
module.exports = Laborer;
