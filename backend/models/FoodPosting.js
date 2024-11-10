// models/FoodPosting.js
const mongoose = require('mongoose');

const foodPostingSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: Number,
    expiry_date: Date,
    location: String,
    status: { type: String, default: 'Available' },
    posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('FoodPosting', foodPostingSchema);
