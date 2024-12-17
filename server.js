const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB connection
/*
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
*/

connectWithRetry();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

function connectWithRetry() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MongoDB is connected');
        })
        .catch((err) => {
            console.error('MongoDB connection failed, retrying...', err);
            setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        });
}

/* mongodb://localhost:3000/ */

/* mongodb+srv://currentUser:User19AtTaskMaster@taskmasteronline.iupp5.mongodb.net/ */

/* 649e300f57db2ef3062067ea6d45606e58e2473797f33fbaa3755fbf451fe254ed4ff4a5ea8e264bd7164dca1473019b36653518d5e9c042a767c6008ed62759 */