import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import { getMovieVideos, getNowPlayingMovies, getMovieDetails } from "../utils/tmdb";
import VideoModal from "./VideoModal";

const TrailerSwiper = () => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [movieName, setMovieName] = useState("");
  const [movieId, setMovieId] = useState(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        // Fetch movies and select a random one
        const data = await getNowPlayingMovies();
        const results = data.results;

        if (results?.length) {
          const randomIndex = Math.floor(Math.random() * results.length);
          const randomMovie = results[randomIndex];
          const selectedMovieId = randomMovie.id;
          
          setMovieId(selectedMovieId);

          // Get movie details for the name
          const movieDetails = await getMovieDetails(selectedMovieId);
          setMovieName(movieDetails.title || movieDetails.original_title);

          // Get videos for the random movie
          const videosData = await getMovieVideos(selectedMovieId);
          const order = { Trailer: 1, Teaser: 2, Clip: 3 };
          const filteredVideos = videosData
            .filter((v) => v.site === "YouTube")
            .sort(
              (a, b) =>
                (order[a.type] || 99) - (order[b.type] || 99)
            );
          
          setVideos(filteredVideos);
        }
      } catch (err) {
        console.error("Error fetching random movie:", err);
      }
    };

    fetchRandomMovie();
  }, []);

  if (!videos.length) return null;

  return (
    <section className="p-4 sm:p-8 md:p-12 lg:p-20 relative">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
          Trailers & Videos
        </h2>
        {movieName && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-black">
            {movieName}
          </p>
        )}
      </div>

      {/* Left Button */}
      <button
        className="swiper-prev absolute left-2 sm:left-4 md:left-7 top-1/2 cursor-pointer -translate-y-1/2 z-20
               bg-white/95 backdrop-blur-sm text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
               justify-center shadow-2xl hover:scale-110 hover:bg-white transition-all
               hover:shadow-3xl border border-white/20"
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        className="swiper-next absolute right-2 sm:right-4 md:right-7 top-1/2 cursor-pointer -translate-y-1/2 z-20
               bg-white/95 backdrop-blur-sm text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
               justify-center shadow-2xl hover:scale-110 hover:bg-white transition-all
               hover:shadow-3xl border border-white/20"
      >
        ❯
      </button>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={videos.length === 1 ? 1 : 1.5}
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
      
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div
              onClick={() => setActiveVideo(video.key)}
              className="cursor-pointer group overflow-hidden"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-black relative
                            shadow-2xl group-hover:shadow-3xl transition-all duration-300
                             border border-white/10 overflow-hidden bg-white/10">
                <img
                  src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                  alt={video.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full w-16 h-16 flex items-center
                                justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white
                                transition-all duration-300 border border-white/20">
                    <span className="text-2xl ml-1 text-black">▶</span>
                  </div>
                </div>

                {/* Video title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* <p className="text-white text-sm font-semibold truncate">{video.name}</p> */}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <VideoModal
        videoKey={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
};

export default TrailerSwiper;
