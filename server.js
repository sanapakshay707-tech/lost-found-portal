const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const claimRoutes = require('./routes/claim'); // if you have claims

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static (for uploads if using local storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection — replace with your actual URI
const MONGO_URI = 'mongodb+srv://sanapakshay:Akshayo7123@cluster0.napcqby.mongodb.net/?appName=Cluster0';


mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api', claimRoutes); // ensure the file exists and exports a router

// Health check
app.get('/', (req, res) => res.send('Lost & Found API is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
