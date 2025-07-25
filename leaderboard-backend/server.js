require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const userRoutes = require('./routes/users');
const claimRoutes = require('./routes/claims');

const app = express();

// Define PORT
const PORT = process.env.PORT || 5000;

// -------------------
// ✅ CORS Configuration
// -------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim());

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS request from:', origin);

    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) // ✅ Allow all Vercel preview URLs
    ) {
      callback(null, true);
    } else {
      console.warn('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// -------------------
// ✅ Middleware
// -------------------
app.use(cors(corsOptions));
app.use(express.json());

// -------------------
// ✅ Connect to MongoDB
// -------------------
connectDB();

// -------------------
// ✅ Routes
// -------------------
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Leaderboard API is running!' });
});

// -------------------
// ✅ Error Handler
// -------------------
app.use((err, req, res, next) => {
  console.error('❗ Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// -------------------
// ✅ Start Server
// -------------------
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  const User = require('./models/User');
  const userCount = await User.countDocuments();

  if (userCount === 0) {
    console.log('🌱 Initializing default users...');
    const defaultUsers = ['Rahul', 'Kamal', 'Sanak', 'Priya', 'Amit', 
                          'Neha', 'Vijay', 'Pooja', 'Suresh', 'Anjali'];

    for (const name of defaultUsers) {
      await User.create({ name });
    }

    console.log('✅ Default users created successfully');
  }
});

