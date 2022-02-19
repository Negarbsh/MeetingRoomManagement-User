const jwt = require('jsonwebtoken');
const express = require('express');
const myApp = express();


something = require('crypto').randomBytes(64).toString('hex')


function generateAccessToken(username) {
    const token_s = "09f26e402586e2faa8da4c98a35f1b20d6b033c60"
    return jwt.sign(username, token_s, {expiresIn: '1800s'}, {}); //todo idk
}


myApp.post('/test', (req, res) => {
    const token = generateAccessToken({username: req.body.username});
    res.json(token);

});