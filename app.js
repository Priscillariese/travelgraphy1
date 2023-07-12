// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config()

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const User = require('./models/user.model');

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)

// default value for title local
const capitalize = string => string[0].toUpperCase() + string.slice(1).toLowerCase()
const projectName = 'travelgraphy1'

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`

// 👇 Start handling routes here
app.get('/', async (req, res) => {
  try {
    const users = await User.find({ username: 'B4n3l1ng' });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/newUser', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await User.create({ username, email, password });
    res.json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicate Key' });
    } else {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.post('/updateUser', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { password }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/deleteUser', async (req, res) => {
  const { userId } = req.body;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.json(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Index - home 
app.get('/', (req, res) => {
    res.render('index');
  });

// Display all trips
app.get('/alltrips', async (req, res) => {
  console.log(req.query);
  let filter;
  if (req.query.searchTerm?.length > 0) {
    filter = { title: req.query.searchTerm };
  }
  const allTripsFromDB = await Trip.find(filter);
  res.render('allTrips', { trips: allTripsFromDB });
});

// Display the form to create a new trip
app.get('/newtrip', (req, res) => {
  console.log('New Trip Route ping');
  res.render('newTrip');
});

app.post('/createtrip', async (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newTrip = await Trip.create(body);
  res.redirect(`/${newTrip._id}`);
});

// Display one trip
app.get('/:tripId', async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    console.log(trip);
    res.render('oneTrip', trip);
  } catch (error) {
    console.log(error);
    res.send('500 Error server');
  }
});

module.exports = app;
