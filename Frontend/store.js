import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movies';

export default configureStore({
  reducer: {
    movies: movieReducer,
  },
});

// users store
    // user
        // movieIds
// movies store

// selector functions
    // selectMoviesForUser these are movies the users like - do not clone liked movies into users store
        // user.movieIds.reduce((acc, movieId) => {
        //     return {...acc, [movieId]: movies[movieId]} // this is the movies object from the movie store
        // }, {});
        // for loop user.movieIds
            // moviesStore.movies[movieId]