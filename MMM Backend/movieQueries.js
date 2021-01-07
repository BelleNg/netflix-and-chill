const Sequelize = require('sequelize');
const db = require('./database.js');
const { User, Movie, Genre, UserMovie } = require('./models');

//fetch movies from database
async function fetchMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`)
        const movies = await response.json();
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return movies.results
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

//insert movies to database
async function insertMovies(movies) {
    const list = movies.map( (movie) => {
        return {
            id: movie.id,
            title: movie.title,
            genre_ids: movie. genre_ids,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path
        }
    })

     try {
        Movie.bulkCreate(list, 
            { returning: ['title'] })
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

//populate database with movies
async function populateMovies(page) {
    try {
        const movies = await fetchMovies(page);
        await insertMovies(movies);

    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

module.exports = {
    populateMovies
};