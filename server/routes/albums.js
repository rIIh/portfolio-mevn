var router = require('express').Router();
var DAO = require('../model/models');
const formidable = require('formidable');


function getAlbums(authenticated, response) {
    DAO.AlbumDAO.find(authenticated ? {} : {
        hidden: false
    }, (err, albums) => {
        if (err) return null;
        response.send(albums);
    });
}

/* GET photos listing. */
router.get('/', function (req, res, next) {
    getAlbums(req.body.authenticated, res);
});

function parseAlbum(req, next) {
    let form = new formidable.IncomingForm();
    let album = {
        name: '',
        coverIndex: 0,
        photos: [],
        date: Date.now()
    };

    var path = require('path');
    var appDir = path.dirname(require.main.filename);

    form.uploadDir = appDir + '/resources/photos'
    form.keepExtensions = true;
    form.hash = 'md5';
    form.parse(req)
        .on('file', (name, file) => {
            album.photos.push({
                path: file.path.substring(file.path.indexOf('photos')),
                hash: file.hash,
            })
        })
        .on('field', (name, field) => {
            album[name] = field
        })
        .on('end', () => {
            album.hidden = false;
            next(album);
        })
}

function parsePhotos(req, res, next) {
    let form = new formidable.IncomingForm();
    let photos = [];

    var path = require('path');
    var appDir = path.dirname(require.main.filename);
    form.uploadDir = appDir + '/resources/photos'
    form.keepExtensions = true;
    form.hash = 'md5';

    try {
        form.parse(req)
            .on('file', (name, file) => {
                photos.push({
                    path: file.path.substring(file.path.indexOf('photos')),
                    hash: file.hash,
                })
            })
            .on('aborted', () => res.status(409).send('Connection aborted'))
            .on('error', (err) => res.status(500).send('Something goes wrong'))
            .on('end', () => {
                next(photos);
            })
    } catch (e) {
        res.status(500).send("Something goes wrong")
        console.log(e)
    }
}

//FIX: Check if photo deleted.
router.put('/', function (req, res, next) {
    if (!req.connection.authenticated) res.status(401).send();
    let queue = []
    req.body.forEach(album => {
        queue.push({
            updateOne: {
                filter: {
                    _id: album._id
                },
                update: album
            }
        })
    });
    DAO.AlbumDAO.bulkWrite(queue).then(res => console.log('Album updated', res.insertedCount, res.modifiedCount, res.deletedCount))
    res.json(queue)
})

router.delete('/:name', function (req, res, next) {
    if (!req.connection.authenticated) res.status(401).send();
    DAO.AlbumDAO.deleteOne({
        name: req.params.name
    }, console.log)
    res.send('Everything is OK')
})

router.post('/', (req, res) => {
    if (!req.connection.authenticated) res.status(401).send();
    parseAlbum(req, album => {
        DAO.AlbumDAO.findOne({
            name: album.name
        }, (err, result) => {
            if (err) throw (err)
            if (result !== null) {
                res.status(400).send('Album with that name already exists')
            } else {
                DAO.AlbumDAO.create(album);
                res.send('Everything is OK')
            }
        })
    })
})

router.post('/:id/photos_post', (req, res) => {
    if (!req.connection.authenticated) res.status(401).send();
    if (req.params.id === undefined) res.status(404).send('Album not found')
    parsePhotos(req, res, photos => {

        DAO.AlbumDAO.findOne({
            _id: req.params.id
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                Array.prototype.push.apply(result.photos, photos);
                DAO.AlbumDAO.updateOne({
                    _id: req.params.id
                }, {
                    photos: result.photos
                }, (err, result) => {
                    res.send('Everything is OK')
                });
            } else res.status(500).send('Something goes wrong')
        })
    })
})

router.get('/:id', function (req, res, next) {
    DAO.AlbumDAO.findOne({
        name: req.params.id
    }, (err, result) => {
        if (err) throw (err);
        if (result === null) res.status(404).send('Album not found')
        else res.send(result)
    })
});

module.exports = router;