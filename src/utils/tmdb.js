import axios from "axios";

const tmdb = axios.create({
  baseURL: import.meta.env.VITE_URL_TMDB,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN_TMDB}`,
  },
});

export const getNowPlayingMovies = async (page = 1, language = "en-US") => {
  const res = await tmdb.get("/movie/now_playing", {
    params: { page, language },
  });
  return res.data;
};

export const getPopularMovies = async (page = 1, language = "en-US") => {
  const res = await tmdb.get("/movie/popular", {
    params: { page, language },
  });
  return res.data;
};

export const getTopRatedMovies = async (page = 1, language = "en-US") => {
  const res = await tmdb.get("/movie/top_rated", {
    params: { page, language },
  });
  return res.data;
};

export const getTrendingMovies = async (page = 1, language = "en-US") => {
  const res = await tmdb.get("/trending/movie/day", {
    params: { page, language },
  });
  return res.data;
};



export const getMovieDetails = async (movieId) => {
    const res = await tmdb.get(`/movie/${movieId}`)
    return res.data
}

export const getMovieCasts = async (movieId) => {
    const res = await tmdb.get(`/movie/${movieId}/credits`)
    return res.data
}

export const getMovieRecommendations = async (movieId, page = 1, language = "en-US") => {
    const res = await tmdb.get(`/movie/${movieId}/recommendations`, {
    params: { page, language },
  })
    return res.data
}

export const getSeriesCredits = async (seriesId) => {
  const res = await tmdb.get(`/tv/${seriesId}/credits`);
  return res.data;
};

export const getSeriesRecommendations = async (seriesId, page = 1, language = "en-US") => {
  const res = await tmdb.get(`/tv/${seriesId}/recommendations`, {
    params: { page, language },
  });
  return res.data;
};

export const getSeasonDetails = async (seriesId, seasonNumber) => {
  const res = await tmdb.get(`/tv/${seriesId}/season/${seasonNumber}`);
  return res.data;
};

export const getMovieVideos = async (movieId, language = "en-US") => {
  const res = await tmdb.get(`/movie/${movieId}/videos`, {
    params: { language },
  });

  // TMDB app behavior: YouTube only, ordered
  return res.data.results.filter(
    (video) => video.site === "YouTube"
  );
};


export const getYoutubeEmbedUrl = (key) =>
  `https://www.youtube.com/embed/${key}`;

export const getGenres = async (language = "en-US") => {
  const res = await tmdb.get("/genre/movie/list", {
    params: { language },
  });
  return res.data;
};

export const discoverMovies = async (params = {}) => {
  const {
    page = 1,
    language = "en-US",
    sortBy = "popularity.desc",
    withGenres = "",
    year = "",
    voteAverageGte = "",
  } = params;

  const queryParams = {
    page,
    language,
    sort_by: sortBy,
  };

  if (withGenres) queryParams.with_genres = withGenres;
  if (year) queryParams.year = year;
  if (voteAverageGte) queryParams["vote_average.gte"] = voteAverageGte;

  const res = await tmdb.get("/discover/movie", {
    params: queryParams,
  });
  return res.data;
};

export const getPersonDetails = async (personId) => {
  const res = await tmdb.get(`/person/${personId}`);
  return res.data;
};

export const getPersonMovies = async (personId) => {
  const res = await tmdb.get(`/person/${personId}/movie_credits`);
  return res.data;
};

export const searchMovies = async (query, page = 1, language = "en-US") => {
  const res = await tmdb.get("/search/movie", {
    params: { query, page, language },
  });
  return res.data;
};
