
import { useState } from "react";
import { Plus, X } from "lucide-react";
import useInteractions from "../../hooks/useInteractions";
import { useAuth } from "../../contexts/AuthContext";
import { AVAILABLE_EMOJIS } from "../../utils/constants";
import { getInitials } from "../../utils/helpers";

const EmojiReactions = ({ imageId }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { groupedReactions, addReaction, hasUserReacted } =
    useInteractions(imageId);
  const { userProfile } = useAuth();

  if (!userProfile) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Loading reactions…
      </div>
    );
  }

  const handleEmojiClick = async (emoji) => {
    await addReaction(emoji);
    setShowEmojiPicker(false);
  };

  const allEmojis = Object.keys(groupedReactions);
  const totalCount = Object.values(groupedReactions).flat().length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Reactions
        </h3>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
          {totalCount}
        </span>
      </div>

      {allEmojis.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allEmojis.map((emoji) => {
            const reactions = groupedReactions[emoji];
            const userReacted = hasUserReacted(emoji);

            return (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  userReacted
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="text-base">{emoji}</span>
                <span className="font-medium">
                  {reactions.length}
                </span>

                <div className="absolute z-20 hidden group-hover:block mt-10">
                  <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg min-w-max">
                    {reactions.slice(0, 5).map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: r.userColor }}
                        >
                          {getInitials(r.username)}
                        </div>
                        <span>{r.username}</span>
                      </div>
                    ))}
                    {reactions.length > 5 && (
                      <div className="text-slate-300 mt-1">
                        +{reactions.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div>
        <button
          onClick={() => setShowEmojiPicker((p) => !p)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {showEmojiPicker ? (
            <>
              <X className="w-4 h-4" />
              Close
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add reaction
            </>
          )}
        </button>

        {showEmojiPicker && (
          <div className="mt-3 border border-slate-200 rounded-lg p-3 bg-white">
            <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
              {AVAILABLE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className={`h-10 w-10 text-xl rounded-md transition-colors ${
                    hasUserReacted(emoji)
                      ? "bg-indigo-100 border border-indigo-300"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {allEmojis.length === 0 && !showEmojiPicker && (
        <div className="text-center py-6 text-slate-500 border border-dashed rounded-lg text-sm">
          No reactions yet
        </div>
      )}
    </div>
  );
};

export default EmojiReactions;
