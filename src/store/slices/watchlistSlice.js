import { createSlice } from "@reduxjs/toolkit";

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    movies: [],
  },
  reducers: {
    addToWatchlist: (state, action) => {
      const movie = action.payload;
      const exists = state.movies.find((m) => m.id === movie.id);
      if (!exists) {
        state.movies.push(movie);
      }
    },
    removeFromWatchlist: (state, action) => {
      const movieId = action.payload;
      state.movies = state.movies.filter((m) => m.id !== movieId);
    },
    toggleWatchlist: (state, action) => {
      const movie = action.payload;
      const exists = state.movies.find((m) => m.id === movie.id);
      if (exists) {
        state.movies = state.movies.filter((m) => m.id !== movie.id);
      } else {
        state.movies.push(movie);
      }
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
