const express = require('express');

const router = express.Router();

const error404 = require('../controllers/error')

router.use(error404.error404);

module.exports = router;