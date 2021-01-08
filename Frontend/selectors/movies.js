
function selectMoviesAsArray(state) {
    return Object.values(state.movies.byId);
}

export {
    selectMoviesAsArray
}