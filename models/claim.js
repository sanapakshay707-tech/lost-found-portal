const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  item: { type: String, required: true, trim: true },        // Name of the lost/found item
  description: { type: String, trim: true },                 // Details about the item
  image: { type: String, default: null },                    // Uploaded image filename
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to user
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('Claim', claimSchema);
