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
            console.log(file)
            album.photos.push({
                path: file.path.substring(file.path.indexOf('photos')),
                hash: file.hash,
            })
        })
        .on('field', (name, field) => {
            // if (name === 'photos') {
            //     Array.from(field).forEach(photo => {
            //         album[name].push(photo)
            //     });
            // } else
            album[name] = field
        })
        .on('end', () => {
            console.log(album);
            album.hidden = false;
            next(album);
        })
}

function parsePhotos(req, next) {
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
                console.log(file)
                photos.push({
                    path: file.path.substring(file.path.indexOf('photos')),
                    hash: file.hash,
                })
            })
            .on('field', (name, field) => {
                console.log(name, field)
            })
            .on('error', (err) => console.log(err))
            .on('end', () => {
                next(photos);
            })
    } catch (e) {
        console.log(e)
    }
}

router.put('/', function (req, res, next) {
    if (!req.body.authenticated) res.status(401).send();
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
    DAO.AlbumDAO.bulkWrite(queue).then(res => console.log(res.insertedCount, res.modifiedCount, res.deletedCount))
    res.json(queue)
})

router.delete('/:name', function (req, res, next) {
    if (!req.body.authenticated) res.status(401).send();
    DAO.AlbumDAO.deleteOne({
        name: req.params.name
    }, console.log)
    res.send('done')
})

router.post('/', (req, res) => {
    if (!req.body.authenticated) res.status(401).send();
    parseAlbum(req, album => {
        DAO.AlbumDAO.findOne({
            name: album.name
        }, (err, result) => {
            if (err) throw (err)
            if (result !== null) {
                res.status(400).send('already exists')
            } else {
                DAO.AlbumDAO.create(album);
                res.send('done')
            }
        })
    })
})

router.post('/:id/photos_post', (req, res) => {
    if (!req.body.authenticated) res.status(401).send();
    if (req.params.id === undefined) res.status(404).send('nothing')
    parsePhotos(req, photos => {

        DAO.AlbumDAO.findOne({
            _id: req.params.id
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                Array.prototype.push.apply(result.photos, photos);
                console.log(result.photos, photos)
                DAO.AlbumDAO.updateOne({
                    _id: req.params.id
                }, {
                    photos: result.photos
                }, (err, result) => {
                    console.log(err, result)

                    res.send('done')
                });
            } else res.status(500).send('failed')
        })
    })
})

router.get('/:id', function (req, res, next) {
    DAO.AlbumDAO.findOne({
        name: req.params.id
    }, (err, result) => {
        if (err) throw (err);
        if (result === null) res.status(404).send('Not found')
        else res.send(result)
    })
});

module.exports = router;