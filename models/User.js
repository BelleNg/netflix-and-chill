const Sequelize = require('sequelize');
const db = require('../database.js');

const User = db.define('user', {
// attributes
username: {
    type: Sequelize.STRING,
    allowNull: false
},
password: {
    type: Sequelize.STRING,
    allowNull: false
},
email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
    }
}, {
    // options
});

// User.associate = (models) => {
//     User.belongsToMany(models.Team, {
//         through: 'member',
//     });
// };

module.exports = User;