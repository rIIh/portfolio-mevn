import * as express from 'express';
import site from '../model/site';

var router = express.Router();

/* GET photos listing. */
router.get('/:name', function (req, res, next) {
    var request = req.params.name as String;
    site.TemplateDAO.findOne({name: request}, (err, result) => {
        console.log(err);
        console.log(result);
        if(result) res.send(result);
    })  
    res.status(404).send('not found');
});

module.exports = router;
