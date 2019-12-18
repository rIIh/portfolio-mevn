const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
// const morgan = require('morgan')
const jwt = require('jsonwebtoken');
require('dotenv-flow').config()


const app = express();

// var dash = require('appmetrics-dash').attach()
require('./config/dirs').init(__dirname)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
})); // parse application/x-www-form-urlencoded
app.use(cors());
// app.use(morgan('tiny'));

app.listen(process.env.PORT || 5000, () => {
    let port = process.env.PORT || 5000
    console.log('Express listening on port ' + port)
});

app.use(function (err, req, res, next) {
    // console.log(err);
    res.send(err)
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});

mongoose.connection.on('error', () => {
    console.log("Error in database connection")
})

mongoose.connection.once('open', function () {
    console.log("DB connection established")
    require('./controllers/db_controller').createRoot(
        process.env.DEFAULT_USER,
        process.env.DEFAULT_PASSWORD);
})

app.set('secretKey', 'yuri-tar-prod-!rathive'); // jwt secret token

app.use('/api/albums', validation, require('./routes/albums'));
app.use('/api/settings', validation, require('./routes/settings'));
app.get('/api/admin/status', privateAccess, (req, res) => res.send('Success'))
app.use('/api/admin', require('./routes/user')(privateAccess))
app.get('/api/*', (req, res) => res.status(404).send('nothing'))


function validation(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            req.connection.authenticated = false;
        } else {
            req.connection.authenticated = true;
        }
        next();
    });
}

function privateAccess(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.status(401).json({
                status: "error",
                message: err.message,
                data: null
            });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/resources/'));
//TODO: Create rebuild in progress page
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));