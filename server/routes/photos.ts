import * as express from 'express';
var router = express.Router();
var DAO = require('./../model/site');

function getPhotos() {
    var photos = []
    var words = ['art', 'car', 'bus', 'earth', 'camera', 'phone', 'sun', 'light', 'number', 'beuty']
    for (var i = 1; i < 14; i++) {
        photos.push({
            name: words[i % 10],
            path: 'photos/' + i + '.jpg'
        })
    }
    return photos
};

router.get('/albums/', function(req, res, next) {
    DAO.AlbumDAO.find({}, )
});


/* GET photos listing. */
router.get('/', function (req, res, next) {
    let photos = getPhotos();
    res.send(photos);
});

router.post('/:id', (req, res) => {
    require('../model/site').PhotoDAO.create({
        path: req.params.id.toString(),
        hash: 'lols'
    })
    res.send('done');
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    let photos = getPhotos();
    let photo = photos.filter((v) => v.name === id)[0];

    res.send(photo);
});

module.exports = router;
