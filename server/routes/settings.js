const DAO = require('../model/models')
var router = require('express').Router();
const formidable = require('formidable');


function parseForm(req, next) {
    let form = new formidable.IncomingForm();
    let value = {};
    let type = '';

    var path = require('path');
    var appDir = path.dirname(require.main.filename);
    form.keepExtensions = true;
    form.hash = 'md5';

    form.parse(req)
        .on('field', (name, field) => {
            switch (name) {
                case 'type': {
                    type = field;
                    console.log(field)
                    form.uploadDir = appDir + '/resources/' + type + 's'
                    break;
                }
                case 'payload': {
                    let entries = Object.entries(JSON.parse(field));
                    entries.forEach(val => {
                        value[val[0]] = val[1]
                    });
                    break;
                }
            }
        })
        .on('file', (name, file) => {
            value['path'] = file.path.substring(file.path.indexOf(type + 's'))
            value['hash'] = file.hash
        })
        .on('aborted', () => console.log('aborted'))
        .on('end', () => {
            next(value);
        })
}

router.get('/:name', function (req, res) {
    DAO.SettingsDAO.findOne({
        name: req.params.name
    }, (err, result) => {
        if (err) throw err;
        if (result) res.send(result.value);
        else res.send('none');
    })
});

router.put('/:name', function (req, res) {
    if (!req.connection.authenticated) res.status(401).send();
    console.log(req.body)
    let data = req.body;
    if (data.parse) data.value = JSON.parse(data.value);
    DAO.SettingsDAO.findOneAndUpdate({
        name: req.params.name,
    }, {
        value: data.value
    }, {
        upsert: true
    }, (err, result) => res.send(result))
})

router.delete('/:name', function (req, res) {
    if (!req.connection.authenticated) res.status(401).send();
    DAO.SettingsDAO.deleteOne({
        name: req.params.name
    }, err => console.log(err));
    res.send('done')
})

router.post('/:name', function (req, res) {
    if (!req.connection.authenticated) res.status(401).send();
    parseForm(req, value => {
        DAO.SettingsDAO.findOneAndUpdate({
            name: req.params.name,
        }, {
            value: value
        }, {
            upsert: true
        }, (err, result) => res.send(result))
    })
})

module.exports = router;