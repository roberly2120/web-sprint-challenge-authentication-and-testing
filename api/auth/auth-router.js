const router = require('express').Router();
const {checkUsernameUnique, validateRequestObject, verifyPassword, usernameExists} = require('./auth-middleware')
const bcrypt = require('bcrypt')
const Users = require('../users/users-model')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets')

router.post('/register', validateRequestObject, checkUsernameUnique, async (req, res) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 8)
  user.password = hash
  Users.add(user)
    .then(user => {
      res.status(200).json(user)
    })
  
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', validateRequestObject, usernameExists, verifyPassword, (req, res) => {
  const token = makeToken(req.user)
  res.status(200).json({message: `welcome, ${req.user.username}`, token: token})
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});
function makeToken(user) {
  const payload = {
    subject: user.id,
  }
  const options = {
    expiresIn: '8h',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
