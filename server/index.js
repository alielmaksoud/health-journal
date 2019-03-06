//dotenv dependancy:
require('dotenv').config()

//backend dependancies:
const express = require('express'),
      sessions = require('express-session'),
      massive = require('massive'),
      { json } = require('body-parser'),
      pg = require('pg'),
      pgSession = require('connect-pg-simple')(sessions),
      { MASSIVE_CONNECTION, SESSION_SECRET, SERVER_PORT } = process.env,
      pgPool = new pg.Pool({
        connectionString: MASSIVE_CONNECTION
    })

//controllers:
    const authCtrl = require('./AuthController'),
          entriesCtrl = require('./entriesController')
      
const app = express()

//middleware:
app.use(json())

//sessions:
app.use(sessions({
    store:new
    pgSession({
        pool: pgPool
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60*60
    }
}))

//links to db:
massive(MASSIVE_CONNECTION)
    .then(db => {
        app.set('db', db)

//Sever connection:
        app.listen(SERVER_PORT, () => console.log(`Live on port: ${SERVER_PORT}`))
    })

app.post('/auth/register', authCtrl.register)