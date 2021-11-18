const express = require('express');
const router = express.Router();
const _ = require('lodash');
const db = require('../db/db.js');
const bcrypt = require('bcrypt');
const {next} = require("lodash/seq");
const {body, validationResult, check} = require('express-validator');

/* GET users listing. */
router.post('/login', async function ({body: {email, password}}, res, next) {
    console.log(email, password);
    if (_.isEmpty(email || _.isEmpty(password))) {
        return res.status(300).json({
            message: "Lines cannot be empty!",
        });
    }
    db.get('SELECT * FROM users WHERE email = ?', email, async (err, row) => {
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
router.post(
    '/register',
    check('email').isEmail(),
    body('password').isLength({min: 5}),
    body('passwordConfirmation').exists().custom((value, {req}) => value !== req.body.password),

    async function ({body: {email, name, password, passwordConfirmation}}, res, next) {
        if (_.isEmpty(email || _.isEmpty(password) || _.isEmpty(passwordConfirmation))) {
            return res.status(300).json({
                message: "Lines cannot be empty!",
            });
        } else if ( password !== passwordConfirmation ) {
            return res.status(300).json({
                message: "Password lines is diff...!",
            });
        }
        const errors = validationResult(res);
        if(!errors.isEmpty()) {
            return res.status(300).json({
                message: errors,
            });
        }
        console.log('validation passed');
        let stmt = db.prepare('INSERT INTO users(email, name, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                stmt.run(email, name, hash, new Date(), new Date());

                stmt.finalize()

                return res.json({
                    message: 'success',
                })
            });
        });



    }
);

module.exports = router;
