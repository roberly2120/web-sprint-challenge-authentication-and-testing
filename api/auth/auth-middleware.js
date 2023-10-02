const { JWT_SECRET } = require('../secrets')
const db = require('../../data/dbConfig')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function validateRequestObject (req, res, next) {
    const { username, password } = req.body
    // console.log('username', username, 'password', password)
    console.log(req.body)
    // const trimmedUsername = username.trim()
    if(!username || !password) {
        next({status: 400, message: "username and password required"})
    } else {
        next()
    }
}
async function checkUsernameUnique (req, res, next) {
    const { username } = req.body
    const [usernameExists] = await db('users').where('username', username)
    if(usernameExists === undefined) {
        next()
    } else {
        next({status: 400, message:"username taken"})
    }
}
async function verifyPassword (req, res, next) {
    const { password } = req.body
    if(bcrypt.compareSync(password, req.user.password)) {
        next()
    } else {
        next({status: 400, message: "invalid credentials"})
    }

}
async function usernameExists (req, res, next) {
    const { username } = req.body
    const [usernameExists] = await db('users').where('username', username)
    if(usernameExists === undefined) {
        next({status: 400, message: "invalid credentials"})
    } else {
    req.user = usernameExists
       next() 
    }
}
module.exports = {
    checkUsernameUnique,
    validateRequestObject,
    verifyPassword,
    usernameExists
}