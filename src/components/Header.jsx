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
            className={`w-full h-25 fixed top-0 z-50 flex items-center justify-between px-20 gap-20
        transition-all duration-300
        ${scrolled ? "bg-black shadow-md text-white" : "bg-transparent text-white"}
      `}
        >
            <div className="flex gap-10 items-center">
                <Link to="/" className="flex gap-2 items-center justify-center border-2 p-1 rounded-full pr-5">
                    <div
                        className="font-bold text-xl flex items-center justify-center
                   w-[40px] h-[40px] rounded-full bg-white text-black"
                    >
                        <BsPlay />
                    </div>
                    <span className="font-black text-xl">LMDB•</span>
                </Link>
                <div className="flex gap-5 uppercase font-bold">
                    <Link 
                        to="/explore" 
                        className={`hover:text-white/80 transition-colors ${
                            location.pathname === "/explore" && !location.search ? "text-white" : "text-white/70"
                        }`}
                    >
                        Movies
                    </Link>
                    <Link 
                        to="/explore?type=trending" 
                        className={`hover:text-white/80 transition-colors ${
                            location.search.includes("type=trending") ? "text-white" : "text-white/70"
                        }`}
                    >
                        Trending
                    </Link>
                    <Link 
                        to="/explore?type=top-rated" 
                        className={`hover:text-white/80 transition-colors ${
                            location.search.includes("type=top-rated") ? "text-white" : "text-white/70"
                        }`}
                    >
                        Top Rated
                    </Link>
                    <Link 
                        to="/explore?type=popular" 
                        className={`hover:text-white/80 transition-colors ${
                            location.search.includes("type=popular") ? "text-white" : "text-white/70"
                        }`}
                    >
                        Popular
                    </Link>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <form onSubmit={handleSearch} className="flex gap-2 h-12 relative items-center justify-center px-4 rounded-full bg-white text-black uppercase">
                    <BiSearch />
                    <input
                        type="text"
                        className="outline-none bg-transparent"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder=""
                    />

                    {!hideLabel && (
                        <label className="absolute left-11 text-sm font-bold text-gray-600 pointer-events-none">
                            ENTER KEYWORD
                        </label>
                    )}
                </form>

                {/* Favorites Icon */}
                <div className="relative">
                    <button
                        onClick={() => navigate("/explore?type=favorites")}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white
                                 transition-all border border-white/20 backdrop-blur-sm hover:scale-105"
                        title="Favorites"
                    >
                        <HiHeart className="text-xl" />
                    </button>
                    {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {favorites.length}
                        </span>
                    )}
                </div>

                {/* Watchlist Icon */}
                <div className="relative">
                    <button
                        onClick={() => navigate("/explore?type=watchlist")}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white
                                 transition-all border border-white/20 backdrop-blur-sm hover:scale-105"
                        title="Watchlist"
                    >
                        <HiBookmark className="text-xl" />
                    </button>
                    {watchlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {watchlist.length}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
