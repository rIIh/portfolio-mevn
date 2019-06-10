var router = require('express').Router();
var DAO = require('../model/models');
const formidable = require('formidable');

function getPhotos() {
    var photos = []
    var words = ['art', 'car', 'bus', 'earth', 'camera', 'phone', 'sun', 'light', 'number', 'beuty', 'tee', 'setf', 'esdff', 'asdds']
    for (var i = 1; i < 14; i++) {
        photos.push({
            name: words[i % 14],
            cover: {
                path: 'photos/' + i + '.jpg'
            },
            photos: []
        })
    }
    return photos
};

// router.get('/', function (req, res, next) {
//     DAO.AlbumDAO.find({}, )
// });

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

router.put('/', function (req, res, next) {
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
    DAO.AlbumDAO.bulkWrite(queue)
    res.json(queue)
})

router.put('/:name', function (req, res, next) {
    let name = req.params.name
    parseAlbum(req, album => {
        console.log(album, name);
        DAO.AlbumDAO.updateOne({
            name: name
        }, album, {}, (err, result) => console.log(err, result));
        res.send('done')
    });
})

router.delete('/:name', function (req, res, next) {
    DAO.AlbumDAO.deleteOne({
        name: req.params.name
    }, console.log)
    res.send('done')
})

router.post('/', (req, res) => {
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