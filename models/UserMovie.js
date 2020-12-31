const Sequelize = require('sequelize');
const db = require('../database.js');
const Movie = require('./Movie.js');
const User = require('./User.js');

const UserMovie = db.define('users_movies', {}, { timestamps: false });
Movie.belongsToMany(User, { through: UserMovie });
User.belongsToMany(Movie, { through: UserMovie });

module.exports = UserMovie;