//we should parse the token in the data and find out who has sent this request
const jwt = require("jsonwebtoken");
const User = require("../model/user");

function authenticate_actor(token) {
    let decoded_token
    try {
        jwt.verify(token, process.env.TOKEN_KEY, {}, function (err, decoded) {
            if (err) throw new Error(err)
            decoded_token = decoded //token info is returned in 'decoded'
        })
        return decoded_token
    } catch (e) {
        return null
    }
}
