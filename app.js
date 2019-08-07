const express = require ('express');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const app = express();

// Connect to Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/eservice', { useNewUrlParser: true });

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/usersRoutes'));

// Start Server
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Server listening at : '+port);