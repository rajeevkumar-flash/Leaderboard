require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const userRoutes = require('./routes/users');
const claimRoutes = require('./routes/claims');

const app = express();

// Define PORT
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any undefined values
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware (apply CORS before routes)
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Leaderboard API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize with default users if database is empty
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  
  if (userCount === 0) {
    console.log('Initializing default users...');
    const defaultUsers = ['Rahul', 'Kamal', 'Sanak', 'Priya', 'Amit', 
                         'Neha', 'Vijay', 'Pooja', 'Suresh', 'Anjali'];
    
    for (const name of defaultUsers) {
      await User.create({ name });
    }
    console.log('Default users created successfully');
  }
});