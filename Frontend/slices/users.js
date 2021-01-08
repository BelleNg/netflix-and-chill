import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
    name: 'user',
    initalState : {
        friends: {},
        movies: {},
    },
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload.friends
        },
        setMovies: (state, action) => {
            state.movies = action.payload.movies
        }
    }
})

export const { setMovies, setFriends } = slice.actions;

export const getFriends = async dispatch => {
    // todo - change endpoint to get users by movies
    const response = await axios('http://localhost:3000/users');
    dispatch(setFriends({friends: response.data.users}));
}
export const loadUserMovies = async dispatch => {
    // todo - change endpoint to take in userId param
    const response = await axios('http://localhost:3000/users/1/movies');
    dispatch(setMovies({movies: response.data.movies}));
}

export default slice.reducer;