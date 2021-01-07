const Sequelize = require('sequelize');
const db = require('../database.js');

const Movie = db.define('movie', {
// attributes
id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    allowNull: false
    },
title: {
    type: Sequelize.STRING,
    allowNull: false
    },
genre_ids: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: false
    }, 
overview: {
    type: Sequelize.TEXT,
    allowNull: false
    },
release_date: {
    type: Sequelize.STRING,
    allowNull: false
    },
poster_path: {
    type:Sequelize.STRING,
    allowNull: false
    }
},{
    // options
});

// Movie.associate = (models) => {
//     Movie.belongsToMany(models.Team, {
//         through: 'member',
//     });
// };

module.exports = Movie;