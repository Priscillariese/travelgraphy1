const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

// POST route to update trip details
router.post('/:id/update', (req, res) => {
  const tripId = req.params.id;
  const { destination, dates, itinerary } = req.body;

  Trip.findByIdAndUpdate(tripId, { destination, dates, itinerary })
    .then(() => {
      res.redirect(`/trips/${tripId}`);
    })
    .catch((error) => {
      console.error('Error updating trip:', error);
      res.status(500).send('Error updating trip');
    });
});

module.exports = router;