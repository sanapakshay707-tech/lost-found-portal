const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  item: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image: { type: String, default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
