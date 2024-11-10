// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
require('./conn')
dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
