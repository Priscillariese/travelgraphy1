// models/trip.js
const mongoose = require('mongoose');


const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  dates: {
    type: [Date],
    required: true,
  },
  itinerary: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Trip', tripSchema);