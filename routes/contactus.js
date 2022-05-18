const express = require('express');

const contactuspostpage = require('../controllers/contactus')

const router = express.Router();

router.get('/contactus',contactuspostpage.contactusGet
)

router.post('/contactus',contactuspostpage.contactusPost)

module.exports = router;