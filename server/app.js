const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const mongoOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true
 }
 
 if (process.env.NODE_ENV == "test") {
    mongoose.connect('mongodb://localhost/apiauthTEST', mongoOptions)
 } else {
    mongoose.connect('mongodb://localhost/apiauth', mongoOptions)
 }

const app = express();

// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
    app.use(morgan('dev'))
}

app.use(bodyParser.json())

// Routes
app.use('/users',  require('./routes/users'))

module.exports = app