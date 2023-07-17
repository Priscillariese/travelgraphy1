const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

// POST route to delete a trip
router.post('/:id/delete', (req, res) => {
  const tripId = req.params.id;

  Trip.findByIdAndDelete(tripId)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error('Error deleting trip:', error);
      res.status(500).send('Error deleting trip');
    });
});

module.exports = router;