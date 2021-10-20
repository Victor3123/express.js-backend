const express = require('express');
const router = express.Router();
const _ = require('lodash');
const db = require('../db/db.js');



/* GET users listing. */
router.post('/login', function ({body: {email, password}}, res, next) {
    console.log(email, password);
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (_.isUndefined(row)) {
            res.status(404).json({
                message: 'Wrong credentials!'
            });
        } else {
            res.json({
                user: row,
            });
        }

    })

});

module.exports = router;
