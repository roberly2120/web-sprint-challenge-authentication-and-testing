const db = require('../../data/dbConfig')

async function add(user) {
    const [newUserId] = await db('users').insert(user)
    const newUser = await db('users').where('id', newUserId).first()
    return newUser
}
module.exports = {
    add
}