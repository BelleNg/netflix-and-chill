import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
    name: 'movies',
    initialState: {
        byId: {}
    },
    reducers: {
        setMovies: (state, action) => {
            state.byId = action.payload.movies
        }
    }
})

export const { setMovies } = slice.actions;

export const loadMovies = async dispatch => {
    const response = await axios('http://localhost:3000/movies');
    dispatch(setMovies({ movies: response.data.movies }));
}

export default slice.reducer;