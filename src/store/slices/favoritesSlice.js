import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    movies: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      const movie = action.payload;
      const exists = state.movies.find((m) => m.id === movie.id);
      if (!exists) {
        state.movies.push(movie);
      }
    },
    removeFavorite: (state, action) => {
      const movieId = action.payload;
      state.movies = state.movies.filter((m) => m.id !== movieId);
    },
    toggleFavorite: (state, action) => {
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

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
