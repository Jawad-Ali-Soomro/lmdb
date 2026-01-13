import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./slices/favoritesSlice";
import watchlistReducer from "./slices/watchlistSlice";

// Load from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("movieAppState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      favorites: state.favorites,
      watchlist: state.watchlist,
    });
    localStorage.setItem("movieAppState", serializedState);
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    watchlist: watchlistReducer,
  },
  preloadedState,
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
