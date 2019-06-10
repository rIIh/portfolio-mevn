var express = require('express');
var router = express.Router();
const db_controller = require('../controllers/db_controller')

router.post('/new', db_controller.createUser)
router.post('/auth', db_controller.authenticate)

module.exports = router;