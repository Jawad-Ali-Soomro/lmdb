import { HiPlay, HiPlayCircle } from "react-icons/hi2";
import { getNowPlayingMovies, getPopularMovies } from "../utils/tmdb";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const Popular = () => {
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate()
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getPopularMovies();
        setMovies(data.results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  if (!movies.length) return null;



  return (
    <div className="h-[100vh] p-20 flex flex-col justify-center">
      {/* Header */}
      <div className="flex gap-5 w-full items-center justify-between">
        <div className="flex gap-5 items-center">
          <div className="p-3 border-3 rounded-full">
            <HiPlay />
          </div>
          <h1 className="text-3xl font-black">Popular Movies</h1>
        </div>

        <button className="w-[200px] bg-white text-black font-bold gap-5 flex items-center justify-center h-[50px] rounded-full">
          <HiPlayCircle />
          Watch All
        </button>
      </div>

      {/* Swiper */}
    <div className="w-full mt-16 relative">
  {/* Left Button */}
  <button
    className="swiper-prev absolute -left-15 top-1/2 cursor-pointer -translate-y-1/2 z-20
               bg-white text-black w-10 h-10 rounded-full flex items-center
               justify-center shadow-lg hover:scale-110 transition"
  >
    ❮
  </button>

  {/* Right Button */}
  <button
    className="swiper-next absolute -right-15 top-1/2 cursor-pointer -translate-y-1/2 z-20
               bg-white text-black w-10 h-10 rounded-full flex items-center
               justify-center shadow-lg hover:scale-110 transition"
  >
    ❯
  </button>

  <Swiper
    modules={[Navigation]}
    spaceBetween={20}
    slidesPerView={5}
    grabCursor
    navigation={{
      prevEl: ".swiper-prev",
      nextEl: ".swiper-next",
    }}
  >
    {movies.map((movie) => (
      <SwiperSlide key={movie.id}>
        <div className="rounded-xl overflow-hidden cursor-pointer">
          <img
            src={`${import.meta.env.VITE_IMG_URL}/${movie.poster_path}`}
            alt=""
            className="w-full h-full object-cover"
            onClick={() => navigate(`/movie/${movie?.id}`)}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

    </div>
  );
};

export default Popular;
