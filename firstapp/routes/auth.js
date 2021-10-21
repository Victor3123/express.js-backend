const express = require('express');
const router = express.Router();
const _ = require('lodash');
const db = require('../db/db.js');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/login', async function ({body: {email, password}}, res, next) {
    console.log(email, password);

    db.get("SELECT * FROM users WHERE email = ?", email, async (err, row) => {
        console.log(row);
        if (!_.isUndefined(row) && await bcrypt.compare(password, row.password)) {
            return res.json({
                user: row,
            });
        }

        return res.status(404).json({
            message: 'Wrong credentials!'
        });
    });
});

module.exports = router;
