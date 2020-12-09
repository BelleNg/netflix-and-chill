const Sequelize = require('sequelize');
const db = require('./database.js');
const User = require('./models/User');

function authenticate() {
    db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}

function getUsers() {
    return User.findAll({attributes: ['username', 'password', 'email']})
        .then(users => {
            console.log(users)
            return users;
        })
        .catch(err => console.log(err))
}

module.exports = { authenticate, getUsers};