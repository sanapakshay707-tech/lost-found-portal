const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const claimRoutes = require('./routes/claims');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/lostfound', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

app.use('/api', authRoutes);
app.use('/api', claimRoutes);

app.get('/', (req, res) => res.send('Lost & Found backend running...'));

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
