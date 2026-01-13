import { BsPlay } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="px-20 mx-auto px-10 py-16">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex gap-2 h-[60px] w-[150px] items-center justify-center border-2 p-1 rounded-full pr-5">
            <a
              href="/"
              className="font-bold text-xl flex items-center justify-center
                            w-[40px] h-[40px] rounded-full bg-white text-black"
            >
              <BsPlay />
            </a>
            <span className="font-black text-xl">LMDB•</span>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Movies</li>
              <li className="hover:text-white cursor-pointer">TV Series</li>
              <li className="hover:text-white cursor-pointer">Trending</li>
              <li className="hover:text-white cursor-pointer">Top Rated</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold mb-4">Account</h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Watchlist</li>
              <li className="hover:text-white cursor-pointer">Favorites</li>
              <li className="hover:text-white cursor-pointer">Profile</li>
              <li className="hover:text-white cursor-pointer">Settings</li>
            </ul>
          </div>

          {/* Social */}


        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} LMDB. All rights reserved.
          </p>
          <p>
            Powered by <span className="text-white font-semibold">TMDB API</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
