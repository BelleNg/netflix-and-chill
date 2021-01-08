import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
    name: 'user',
    initalState : {
        friends: {},
    },
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload.friends
        }
    }
})

export const { setMovies } = slice.actions;

export const getFriends = async dispatch => {
    const response = await axios('http://localhost:3000/users');
    dispatch(setFriends({friends: response.data.users}));
}

export default slice.reducer;