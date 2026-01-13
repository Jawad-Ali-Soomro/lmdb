import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { discoverMovies, getGenres, searchMovies, getTopRatedMovies, getTrendingMovies, getPopularMovies } from "../utils/tmdb";
import { HiChevronLeft, HiChevronRight, HiFunnel, HiXMark, HiArrowLeft, HiXCircle } from "react-icons/hi2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { IoFilter } from "react-icons/io5";

const Explore = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  
  const favorites = useSelector((state) => state.favorites.movies);
  const watchlist = useSelector((state) => state.watchlist.movies);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [showFilters, setShowFilters] = useState(!searchQuery && !type);

  // Generate years from 2024 to 1950
  const years = Array.from({ length: 75 }, (_, i) => 2024 - i);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Reset to page 1 when search query or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, type]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        
        if (type === "favorites") {
          // Show favorites from Redux store
          setMovies(favorites);
          setTotalPages(1);
          setLoading(false);
          return;
        } else if (type === "watchlist") {
          // Show watchlist from Redux store
          setMovies(watchlist);
          setTotalPages(1);
          setLoading(false);
          return;
        } else if (searchQuery) {
          // Use search API when there's a search query
          data = await searchMovies(searchQuery, currentPage);
        } else if (type === "trending") {
          // Use trending API
          data = await getTrendingMovies(currentPage);
        } else if (type === "top-rated") {
          // Use top rated API
          data = await getTopRatedMovies(currentPage);
        } else if (type === "popular") {
          // Use popular API
          data = await getPopularMovies(currentPage);
        } else {
          // Use discover API with filters
          const params = {
            page: currentPage,
            sort_by: sortBy,
          };

          if (selectedGenre && selectedGenre !== "all") params.withGenres = selectedGenre;
          if (selectedYear && selectedYear !== "all") params.year = selectedYear;
          if (selectedRating && selectedRating !== "all") params.voteAverageGte = selectedRating;

          data = await discoverMovies(params);
        }
        
        setMovies(data.results || []);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB limits to 500 pages
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, selectedGenre, selectedYear, selectedRating, sortBy, searchQuery, type, favorites, watchlist]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSelectedGenre("all");
    setSelectedYear("all");
    setSelectedRating("all");
    setSortBy("popularity.desc");
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all
                   flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
      >
        <HiChevronLeft className="text-sm sm:text-base" />
        <span className="hidden sm:inline">Prev</span>
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-2 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-xs sm:text-sm"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="text-white/50 px-1 sm:px-2 text-xs sm:text-sm">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-4 py-2 rounded-full font-bold transition-all text-xs sm:text-sm ${
            currentPage === i
              ? "bg-white text-black"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="text-white/50 px-1 sm:px-2 text-xs sm:text-sm">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-2 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-xs sm:text-sm"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all
                   flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
      >
        <span className="hidden sm:inline">Next</span>
        <HiChevronRight className="text-sm sm:text-base" />
      </button>
    );

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 break-words">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : type === "trending" 
              ? "Trending Movies"
              : type === "top-rated"
              ? "Top Rated Movies"
              : type === "popular"
              ? "Popular Movies"
              : type === "favorites"
              ? "My Favorites"
              : type === "watchlist"
              ? "My Watchlist"
              : "Explore Movies"
            }
          </h1>
        </div>
        
        {/* Action Buttons - Right Side */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {(searchQuery || type) && (
            <button
              onClick={() => {
                navigate("/explore");
                setCurrentPage(1);
              }}
              className="px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold
                       transition-all border border-white/20 flex items-center gap-2
                       backdrop-blur-sm shadow-lg hover:scale-105 text-sm sm:text-base"
              title={searchQuery ? "Clear Search" : "View All Movies"}
            >
              <HiArrowLeft className="text-lg sm:text-xl" />
            </button>
          )}
          
          {(selectedGenre !== "all" || selectedYear !== "all" || selectedRating !== "all" || sortBy !== "popularity.desc") && 
           !searchQuery && !type && (
            <button
              onClick={clearFilters}
              className="px-3 sm:px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-white font-bold
                       transition-all border border-red-500/30 hover:border-red-500/50
                       backdrop-blur-sm shadow-lg hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
              title="Clear Filters"
            >
              <HiXCircle className="text-lg sm:text-xl" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Filters */}
        <aside className={`transition-all duration-500 ${
          showFilters && type !== "favorites" && type !== "watchlist" 
            ? "w-full lg:w-80 opacity-100 mb-6 lg:mb-0 lg:mr-10" 
            : "w-0 opacity-0 overflow-hidden"
        }`}>
          <div className="sticky top-20 sm:top-24 md:top-32 
                        rounded-2xl backdrop-blur-md shadow-2xl p-4 sm:p-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <IoFilter className="text-xl sm:text-2xl" />
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white
                         transition-all border border-white/20 lg:hidden"
              >
                <HiXMark className="text-lg sm:text-xl" />
              </button>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Genre Filter */}
              <div className="flex flex-col gap-3 relative group">
                <label className="text-white/90 text-sm font-black uppercase tracking-wider">Genre</label>
                <Select
                  value={selectedGenre}
                  onValueChange={(value) => {
                    setSelectedGenre(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div className="flex flex-col gap-3 relative group">
                <label className="text-white/90 text-sm font-black uppercase tracking-wider">Year</label>
                <Select
                  value={selectedYear}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="flex flex-col gap-3 relative group">
                <label className="text-white/90 text-sm font-black uppercase tracking-wider">Min Rating</label>
                <Select
                  value={selectedRating}
                  onValueChange={(value) => {
                    setSelectedRating(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="8">8+ ⭐</SelectItem>
                    <SelectItem value="7">7+ ⭐</SelectItem>
                    <SelectItem value="6">6+ ⭐</SelectItem>
                    <SelectItem value="5">5+ ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="flex flex-col gap-3 relative group">
                <label className="text-white/90 text-sm font-black uppercase tracking-wider">Sort By</label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity.desc">Popularity (High to Low)</SelectItem>
                    <SelectItem value="popularity.asc">Popularity (Low to High)</SelectItem>
                    <SelectItem value="vote_average.desc">Rating (High to Low)</SelectItem>
                    <SelectItem value="vote_average.asc">Rating (Low to High)</SelectItem>
                    <SelectItem value="release_date.desc">Release Date (Newest)</SelectItem>
                    <SelectItem value="release_date.asc">Release Date (Oldest)</SelectItem>
                    <SelectItem value="title.asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title.desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Toggle Filters Button - Show when filters are hidden */}
          {!showFilters && type !== "favorites" && type !== "watchlist" && (
            <div className="mb-4 sm:mb-6 flex justify-start sm:justify-end">
              <button
                onClick={() => setShowFilters(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold
                         transition-all border border-white/20 flex items-center gap-2
                         backdrop-blur-sm shadow-lg hover:scale-105 text-sm sm:text-base"
              >
                <IoFilter className="text-lg sm:text-xl" />
                <span className="hidden sm:inline">Show Filters</span>
                <span className="sm:hidden">Filters</span>
              </button>
            </div>
          )}

          {/* Movies Grid */}
          {(type === "favorites" && favorites.length === 0) || (type === "watchlist" && watchlist.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
              <p className="text-white/60 text-base sm:text-lg md:text-xl font-bold mb-4 text-center px-4">
                {type === "favorites" ? "No favorite movies yet" : "Your watchlist is empty"}
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold
                         transition-all border border-white/20 text-sm sm:text-base"
              >
                Explore Movies
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
              {movies
                .filter((movie) => movie.poster_path)
                .map((movie) => (
          <div
            key={movie.id}
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
                         group-hover:scale-110"
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
                  <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                  <span>•</span>
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Movie title below poster */}
            {/* <h3 className="text-white font-bold mt-2 text-sm line-clamp-2 group-hover:text-white/80 transition-colors">
              {movie.title || movie.original_title}
            </h3> */}
          </div>
        ))}
            </div>
          )}

          {/* Pagination - Aligned to the end */}
          {(type !== "favorites" && type !== "watchlist") && (
            <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-wrap mt-6 sm:mt-8">
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
