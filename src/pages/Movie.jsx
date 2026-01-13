import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getMovieCasts, getMovieDetails, getMovieRecommendations, getMovieVideos } from "../utils/tmdb"
import { TbTag } from "react-icons/tb"
import { FiBookmark, FiHeart, FiPlay } from "react-icons/fi"
import { HiBookmark, HiHeart } from "react-icons/hi2"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import VideoModal from "../components/VideoModal";
import { toggleFavorite } from "../store/slices/favoritesSlice";
import { toggleWatchlist } from "../store/slices/watchlistSlice";


const Movie = () => {
    const [details, setDetails] = useState({})
    const [creadits, setCredits] = useState({})
    const [recommendations, setRecommendations] = useState({})
    const [activeVideo, setActiveVideo] = useState(null)
    const { movieId } = useParams()
    const dispatch = useDispatch()
    
    const favorites = useSelector((state) => state.favorites.movies)
    const watchlist = useSelector((state) => state.watchlist.movies)
    
    const isFavorite = favorites.some((m) => m.id === details.id)
    const isInWatchlist = watchlist.some((m) => m.id === details.id)
      useEffect(() => {
  const fetchAll = async () => {
    try {
      const [d, c, r] = await Promise.all([
        getMovieDetails(movieId),
        getMovieCasts(movieId),
        getMovieRecommendations(movieId),
      ])
      setDetails(d)
      setCredits(c)
      setRecommendations(r)
    } catch (e) {
      console.error(e)
    }
  }

  fetchAll()
}, [movieId])

    const navigate = useNavigate()

    const handlePlayTrailer = async () => {
        try {
            const videos = await getMovieVideos(movieId);
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

    const handleToggleFavorite = () => {
        if (details.id) {
            dispatch(toggleFavorite({
                id: details.id,
                title: details.title || details.original_title,
                poster_path: details.poster_path,
                release_date: details.release_date,
                vote_average: details.vote_average,
            }));
        }
    };

    const handleToggleWatchlist = () => {
        if (details.id) {
            dispatch(toggleWatchlist({
                id: details.id,
                title: details.title || details.original_title,
                poster_path: details.poster_path,
                release_date: details.release_date,
                vote_average: details.vote_average,
            }));
        }
    };
    return (
        <div className="flex flex-col" key={movieId}>
            <div className="flex justify-start items-end h-[70vh] sm:h-[80vh] md:h-[100vh] relative">
                <img
                    className="h-full w-full object-cover"
                    src={`${import.meta.env.VITE_IMG_URL}/${details.backdrop_path}`}
                    alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/60 to-transparent" />
                <div className="absolute z-10 bottom-4 sm:bottom-8 md:bottom-20 left-4 sm:left-8 md:left-20 right-4 sm:right-8 md:right-auto flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 md:gap-10">
                    <img 
                        className="w-[120px] sm:w-[180px] md:w-[250px] lg:w-[400px] rounded-lg sm:rounded-xl md:rounded-[20px] shadow-2xl flex-shrink-0" 
                        src={`${import.meta.env.VITE_IMG_URL}/${details.poster_path}`} 
                        alt="" 
                    />
                    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 text-white flex-1">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black">{details.original_title}</h1>
                        {details.tagline && (
                            <h2 className="text-sm sm:text-base md:text-lg font-bold">{details.tagline}</h2>
                        )}
                        <div className="flex gap-2">
                            <button 
                                onClick={handlePlayTrailer}
                                className="flex items-center justify-center bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform text-sm sm:text-base"
                            >
                                <FiPlay />
                            </button>
                            <button 
                                onClick={handleToggleWatchlist}
                                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform text-sm sm:text-base ${
                                    isInWatchlist 
                                        ? "bg-blue-500 text-white" 
                                        : "bg-white text-black"
                                }`}
                            >
                                {isInWatchlist ? <HiBookmark /> : <FiBookmark />}
                            </button>
                            <button 
                                onClick={handleToggleFavorite}
                                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform text-sm sm:text-base ${
                                    isFavorite 
                                        ? "bg-red-500 text-white" 
                                        : "bg-white text-black"
                                }`}
                            >
                                {isFavorite ? <HiHeart /> : <FiHeart />}
                            </button>
                        </div>
                       
                        <p className="text-xs sm:text-sm md:text-base max-w-3xl text-justify line-clamp-3 sm:line-clamp-4 md:line-clamp-none">{details.overview}</p>
                        <div className="flex gap-2 sm:gap-3 md:gap-5 flex-wrap">
                            {
                                details.genres?.map((genre) => {
                                    return <div key={genre.id} className="flex items-center gap-2 sm:gap-3 md:gap-5 px-3 sm:px-4 md:px-5 pr-6 sm:pr-8 md:pr-10 py-2 sm:py-2.5 md:py-3 bg-[rgba(255,255,255,.2)] font-bold rounded-full text-xs sm:text-sm md:text-base">
                                        <TbTag />{
                                            genre.name
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-8 md:p-12 lg:p-20">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 md:mb-10 text-white">Cast & Actors</h1>

                <div className="relative">
                    {/* Left Button */}
                    <button
                        className="cast-prev absolute -left-4 sm:-left-8 md:-left-12 top-1/2 -translate-y-1/2 z-20
      bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
      justify-center shadow-lg hover:scale-110 transition"
                    >
                        ❮
                    </button>

                    {/* Right Button */}
                    <button
                        className="cast-next absolute -right-4 sm:-right-8 md:-right-12 top-1/2 -translate-y-1/2 z-20
      bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
      justify-center shadow-lg hover:scale-110 transition"
                    >
                        ❯
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 3, spaceBetween: 15 },
                            768: { slidesPerView: 4, spaceBetween: 15 },
                            1024: { slidesPerView: 5, spaceBetween: 20 },
                            1280: { slidesPerView: 6, spaceBetween: 20 },
                            1536: { slidesPerView: 7, spaceBetween: 20 },
                        }}
                        grabCursor
                        navigation={{
                            prevEl: ".cast-prev",
                            nextEl: ".cast-next",
                        }}
                    >
                        {creadits?.cast
                            ?.filter(c => c.profile_path)
                            .map((cast) => (
                                <SwiperSlide key={cast.id}>
                                    <div 
                                        className="flex flex-col items-center gap-3 cursor-pointer group"
                                        onClick={() => navigate(`/actor/${cast.id}`)}
                                    >
                                        <div className="relative overflow-hidden rounded-full group-hover:scale-105 transition-transform duration-300">
                                            <img
                                                className="w-full aspect-square object-cover rounded-full"
                                                src={`${import.meta.env.VITE_IMG_URL}/${cast.profile_path}`}
                                                alt={cast.name}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <p className="font-black text-center group-hover:text-white/80 transition-colors text-xs sm:text-sm md:text-base line-clamp-1">{cast.name}</p>
                                        <span className="text-xs sm:text-sm font-bold text-gray-400 text-center line-clamp-1">
                                            {cast.character}
                                        </span>
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            </div>


                        <div className="p-4 sm:p-8 md:p-12 lg:p-20">
                            {
                                recommendations?.results?.length >= 1 && 
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 md:mb-10 text-white">Recommendations</h1>
                            }

                <div className="relative">
                    {/* Left Button */}
                    <button
                        className="recom-prev absolute -left-4 sm:-left-8 md:-left-12 top-1/2 -translate-y-1/2 z-20
      bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
      justify-center shadow-lg hover:scale-110 transition"
                    >
                        ❮
                    </button>

                    {/* Right Button */}
                    <button
                        className="recom-next absolute -right-4 sm:-right-8 md:-right-12 top-1/2 -translate-y-1/2 z-20
      bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
      justify-center shadow-lg hover:scale-110 transition"
                    >
                        ❯
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 3, spaceBetween: 15 },
                            768: { slidesPerView: 4, spaceBetween: 15 },
                            1024: { slidesPerView: 5, spaceBetween: 20 },
                        }}
                        grabCursor
                        navigation={{
                            prevEl: ".recom-prev",
                            nextEl: ".recom-next",
                        }}
                    >
                        {recommendations?.results?.map((recommendation) => (
                                <SwiperSlide key={recommendation.id}>
                                    <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => navigate(`/movie/${recommendation.id}`)}>
                                        <img
                                            className="w-full aspect-[2/3] object-cover rounded-xl"
                                            src={`${import.meta.env.VITE_IMG_URL}/${recommendation.poster_path}`}
                                            alt={recommendation.name}
                                        />
                                       
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            </div>

            <VideoModal
                videoKey={activeVideo}
                onClose={() => setActiveVideo(null)}
            />
        </div>
    )
}

export default Movie