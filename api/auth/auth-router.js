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
});

router.post('/login', validateRequestObject, usernameExists, verifyPassword, (req, res) => {
  const token = makeToken(req.user)
  res.status(200).json({message: `welcome, ${req.user.username}`, token: token})
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
