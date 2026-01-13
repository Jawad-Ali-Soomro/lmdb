import { getYoutubeEmbedUrl } from "../utils/tmdb";

const VideoModal = ({ videoKey, onClose }) => {
  if (!videoKey) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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
