const middleware = require('./middleware.js');
const dados = require('./dados.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');


const app = express();

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (dados.allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        callback(null, true);
        //callback(new Error(`Origin: ${origin} is now allowed`))
    }
  }
}))

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

app.use(bodyParser.json());
app.use(cookieParser())

app.get('/books', middleware.authenticateJWT, (req, res) => {
    const { role } = req.user;
    if (role !== 'testjwt') {
        return res.sendStatus(403);
    }
    res.json(dados.books);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = dados.users.find(u => { return u.username == username && u.password == password });
    if (user) {
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: 60 });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);
        delete dados.refreshTokens[user.rft];
        user.rft = refreshToken;
        dados.refreshTokens[refreshToken] = accessToken;
        res.cookie('Authorization', accessToken, {maxAge:180000, httpOnly:true});
        res.json({
            refreshToken
        });
    } else {
        res.json({ erro: 1});
    }
});

app.post('/token', (req, res) => {
    const { token } = req.body;
    const authHeader = req.cookies.Authorization;
    if (!authHeader) {
        return res.sendStatus(400);
    }
    if (!token) {
        return res.sendStatus(400);
    }
    if (!(token in dados.refreshTokens)) {
        return res.sendStatus(403);
    }
    if (authHeader != dados.refreshTokens[token]) {
        return res.sendStatus(403);
    }
    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: 60 });
        dados.refreshTokens[token] = accessToken;
        res.cookie('Authorization', accessToken, {maxAge:180000, httpOnly:true}).sendStatus(201);
    });
});

app.post('/logout', (req, res) => {
    const { username } = req.body;
    if (username) {
        const user = dados.users.find(u => { return u.username == username });
        if (user) {
            delete dados.refreshTokens[user.rft];
            user.rft = null;
        }    
    }
    res.cookie('Authorization', null, { maxAge:0 }).send();
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Authentication service started on port %s', port);
});
