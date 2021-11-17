const express = require('express');
const router = express.Router();
const pug = require('pug')

router.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
})

module.exports = router;