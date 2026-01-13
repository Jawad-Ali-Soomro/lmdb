import { getYoutubeEmbedUrl } from "../utils/tmdb";

const VideoModal = ({ videoKey, onClose }) => {
  if (!videoKey) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="Close"
        >
          ✕
        </button>
        <iframe
          src={getYoutubeEmbedUrl(videoKey)}
          className="w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;
