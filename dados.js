const allowedOrigins = 
    [
        'https://jlam-vuejwt.netlify.app',
    ]

const refreshTokens = [];

const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin',
        rft: null
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member',
        rft: null
    }, {
        username: 12,
        password: 12,
        role: 'testjwt',
        rft: null
    }, {
        username: 11,
        password: 11,
        role: 'test',
        rft: null
    }
]

const books = [
    {
        "author": "Chinua Achebe",
        "country": "Nigeria",
        "language": "English",
        "pages": 209,
        "title": "Things Fall Apart",
        "year": 1958
    },
    {
        "author": "Hans Christian Andersen",
        "country": "Denmark",
        "language": "Danish",
        "pages": 784,
        "title": "Fairy tales",
        "year": 1836
    },
    {
        "author": "Dante Alighieri",
        "country": "Italy",
        "language": "Italian",
        "pages": 928,
        "title": "The Divine Comedy",
        "year": 1315
    },
]

module.exports = {
    users, books, allowedOrigins, refreshTokens
}