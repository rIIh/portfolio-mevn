import express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const keys = require('./config/keys')
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieparser = require('cookie-parser');
const model = require('./model/site')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(cors());
app.use(morgan('tiny'));

app.listen(process.env.PORT || 5000, () => {
    console.log("Express listening on port 5000")
});
app.use(function (err: any, req: any, res: any, next: any) {
    console.log(err);
});

// DB Connection
mongoose.connect(keys.mongo_uri, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
    console.log("Error in database connection")
})
mongoose.connection.once('open', function () {
    console.log("DB connection established")
})

app.use(cookieparser('mySecret'));

app.use(session({
    secret: "mySecret",
    resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user: any, done: Function) {
    done(null, user._id);
});

passport.deserializeUser(function (id: number, done: Function) {
    model.UserDAO.findById(id, function (err: any, user: any) {
        console.log(err);
        console.log(user);
        done(err, user);
    });
});

var isValidPassword = function (user: any, password: string) {
    return user.password == password;
}

passport.use('login', new LocalStrategy(
    { passReqToCallback: true },
    function (_req: any, username: string, password: string, done: Function) {
        console.log("searching");
        model.UserDAO.findOne({ username: username }, function (err: any, user: any) {
            if (err) {
                console.log(err)
                return done(err);
            }
            if (!user) {
                console.log('User not found with username ' + username);
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                console.log("Wrong password");
                return done(null, false);
            }
            console.log('user found')
            return done(null, user);
        })
    }
))



app.use('/api/photos', require('./routes/photos'));
app.use('/api/template', require('./routes/template'));
app.use('/api/', require('./routes/user')(passport));
app.get('/api/*', (req, res) => res.status(404).send('nothing'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public/'));
    app.use(express.static(__dirname + '/resources/'));
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}


if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(__dirname + '/public/'));
    app.use(express.static(__dirname + '/resources/'));
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
