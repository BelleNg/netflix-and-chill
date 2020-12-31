const Sequelize = require('sequelize');
const db = require('./database.js');
const { User, Movie, Genre, UserMovie } = require('./models');

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

async function getUsers() {
    try {
        const users = await User.findAll({
            attributes: ['username', 'password', 'email']
        });
        return users;
    } catch (err) {
        console.log(err);
        throw new Error("error in database");
    }
}

//get Movies of User
async function getMoviesByUserId(userId) {
    try {
        const movies = await UserMovie.findAll({
            attributes: ['movieId'],
            where: { userId: userId }
        });
        console.log(movies);
        return movies;
    } catch (err) {
        console.log(err);
        throw new Error("error in database");
    }
}

// checks if user email is unique
async function getEmail(email) {
    try {
        const user = await User.findOne({ 
            where: {
            email: email
            }
          });
        return user;
    } catch (err) {
        console.log(err);
        throw new Error("error in database");
    }
}

// create user in Users table
async function createUser({ username, password, email }) {
    try {
        await User.create({ 
            username: username, 
            password: password, 
            email: email
        });
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

// get user from database
async function getUser(userID) {
    try {
        const user = await User.findOne({ 
            where: {
            id: userID
            }
          });
        return user;
    } catch (err) {
        console.log(err, "error in getUser");
        throw new Error("error in database")
    }
}

// find movie from database
async function getMovie(movieId) {
    try {
        const movie = await Movie.findOne({ 
            where: {
            id: movieId
            }
          });
        return movie;
    } catch (err) {
        console.log(err, "error in getUser");
        throw new Error("error in database")
    }
}

// add movie to user list
async function insertUserMovies(userID, movieNums) {
    // add movie - user connection in users_movies table.
    try {
        const user = await getUser(userID);
        movieNums.map( async (movieId) => {
            let movie =  await getMovie(movieId);
            let output = await user.addMovies(movie);
            console.log("this is userMovies", output)
        });
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }

}

// get Users by movieIds
async function getUsersByMovieId(movieId) {
    try {
        const users = await UserMovie.findAll({
            attributes: ['userId'],
            where: { movieId: movieId }
        });
        return users;
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

// update username
// async function updateUsername(oldUsername, newUsername) {
//     try {
//         await User.update({ username: newUsername},{
//             where: {
//                 username: oldUsername
//             }
//         });
//     } catch (err) {
//         console.log(err);
//         throw new Error("error in database")
//     }
// }

// TODO create queries for
// update email
// update password

// delete user in Users table
// async function deleteUser(email) {
//     try {
//         await User.destroy({
//             where: { 
//                 email: email,
//             }
//         });
//     } catch (err) {
//         console.log(err);
//         throw new Error("error in database")
//     }
// }

module.exports = { authenticate, 
    getUsers, 
    getEmail,
    getMovie,
    getMoviesByUserId,
    getUsersByMovieId,
    createUser, 
    // deleteUser, 
    // updateUsername, 
    insertUserMovies, 
    };