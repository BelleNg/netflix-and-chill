const Sequelize = require('sequelize');
const db = require('../database.js');

const Genre = db.define('genre', {
// attributes
id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
    },
name: {
    type: Sequelize.STRING,
    allowNull: false
    }
},{
    // options
});

// Genre.associate = (models) => {
//     Genre.belongsToMany(models.Team, {
//         through: 'member',
//     });
// };

module.exports = Genre;