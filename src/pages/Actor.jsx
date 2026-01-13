import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonDetails, getPersonMovies } from "../utils/tmdb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaLocationPin } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { GiFlame } from "react-icons/gi";

const Actor = () => {
  const { actorId } = useParams();
  const navigate = useNavigate();
  const [actorDetails, setActorDetails] = useState({});
  const [actorMovies, setActorMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActorData = async () => {
      setLoading(true);
      try {
        const [details, movies] = await Promise.all([
          getPersonDetails(actorId),
          getPersonMovies(actorId),
        ]);
        setActorDetails(details);
        // Sort movies by popularity/release date
        const sortedMovies = movies.cast
          ?.filter((movie) => movie.poster_path)
          .sort((a, b) => {
            // Sort by release date (newest first), then by popularity
            if (b.release_date && a.release_date) {
              return new Date(b.release_date) - new Date(a.release_date);
            }
            return (b.popularity || 0) - (a.popularity || 0);
          });
        setActorMovies(sortedMovies || []);
      } catch (err) {
        console.error("Error fetching actor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
  }, [actorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 sm:pb-16 md:pb-20">
      {/* Hero Section */}
      <div className="relative h-[70vh] sm:h-[80vh] md:h-[100vh] flex items-end">
        {actorDetails.profile_path && (
          <>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={`${import.meta.env.VITE_IMG_URL}/${actorDetails.profile_path}`}
              alt={actorDetails.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          </>
        )}
        
        <div className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-20 pb-8 sm:pb-12 md:pb-20 flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 items-center sm:items-end">
          {actorDetails.profile_path && (
            <img
              className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] object-cover rounded-full shadow-2xl flex-shrink-0"
              src={`${import.meta.env.VITE_IMG_URL}/${actorDetails.profile_path}`}
              alt={actorDetails.name}
            />
          )}
          
          <div className="flex-1 text-white w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">{actorDetails.name}</h1>
            
            {actorDetails.birthday && (
              <div className="mb-3 sm:mb-4">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl flex items-center gap-2 text-white/80 flex-wrap">
                <MdLocationPin />
                  {new Date(actorDetails.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {actorDetails.place_of_birth && ` in ${actorDetails.place_of_birth}`}
                </p>
              </div>
            )}

            {actorDetails.biography && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-2 sm:mb-3">Biography</h2>
                <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl text-justify line-clamp-4 sm:line-clamp-5 md:line-clamp-none">
                  {actorDetails.biography.length > 600
                    ? `${actorDetails.biography.substring(0, 600)}...`
                    : actorDetails.biography}
                </p>
              </div>
            )}

            <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap">
              {actorDetails.known_for_department && (
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-full font-bold text-xs sm:text-sm md:text-base">
                  {actorDetails.known_for_department}
                </div>
              )}
              {actorDetails.popularity && (
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 bg-white/20 rounded-full font-bold text-xs sm:text-sm md:text-base">
                  <GiFlame color="yellow" /> {Math.round(actorDetails.popularity)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      {actorMovies.length > 0 && (
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 sm:mb-8 md:mb-10">
            Movies 
          </h2>

          <div className="relative">
            {/* Left Button */}
            <button
              className="actor-movies-prev absolute -left-4 sm:-left-8 md:-left-12 top-1/2 -translate-y-1/2 z-20
                bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
                justify-center shadow-lg hover:scale-110 transition"
            >
              ❮
            </button>

            {/* Right Button */}
            <button
              className="actor-movies-next absolute -right-4 sm:-right-8 md:-right-12 top-1/2 -translate-y-1/2 z-20
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
                prevEl: ".actor-movies-prev",
                nextEl: ".actor-movies-next",
              }}
           
            >
              {actorMovies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <div
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden
                                  bg-black shadow-2xl group-hover:shadow-3xl transition-all duration-300
                                  border border-white/10">
                      <img
                        src={`${import.meta.env.VITE_IMG_URL}/${movie.poster_path}`}
                        alt={movie.title || movie.original_title}
                        className="w-full h-full object-cover transition-transform duration-300
                                 "
                      />

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Movie info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300">
                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                          {movie.title || movie.original_title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                          {movie.release_date && (
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                          )}
                          {movie.vote_average && (
                            <>
                              <span>•</span>
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                       
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actor;
