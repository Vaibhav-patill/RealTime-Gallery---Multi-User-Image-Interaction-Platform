
import { useState, useRef, useEffect } from "react";
import { Send, Trash2, MessageCircle } from "lucide-react";
import useInteractions from "../../hooks/useInteractions";
import { useAuth } from "../../contexts/AuthContext";
import { getInitials, formatRelativeTime } from "../../utils/helpers";

const CommentSection = ({ imageId }) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsEndRef = useRef(null);
  const prevCountRef = useRef(0);

  const { comments, addComment, deleteComment } =
    useInteractions(imageId);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (comments.length > prevCountRef.current) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCountRef.current = comments.length;
  }, [comments]);

  if (!userProfile) {
    return (
      <div className="text-center py-8 text-slate-500">
        Loading comments...
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(commentText.trim());
      setCommentText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this comment?")) {
      await deleteComment(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments
        </h3>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {comments.length}
        </span>
      </div>

      <div className="max-h-[380px] overflow-y-auto space-y-3 pr-2">
        {comments.length === 0 ? (
          <div className="text-center py-10 text-slate-500 border border-dashed rounded-lg">
            No comments yet
          </div>
        ) : (
          comments.map((c) => {
            const isMine = c.userId === userProfile.id;

            return (
              <div
                key={c.id}
                className={`p-3 rounded-lg border ${
                  isMine
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: c.userColor }}
                  >
                    {getInitials(c.username)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold">
                        {c.username}
                        {isMine && (
                          <span className="ml-2 text-xs text-indigo-600">
                            You
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatRelativeTime(c.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 break-words">
                      {c.text}
                    </p>
                  </div>

                  {isMine && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={commentsEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: userProfile.userColor }}
        >
          {getInitials(userProfile.username)}
        </div>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="Add a comment..."
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!commentText.trim() || isSubmitting}
          className={`p-3 rounded-md transition-colors ${
            commentText.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
