const Sequelize = require('sequelize');
const db = require('../database.js');
const Movie = require('./Movie.js');
const User = require('./User.js');

const User_Movie = db.define('users_movies', {}, { timestamps: false });
Movie.belongsToMany(User, { through: User_Movie });
User.belongsToMany(Movie, { through: User_Movie });

module.exports = User_Movie;