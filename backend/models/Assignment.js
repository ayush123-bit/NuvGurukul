// models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    food_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPosting' },
    volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['in transit', 'delivered'], default: 'in transit' }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
