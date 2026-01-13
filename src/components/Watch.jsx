import { HiPlay, HiPlayCircle } from "react-icons/hi2";
import { getNowPlayingMovies } from "../utils/tmdb";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const Watch = () => {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getNowPlayingMovies();
                setMovies(data.results);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMovies();
    }, []);

    if (!movies.length) return null;

    return (
        <div className="min-h-[70vh] sm:min-h-[80vh] md:h-[100vh] p-4 sm:p-8 md:p-12 lg:p-20 flex flex-col justify-center">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full items-start sm:items-center justify-between">
                <div className="flex gap-3 sm:gap-5 items-center">
                    <div className="p-2 sm:p-3 border-3 rounded-full">
                        <HiPlay className="text-base sm:text-lg md:text-xl" />
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Trending Now</h1>
                </div>

                <button className="w-full sm:w-auto sm:min-w-[180px] md:w-[200px] bg-white text-black font-bold gap-3 sm:gap-5 flex items-center justify-center h-[45px] sm:h-[50px] rounded-full text-sm sm:text-base px-4 sm:px-6">
                    <HiPlayCircle />
                    <span className="hidden sm:inline">Watch All</span>
                    <span className="sm:hidden">All</span>
                </button>
            </div>

            {/* Swiper */}
            <div className="w-full mt-8 sm:mt-12 md:mt-16 relative">
                {/* Left Button */}
                <button
                    className="swiper-prev absolute -left-4 sm:-left-8 md:-left-15 top-1/2 cursor-pointer -translate-y-1/2 z-20
               bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center
               justify-center shadow-lg hover:scale-110 transition"
                >
                    ❮
                </button>

                {/* Right Button */}
                <button
                    className="swiper-next absolute -right-4 sm:-right-8 md:-right-15 top-1/2 cursor-pointer -translate-y-1/2 z-20
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
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
};

export default Watch;
