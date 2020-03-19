const models = require('../model/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    createRoot: function (rootName, rootPassword) {
        models.UserDAO.findOne({
            username: rootName
        }, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            if (res === null) {
                models.UserDAO.create({
                    username: rootName,
                    password: rootPassword
                });
            } else {
                models.UserDAO.update({
                    username: rootName
                }, {
                    password: rootPassword
                })
            };
        })
        // models.AlbumDAO.create({
        //     name: 'test',
        //     cover: {
        //         path: 'test',
        //         hash: 'test',
        //     },
        //     photos: [{
        //         path: 'testtt',
        //         hash: 'testtt'
        //     }],
        //     hidden: false
        // },
        // )
    },
    createUser: function (req, res, next) {
        models.UserDAO.create({
            username: req.body.username,
            password: req.body.password
        }, function (err, result) {
            if (err)
                next(err);
            else
                res.json({
                    status: "success",
                    message: "User added successfully!!!",
                    data: null
                });
        });
    },
    authenticate: function (req, res, next) {
        models.UserDAO.findOne({
            username: req.body.username
        }, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (userInfo === null) {
                    res.status(401).json({
                        status: "error",
                        message: "Invalid email/password!!!",
                        data: null
                    });
                } else
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({
                        id: userInfo._id
                    }, req.app.get('secretKey'), {
                        expiresIn: '9999h'
                    });
                    res.json({
                        status: "success",
                        message: "user found!!!",
                        data: {
                            user: userInfo,
                            token: token
                        }
                    });
                } else {
                    res.json({
                        status: "error",
                        message: "Invalid email/password!!!",
                        data: null
                    });
                }
            }
        });
    }
}