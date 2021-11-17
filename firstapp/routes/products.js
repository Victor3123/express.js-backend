const express = require('express');
const router = express.Router();
const _ = require('lodash');
const db = require('../db/db.js');
const path = require('path')

router.get('/', async function ({}, res, next) {
    console.log(path.resolve(__dirname, '../public/images/good_id_1.jpg'));
    let goods;
    db.all('SELECT * FROM goods', async function (err, rows) {
        res.json({
            goodsList: rows,
        });
    });
});

router.post('/add', async function (body, res,next) {
    console.log(body)
});

module.exports = router;