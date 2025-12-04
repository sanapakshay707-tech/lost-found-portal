const express = require('express');
const router = express.Router();
const Claim = require('../models/claim');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Submit claim with image
router.post('/claim', auth, upload.single('image'), async (req, res) => {
  const { item, description } = req.body;
  const newClaim = new Claim({
    item,
    description,
    image: req.file ? req.file.filename : null,
    user: req.user.userId,
    status: 'pending'
  });
  await newClaim.save();
  res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
});

// Get user's claims
router.get('/my-claims', auth, async (req, res) => {
  const claims = await Claim.find({ user: req.user.userId });
  res.json(claims);
});

// Get all claims (admin only)
router.get('/all-claims', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const claims = await Claim.find().populate('user', 'name email');
  res.json(claims);
});

// Update claim status
router.put('/claims/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  await Claim.findByIdAndUpdate(req.params.id, { status });
  res.json({ message: `✅ Claim ${status}` });
});

// Search claims
router.get('/search', auth, async (req, res) => {
  const q = req.query.q;
  const claims = await Claim.find({ item: { $regex: q, $options: 'i' } }).populate('user', 'name');
  res.json(claims);
});

// Feed
router.get('/feed', auth, async (req, res) => {
  const claims = await Claim.find().populate('user', 'name').sort({ createdAt: -1 });
  res.json(claims);
});

module.exports = router;
