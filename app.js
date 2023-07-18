
require('dotenv').config()
require('./db')

const session = require('express-session');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Post = require('./models/Post.model');
const bcrypt = require('bcryptjs');


const express = require('express')

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  
  })
);


require('./config')(app)


const capitalize = require('./utils/capitalize')
const projectName = 'travelgraphy'

app.locals.appTitle = `${capitalize(projectName)} `

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use((req, res, next) => {
 if (req.session.currentUser) {
   res.locals.currentUser = req.session.currentUser;
  } else {
    res.locals.currentUser = null;
  }
  next();
});


app.get('/', (req, res) => {
  res.render('home');
});


// Rota da página about us
app.get('/aboutUs', (req, res) => {
  res.render('aboutUs');
});



const postroutes = require("./routes/posts.routes")
app.use("/", postroutes)


const registerroutes = require("./routes/register")
app.use("/", registerroutes)


const userroutes = require("./routes/userRoutes")
app.use("/", userroutes)


require('./error-handling')(app)

module.exports = app
