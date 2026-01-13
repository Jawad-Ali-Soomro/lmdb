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
    <div className="h-[100vh] w-full relative">
      <img
        className="h-full w-full"
        src={`${import.meta.env.VITE_IMG_URL}/${movie.backdrop_path}`}
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/60 to-transparent" />


      <div className="flex absolute z-10 gap-10 bottom-20 items-end left-20 text-white">
        <img
          className="w-[400px] shadow-lg border-white rounded-[20px]"
          src={`${import.meta.env.VITE_IMG_URL}/${movie.poster_path}`}
          alt=""
        />

        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-black">{movie.original_title}</h1>

          <p className="max-w-2xl text-justify font-bold">
            {movie.overview?.substring(0, 250)}...
          </p>

          <div className="flex gap-2">
            <div className="flex w-[100px] items-center justify-between font-bold rounded-full px-5 py-3 bg-white text-black">
              <HiMiniLanguage />
              <span>{movie.original_language}</span>
            </div>

            <div className="flex w-[100px] items-center justify-between font-bold rounded-full px-5 py-3 bg-white text-black">
              <HiStar />
              <span>{Math.round(movie.vote_average)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePlayTrailer}
              className="border-2 w-[200px] cursor-pointer group h-[60px] rounded-full flex font-bold justify-between items-center px-10
                       hover:bg-white hover:text-black transition-all"
            >
              <HiPlay />
              Watch Trailer
            </button>
            <button 
              onClick={handleSaveForLater}
              className={`w-[200px] cursor-pointer group h-[60px] rounded-full flex font-bold justify-between items-center px-10
                        transition-all ${
                          isInWatchlist
                            ? "bg-blue-500 text-white border-2 border-blue-500"
                            : "bg-white text-black hover:bg-blue-500 hover:text-white"
                        }`}
            >
              <HiBookmark />
              {isInWatchlist ? "In Watchlist" : "Save For Later"}
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
