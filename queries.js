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
};

function getUsers() {
    return User.findAll({attributes: ['username', 'password', 'email']})
        .then(users => {
            console.log(users)
            return users;
        })
        .catch(err => {
            console.log(err);
            // TODO change error to proper error
            return "error"; 
        });     
};

// checks if user email is unique
function checkEmail(email) {
    return User.find({ 
        where: {
        email: email
        }
      })
        .then(user => {
            console.log(user)
            return users;
        })
        .catch(err => {
            console.log(err);
            // TODO change error to proper error
            return "error"; 
        });     
};

// create user in Users table
function createUser({ username, password, email }) {
    return User.create({ username: username, password: password, email: email})
    .then(user => {
        console.log("User's auto-generated ID:", user.id);
        return user;
    })
    .catch(err => {
        console.log(err);
        // TODO change error to proper error
        return "error"; 
    });
}

module.exports = { authenticate, getUsers, checkEmail, createUser};