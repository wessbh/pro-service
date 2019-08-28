const express = require ('express');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const app = express();
var cors = require("cors");
// Connect to Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/eservice', { useNewUrlParser: true });

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.use('*', cors());
// Routes
app.use('/domaines', require('./routes/domainesRoutes'));
app.use('/users', require('./routes/usersRoutes'));
app.get('*',(req, res) =>{
    res.status(200).json({Message: 'Hello, Welcome to Pro-services Backend'});
});
// Start Server
const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('Server listening at : '+port);
});
