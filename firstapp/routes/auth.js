const express = require('express');
const router = express.Router();
const _ = require('lodash');
const db = require('../db/db.js');
const bcrypt = require('bcrypt');
const {next, value} = require("lodash/seq");
const {body, validationResult, check} = require('express-validator');

/* GET users listing. */
router.post('/login',
    async function (req, res, next) {
        const {body: {email, password}} = req;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: 'Passed data is invalid.',
                errors: errors.array(),
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
                message: 'Wrong credentials.'
            });
        });
    });
router.post(
    '/register',
    check('name').isLength({min: 1}).withMessage('The name cannot be empty.'),
    check('email').isEmail().withMessage('The email must be a valid email address.'),
    body('password').isLength({min: 5}).withMessage('The password must be at least 5 characters.'),
    body('passwordConfirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password.');
        }

        // Indicates the success of this synchronous custom validator
        return true;
    }),
    body('email').custom((value, req) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', value, (err, row) => {
                resolve(row);
            });
        })
            .then(row => {
                if (row) {
                    return Promise.reject('The email is already taken.');
                }
            });


        return true;
    }),
    async function (req, res) {
        const {body: {email, name, password, passwordConfirmation}} = req;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: "Passed data is invalid.",
                errors: errors.array(),
            });
        }
        console.log('validation passed');
        let stmt = db.prepare('INSERT INTO users(email, name, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                stmt.run(email, name, hash, new Date(), new Date());

                stmt.finalize();

                db.get('SELECT * FROM users WHERE email = ?', email, async (err, row) => {
                    console.log(row);
                    if (!_.isUndefined(row) && await bcrypt.compare(password, row.password)) {
                        return res.json({
                            user: row,
                        });
                    }
                });
            });
        });


    }
);

module.exports = router;
