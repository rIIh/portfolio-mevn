var express = require('express');
var router = express.Router();

function getPhotos() {
    var photos = []
    words = ['art', 'car', 'bus', 'earth', 'camera', 'phone', 'sun', 'light', 'number', 'beuty']
    for (var i = 1; i < 14; i++) {
        photos.push({
            name: words[i % 10],
            path: 'photos/' + i + '.jpg'
        })
    }
    return photos
};


/* GET photos listing. */
router.get('/', function (req, res, next) {
    let photos = getPhotos();

    res.send(photos);
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    let photos = getPhotos();
    let photo = photos.filter((v) => v.name === id)[0];

    res.send(photo);
});

module.exports = router;
