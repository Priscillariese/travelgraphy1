const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

// GET route to display trip details
router.get('/:id', (req, res) => {
  const tripId = req.params.id;
  Trip.findById(tripId)
    .then((trip) => {
      res.render('tripDetails', { trip });
    })
    .catch((error) => {
      console.error('Error fetching trip details:', error);
      res.status(500).send('Error fetching trip details');
    });
});

module.exports = router;