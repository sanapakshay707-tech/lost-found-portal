const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

const claimSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // store path or cloud URL
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Claim = mongoose.model('Claim', claimSchema);

// Create claim
router.post('/claims', auth, async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const claim = await Claim.create({
      title,
      description,
      imageUrl,
      userId: req.user.userId
    });
    res.status(201).json({ message: 'Claim submitted', claim });
  } catch (err) {
    console.error('❌ Claim create error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});
// Get all claims (feed)
router.get('/claims', async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json({ claims });
  } catch (err) {
    console.error("❌ Claim fetch error:", err);
    res.status(500).json({ message: 'Failed to load claims' });
  }
});


module.exports = router;
