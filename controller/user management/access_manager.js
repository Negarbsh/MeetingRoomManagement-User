const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
Action = require('./actions')

function has_access(user, action) {
    if (!user) return false //if the user didn't exist (which happens when the token is wrong, it has no access!)
    switch (action) {
        case Action.sign_up_admin:
            return true
        case Action.create_employee:
            return user === User.admin
        case Action.logout:
            return true
        default:
            return true //todo complete
    }
}


async function create_access_token(email, id) {
    process.env.TOKEN_KEY = "it should've been secret!" //todo it shouldn't be hard-coded like this
    return await jwt.sign(
        {user_id: id, email: email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
}

//we should parse the token in the data and find out who has sent this request
async function authenticate_actor(token) {
    const decoded_token = await jwt_decode(token)
    return User.get_user_by_email(decoded_token.email)
}

module.exports = {has_access, create_access_token, authenticate_actor}


// create_access_token('somehin', 12).then(
//     function (token) {
//         authenticate_actor(token)
//     },
//     function (error) {
//         console.log(error)
//     }
// )