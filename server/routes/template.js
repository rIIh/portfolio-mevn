const DAO = require('../model/models')
var router = require('express').Router();

/* GET photos listing. */
router.get('/:name', function (req, res, next) {
    var request = req.params.name;
    DAO.TemplateDAO.findOne({
        name: request
    }, (err, result) => {
        console.log(err);
        console.log(result);
        if (result) res.send(result);
    })
    res.status(404).send('not found');
});

module.exports = router;