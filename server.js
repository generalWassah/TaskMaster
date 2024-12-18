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

connectWithRetry();

// Start the server
const deploymentUrl = process.env.DEPLOYMENT_URL || "http://localhost:3000";

//console.log("App is running at:", deploymentUrl);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${deploymentUrl}:${PORT}`));

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

