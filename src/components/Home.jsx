import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getNowPlayingMovies, getMovieVideos } from "../utils/tmdb";
import { HiBookmark, HiMiniLanguage, HiPlay, HiStar } from "react-icons/hi2";
import VideoModal from "./VideoModal";
import { toggleWatchlist } from "../store/slices/watchlistSlice";

const Home = () => {
  const [movie, setMovie] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.movies);
  
  const isInWatchlist = movie && watchlist.some((m) => m.id === movie.id);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getNowPlayingMovies();
        const results = data.results;

        if (results?.length) {
          const randomIndex = Math.floor(Math.random() * results.length);
          setMovie(results[randomIndex]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  const handlePlayTrailer = async () => {
    if (!movie?.id) return;
    try {
      const videos = await getMovieVideos(movie.id);
      // Prioritize Trailer, then Teaser, then Clip
      const order = { Trailer: 1, Teaser: 2, Clip: 3 };
      const sortedVideos = videos
        .filter((v) => v.site === "YouTube")
        .sort((a, b) => (order[a.type] || 99) - (order[b.type] || 99));
      
      if (sortedVideos.length > 0) {
        setActiveVideo(sortedVideos[0].key);
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
    }
  };

  const handleSaveForLater = () => {
    if (movie?.id) {
      dispatch(toggleWatchlist({
        id: movie.id,
        title: movie.title || movie.original_title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      }));
    }
  };

  if (!movie) return null;

  return (
    <div className="h-[70vh] sm:h-[80vh] md:h-[100vh] w-full relative">
      <img
        className="h-full w-full object-cover"
        src={`${import.meta.env.VITE_IMG_URL}/${movie.backdrop_path}`}
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/60 to-transparent" />


      <div className="flex flex-col sm:flex-row absolute z-10 gap-4 sm:gap-6 md:gap-10 bottom-4 sm:bottom-8 md:bottom-20 left-4 sm:left-8 md:left-20 right-4 sm:right-8 md:right-auto items-start sm:items-end text-white">
        <img
          className="w-[120px] sm:w-[180px] md:w-[250px] lg:w-[400px] shadow-lg border-white rounded-lg sm:rounded-xl md:rounded-[20px] flex-shrink-0"
          src={`${import.meta.env.VITE_IMG_URL}/${movie.poster_path}`}
          alt=""
        />

        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">{movie.original_title}</h1>

          <p className="text-xs sm:text-sm md:text-base max-w-2xl text-justify font-bold line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
            {movie.overview?.substring(0, 250)}...
          </p>

          <div className="flex gap-2 flex-wrap">
            <div className="flex w-[80px] sm:w-[90px] md:w-[100px] items-center justify-between font-bold rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-white text-black text-xs sm:text-sm">
              <HiMiniLanguage className="text-sm sm:text-base" />
              <span>{movie.original_language}</span>
            </div>

            <div className="flex w-[80px] sm:w-[90px] md:w-[100px] items-center justify-between font-bold rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-white text-black text-xs sm:text-sm">
              <HiStar className="text-sm sm:text-base" />
              <span>{Math.round(movie.vote_average)}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={handlePlayTrailer}
              className="border-2 w-full sm:w-[180px] md:w-[200px] cursor-pointer group h-[50px] sm:h-[55px] md:h-[60px] rounded-full flex font-bold justify-between items-center px-6 sm:px-8 md:px-10
                       hover:bg-white hover:text-black transition-all text-sm sm:text-base"
            >
              <HiPlay />
              <span className="hidden sm:inline">Watch Trailer</span>
              <span className="sm:hidden">Trailer</span>
            </button>
            <button 
              onClick={handleSaveForLater}
              className={`w-full sm:w-[180px] md:w-[200px] cursor-pointer group h-[50px] sm:h-[55px] md:h-[60px] rounded-full flex font-bold justify-between items-center px-6 sm:px-8 md:px-10
                        transition-all text-sm sm:text-base ${
                          isInWatchlist
                            ? "bg-blue-500 text-white border-2 border-blue-500"
                            : "bg-white text-black hover:bg-blue-500 hover:text-white"
                        }`}
            >
              <HiBookmark />
              <span className="hidden sm:inline">{isInWatchlist ? "In Watchlist" : "Save For Later"}</span>
              <span className="sm:hidden">{isInWatchlist ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      <VideoModal
        videoKey={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};

export default Home;
