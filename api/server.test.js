// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')



beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})

describe('sanity', () => {
  test('using testing environment', () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })
})
describe('register', () => {
  const newUser = {username: "testUsername", password: "catsname1234"}
  test('successful register returns new user object', async () => {
    const user = await request(server).post('/api/auth/register').send(newUser)
    expect(user.body).toMatchObject({username: "testUsername"})
  })
  test('attempting to register with existing username throws correct error', async () => {
    const existingUser = {username: 'user1', password: '1234'}
    const result = await request(server).post('/api/auth/register').send(existingUser)
    expect(result.body.message).toMatch(/username taken/i)
  })
  test('responds with proper error when password missing', async () => {
    const user = {username: 'Veronica Hollingsworth'}
    const res = await request(server).post('/api/auth/register').send(user)
    expect(res.body.message).toMatch(/username and password required/i)
  })
})
describe('login', () => {
  const testUser = {username: 'username1', password: '1234'}
  test('successful login returns 200 status and welcome message', async () => {
    const newUser = await request(server).post('/api/auth/register').send(testUser)
    const res = await request(server).post('/api/auth/login').send(testUser)
    expect(res.body.message).toMatch(/welcome, username1/i)
    expect(res.status).toBe(200)
  })
  test('successful login returns a json token', async () => {
    const newUser = await request(server).post('/api/auth/register').send(testUser)
    const res = await request(server).post('/api/auth/login').send(testUser)
    expect(res.body.token).toBeTruthy()
  })
  test('responds with correct error when logging in with bad username', async () => {
    const res = await request(server).post('/api/auth/login').send(testUser)
    expect(res.body.message).toMatch(/invalid credentials/i)
  })
  test('responds with correct error when logging in with bad password', async () => {
    const newUser = await request(server).post('/api/auth/register').send(testUser)
    const res = await request(server).post('/api/auth/login').send({username: 'username1', password: 'badpassword'})
    expect(res.body.message).toMatch(/invalid credentials/i)
  })
})
describe('jokes', () => {
  const testUser = {username: 'username1', password: '1234'}
  test('GET jokes attempt without valid token responds with error', async () => {
    let res = await request(server).get('/api/jokes')
    expect(res.body.message).toBe('token required')
  })
  test('GET jokes returns all jokes if valid token is provided', async () => {
    let token
    const newUser = await request(server).post('/api/auth/register').send(testUser)
    const res = await request(server).post('/api/auth/login').send(testUser)
    token = res.body.token
    const jokes = await request(server).get('/api/jokes').set('Authorization', token)
    expect(jokes.body).toHaveLength(3)
  })
})






