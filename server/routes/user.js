var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    // router.post('/admin', function (req, res, next) {
    //     passport.authenticate('login', function (err, user, info) {
    //         console.log(err);
    //         console.log(user);
    //         console.log(info);

    //         if (err) {
    //             res.status(401).send(error);
    //         } else if (!user) {
    //             res.status(401).send(info);
    //         } else {
    //             next();
    //         }
    //         res.status(401).send(info);
    //     })(req, res);
    // }, function (req, res) {
    //     res.status(200).send('logged in!');
    // });
    router.post('/admin', passport.authenticate('login', { failureRedirect: '/login' }), function (req, res) {
        res.send(req.user);
    });

    router.get('/status', (req, res, next) => {
        //TODO send session data
        res.send(req.isAuthenticated());
    })

    function mustAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.status(401).send("Unauthorized");
        }
        next();
    }

    router.get('/restricted', mustAuthenticated, (req, res) => {
        res.send("Success");
    });

    return router;
}