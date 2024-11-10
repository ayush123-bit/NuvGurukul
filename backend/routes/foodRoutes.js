// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const FoodPosting = require('../models/FoodPosting');
const Request = require('../models/Request');
const Assignment = require('../models/Assignment');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create Food Posting (Restaurant only)
router.post('/', authenticate, authorize('restaurant'), async (req, res) => {
    const { name, description, quantity, expiry_date, location } = req.body;
    const foodPosting = new FoodPosting({ name, description, quantity, expiry_date, location, status: 'Available', posted_by: req.user.userId });
    await foodPosting.save();
    res.status(201).send(foodPosting);
});

// Update Food Posting (Restaurant only)
router.put('/:id', authenticate, authorize('restaurant'), async (req, res) => {
    const foodPosting = await FoodPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(foodPosting);
});

// Get Available Food Postings (Charity/NGO)
router.get('/', authenticate, authorize('charity'), async (req, res) => {
    const foodPostings = await FoodPosting.find({ status: 'Available' });
    res.send(foodPostings);
});

// Request Pickup (Charity/NGO)
router.post('/:id/request', authenticate, authorize('charity'), async (req, res) => {
    const request = new Request({ food_id: req.params.id, charity_id: req.user.userId, status: 'requested' });
    await request.save();
    await FoodPosting.findByIdAndUpdate(req.params.id, { status: 'Requested' });
    res.status(201).send(request);
});

// Approve/Reject Request (Restaurant only)
router.post('/:id/approve', authenticate, authorize('restaurant'), async (req, res) => {
    await Request.findOneAndUpdate({ food_id: req.params.id }, { status: 'approved' });
    await FoodPosting.findByIdAndUpdate(req.params.id, { status: 'Reserved' });
    res.send({ message: "Request approved" });
});

router.post('/:id/reject', authenticate, authorize('restaurant'), async (req, res) => {
    await Request.findOneAndUpdate({ food_id: req.params.id }, { status: 'rejected' });
    await FoodPosting.findByIdAndUpdate(req.params.id, { status: 'Available' });
    res.send({ message: "Request rejected" });
});

// Assign Volunteer (Restaurant only)
router.post('/:id/assign-volunteer', authenticate, authorize('restaurant'), async (req, res) => {
    const assignment = new Assignment({ food_id: req.params.id, volunteer_id: req.body.volunteer_id, status: 'in transit' });
    await assignment.save();
    await FoodPosting.findByIdAndUpdate(req.params.id, { status: 'In Transit' });
    res.status(201).send(assignment);
});

// Confirm Delivery (Volunteer only)
router.post('/:id/confirm-delivery', authenticate, authorize('volunteer'), async (req, res) => {
    await Assignment.findOneAndUpdate({ food_id: req.params.id, volunteer_id: req.user.userId }, { status: 'delivered' });
    await FoodPosting.findByIdAndUpdate(req.params.id, { status: 'Delivered' });
    res.send({ message: "Delivery confirmed" });
});

module.exports = router;
