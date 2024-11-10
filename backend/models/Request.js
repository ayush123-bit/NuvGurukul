// models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    food_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPosting' },
    charity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['requested', 'approved', 'rejected'], default: 'requested' }
});

module.exports = mongoose.model('Request', requestSchema);
