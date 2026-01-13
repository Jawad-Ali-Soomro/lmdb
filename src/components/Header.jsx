import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import { BsPlay } from "react-icons/bs";
import { HiBookmark, HiHeart } from "react-icons/hi2";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [value, setValue] = useState("")
    const [focused, setFocused] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const hideLabel = focused || value.length > 0
    
    const favorites = useSelector((state) => state.favorites.movies);
    const watchlist = useSelector((state) => state.watchlist.movies);

    const handleSearch = (e) => {
        e.preventDefault();
        if (value.trim()) {
            navigate(`/explore?search=${encodeURIComponent(value.trim())}`);
            setValue("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    };

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className={`w-full h-auto min-h-[60px] sm:min-h-[70px] md:h-25 fixed top-0 z-50 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 gap-3 sm:gap-5 md:gap-10 lg:gap-20 py-3 sm:py-4
        transition-all duration-300
        ${scrolled ? "bg-black shadow-md text-white" : "bg-transparent text-white"}
      `}
        >
            <div className="flex gap-4 sm:gap-6 md:gap-10 items-center w-full sm:w-auto justify-between sm:justify-start">
                <Link to="/" className="flex gap-1 sm:gap-2 items-center justify-center border-2 p-1 rounded-full pr-3 sm:pr-5">
                    <div
                        className="font-bold text-base sm:text-lg md:text-xl flex items-center justify-center
                   w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-white text-black"
                    >
                        <BsPlay />
                    </div>
                    <span className="font-black text-base sm:text-lg md:text-xl">LMDB•</span>
                </Link>
                <div className="flex gap-2 sm:gap-3 md:gap-5 uppercase font-bold text-xs sm:text-sm md:text-base">
                    <Link 
                        to="/explore" 
                        className={`hover:text-white/80 transition-colors whitespace-nowrap ${
                            location.pathname === "/explore" && !location.search ? "text-white" : "text-white/70"
                        }`}
                    >
                        Movies
                    </Link>
                    <Link 
                        to="/explore?type=trending" 
                        className={`hover:text-white/80 transition-colors whitespace-nowrap ${
                            location.search.includes("type=trending") ? "text-white" : "text-white/70"
                        }`}
                    >
                        Trending
                    </Link>
                    <Link 
                        to="/explore?type=top-rated" 
                        className={`hover:text-white/80 transition-colors whitespace-nowrap ${
                            location.search.includes("type=top-rated") ? "text-white" : "text-white/70"
                        }`}
                    >
                        Top Rated
                    </Link>
                    <Link 
                        to="/explore?type=popular" 
                        className={`hover:text-white/80 transition-colors whitespace-nowrap ${
                            location.search.includes("type=popular") ? "text-white" : "text-white/70"
                        }`}
                    >
                        Popular
                    </Link>
                </div>
            </div>

            <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
                <form onSubmit={handleSearch} className="flex gap-2 h-10 sm:h-12 relative items-center justify-center px-3 sm:px-4 rounded-full bg-white text-black uppercase flex-1 sm:flex-initial min-w-0">
                    <BiSearch className="text-base sm:text-lg flex-shrink-0" />
                    <input
                        type="text"
                        className="outline-none bg-transparent text-xs sm:text-sm md:text-base min-w-0 flex-1"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder=""
                    />

                    {!hideLabel && (
                        <label className="absolute left-9 sm:left-11 text-xs sm:text-sm font-bold text-gray-600 pointer-events-none whitespace-nowrap">
                            ENTER KEYWORD
                        </label>
                    )}
                </form>

                {/* Favorites Icon */}
                <div className="relative">
                    <button
                        onClick={() => navigate("/explore?type=favorites")}
                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white
                                 transition-all border border-white/20 backdrop-blur-sm hover:scale-105"
                        title="Favorites"
                    >
                        <HiHeart className="text-lg sm:text-xl" />
                    </button>
                    {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {favorites.length > 99 ? '99+' : favorites.length}
                        </span>
                    )}
                </div>

                {/* Watchlist Icon */}
                <div className="relative">
                    <button
                        onClick={() => navigate("/explore?type=watchlist")}
                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white
                                 transition-all border border-white/20 backdrop-blur-sm hover:scale-105"
                        title="Watchlist"
                    >
                        <HiBookmark className="text-lg sm:text-xl" />
                    </button>
                    {watchlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {watchlist.length > 99 ? '99+' : watchlist.length}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
