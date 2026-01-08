
import { useState } from "react";
import { Heart, MessageCircle, User } from "lucide-react";
import useInteractions from "../../hooks/useInteractions";
import { useAuth } from "../../contexts/AuthContext";
import { AVAILABLE_EMOJIS } from "../../utils/constants";

const ImageCard = ({ image, onClick }) => {
  const { userProfile } = useAuth();
  const {
    groupedReactions,
    totalComments,
    addReaction,
    hasUserReacted,
  } = useInteractions(image.id);

  const [showEmojis, setShowEmojis] = useState(false);

  const topEmojis = Object.entries(groupedReactions)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);

  const handleReaction = async (emoji, e) => {
    e.stopPropagation();
    if (userProfile) await addReaction(emoji);
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative aspect-square bg-slate-100">
        <img
          src={image.url}
          alt={image.description || "Gallery image"}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-md flex items-center gap-1 text-xs text-slate-700">
          <User className="w-3 h-3" />
          {image.photographer?.name || "Unknown"}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-700 line-clamp-2 min-h-[40px]">
          {image.description || "Untitled image"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {topEmojis.length > 0 ? (
              topEmojis.map(([emoji, reactions]) => (
                <div
                  key={emoji}
                  className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-xs"
                >
                  <span>{emoji}</span>
                  <span>{reactions.length}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Heart className="w-4 h-4" />0
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-slate-600">
            <MessageCircle className="w-4 h-4" />
            {totalComments}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowEmojis((p) => !p);
          }}
          className="text-xs text-indigo-600 hover:underline"
        >
          React
        </button>
      </div>

      {showEmojis && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 flex gap-2 z-10"
        >
          {AVAILABLE_EMOJIS.slice(0, 4).map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => handleReaction(emoji, e)}
              className={`text-lg hover:scale-110 transition ${
                hasUserReacted(emoji) ? "opacity-100" : "opacity-70"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
