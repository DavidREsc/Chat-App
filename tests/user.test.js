const request = require('supertest')
const hashPassword = require('./hashPassword')
const server = require('../src/server')
const db = require('../src/db')

const userOne = {
    username: 'userOne',
    email: 'userOne@gmail.com',
    password: 'userOne'
}

const userTwo = {
    username: 'userTwo',
    email: 'userTwo@gmail.com',
    password: 'userTwo'
}

const userThree = {
    username: 'userThree',
    email: 'userThree@gmail.com',
    password: 'userThree'
}

const userFour = {
    username: 'userFour',
    email: 'userFour@gmail.com',
    password: 'userFour'
}

const agent = request.agent(server)

describe('Signup and login tests', () => {
    beforeEach(async () => {
        await db.query('DELETE FROM messages')
        await db.query('DELETE FROM friend_requests')
        await db.query('DELETE FROM users')
        const hashedPassword = await hashPassword(userOne.password)
        await db.query('INSERT INTO users (username, email, password) ' +
        'VALUES ($1, $2, $3)', [userOne.username, userOne.email, hashedPassword])
    })
    
    // valid user signup tests
    test('Signup a new user', async () => {
        // assert signup is successful
        await agent.post('/api/v1/user/signup').send({
            username: 'David',
            email: 'david.rapalae@gmail.com',
            password: 'password'
        }).expect(200)
        
        // assert new user data inserted in database
        const data = await db.query('SELECT * FROM users WHERE email = $1', ['david.rapalae@gmail.com']);
        expect(data.rows[0]).not.toBeNull()
    
        // assert password is hashed
        const password = data.rows.password
        expect(password).not.toBe('password')
    
        // assert valid json webtoken set 
        const response = await agent.post('/api/v1/user/authorized').send().expect(200)
    
        // assert authorized response
        expect(response.body).toMatchObject({
            username: data.rows[0].username,
            user_id: data.rows[0].user_id
        })
       
    })
    
    // valid user login tests
    test('Login a user', async () => {
        // assert login is successful
        await agent.post('/api/v1/user/login').send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    
        const data = await db.query('SELECT * FROM users WHERE email = $1', [userOne.email])
    
        // assert authorized
        const response = await agent.post('/api/v1/user/authorized').send().expect(200)
    
        // assert authorized response
        expect(response.body).toMatchObject({
            username: data.rows[0].username,
            user_id: data.rows[0].user_id
        })
    })
    
    // invalid jsonwebtoken tests
    test('Unauthorized and unauthenticated access', async () => {
        // assert unauthorized because missing jsonwebtoken
        await request(server).post('/api/v1/user/authorized').send().expect(401)
    
        // assert unauthorized because invalid jsonwebtoken
        await request(server).post('/api/v1/user/authorized').send({
            cookies: {token: 'invalid'}
        }).expect(401)
    })
    
    // Test login with user that doesn't exist
    test('Login non-existant user', async () => {
        await request(server).post('/api/v1/user/login').send({
            email: 'idontexist@gmail.com',
            password: userOne.password
        }).expect(404)
    })
    
    // Test login with incorrect password
    test('Login with incorrect password', async () => {
        await request(server).post('/api/v1/user/login').send({
            email: userOne.email,
            password: "incorrectPassword"
        }).expect(404)
    })
    
    // Test signup with taken username
    test('Signup with existing username', async () => {
        await request(server).post('/api/v1/user/signup').send({
            username: userOne.username,
            email: 'differentEmail@gmail.com',
            password: 'password'
        }).expect(409)
    })
    
    // Test signup with taken email
    test('Signup with existing email', async () => {
        await request(server).post('/api/v1/user/signup').send({
            username: 'differentName',
            email: userOne.email,
            password: 'password'
        }).expect(409)
    })
    
    // Test signup with username too long/short
    test('Signup with invalid username length', async () => {
        // assert username too short
        await request(server).post('/api/v1/user/signup').send({
            username: 'user',
            email: 'user@gmail.com',
            password: 'password'
        }).expect(400)
    
        // assert username too long
        await request(server).post('/api/v1/user/signup').send({
            username: 'usernameistoolong',
            email: 'user@gmail.com',
            password: 'password'
        }).expect(400)
    })
    
    // Test signup with invalid email format
    test('Signup with invalid email', async () => {
        await request(server).post('/api/v1/user/signup').send({
            username: 'user',
            email: 'usergmail.com',
            password: 'password'
        }).expect(400)
    })
    
    // Test signup with missing data
    test('Signup with missing data', async () => {
        await request(server).post('/api/v1/user/signup').send({
            username: "",
            email: "",
            password: "",
        }).expect(400)
    
        await request(server).post('/api/v1/user/signup').send({
            username: "fakeUser",
            email: "",
            password: "",
        }).expect(400)
    
        await request(server).post('/api/v1/user/signup').send({
            username: "fakeUser",
            email: "fakeEmail@gmail.com",
            password: "",
        }).expect(400)
    })
    
    // Test login with missing data
    test('Login with missing data', async () => {
        await request(server).post('/api/v1/user/login').send({
            email: "",
            password: "",
        }).expect(400)
    
        await request(server).post('/api/v1/user/login').send({
            email: userOne.email,
            password: "",
        }).expect(400)
    })
})


describe('Get user friends, messages, and pending friend requests', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM friend_requests')
        await db.query('DELETE FROM messages')
        await db.query('DELETE FROM users')

        let hashedPassword = await hashPassword(userOne.password)
        const responseUserOne = await db.query('INSERT INTO users (username, email, password) ' +
        'VALUES ($1, $2, $3) RETURNING *', [userOne.username, userOne.email, hashedPassword]) 

        hashedPassword = await hashPassword(userTwo.password)
        const responseUserTwo = await db.query('INSERT INTO users (username, email, password) ' +
        'VALUES ($1, $2, $3) RETURNING *', [userTwo.username, userTwo.email, hashedPassword])

        hashedPassword = await hashPassword(userThree.password)
        const responseUserThree = await db.query('INSERT INTO users (username, email, password) ' +
        'VALUES ($1, $2, $3) RETURNING *', [userThree.username, userThree.email, hashedPassword])

        hashedPassword = await hashPassword(userFour.password)
        const responseUserFour = await db.query('INSERT INTO users (username, email, password) ' +
        'VALUES ($1, $2, $3) RETURNING *', [userFour.username, userFour.email, hashedPassword])

        const userOneId = responseUserOne.rows[0].user_id
        const userTwoId = responseUserTwo.rows[0].user_id
        const userThreeId = responseUserThree.rows[0].user_id
        const userFourId = responseUserFour.rows[0].user_id

        await db.query('INSERT INTO friend_requests (sender_id, receiver_id, request_status) ' +
        'VALUES ($1, $2, $3) RETURNING *', [userOneId, userTwoId, 'accepted'])

        await db.query('INSERT INTO friend_requests (sender_id, receiver_id, request_status) ' +
        'VALUES ($1, $2, $3)', [userOneId, userThreeId, 'declined'])

        await db.query('INSERT INTO friend_requests (sender_id, receiver_id, request_status) ' +
        'VALUES ($1, $2, $3)', [userFourId, userOneId, 'pending'])

        await agent.post('/api/v1/user/login').send({
            email: userOne.email,
            password: userOne.password
        })
    })

    test('Get user data 1', async () => {
        const response = await agent.get('/api/v1/user/data').send() 
        expect(response.body).toMatchObject({
            friends: [{friend: 'userTwo', status: 0}],
            messages: [],
            pendingFriendRequests: [{sender_username: 'userFour'}]
        })
    })
})