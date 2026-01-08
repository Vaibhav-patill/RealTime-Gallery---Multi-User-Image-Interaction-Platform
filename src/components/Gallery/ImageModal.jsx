
import { useEffect, useState } from "react";
import { X, ExternalLink, User, Download } from "lucide-react";
import CommentSection from "../Interactions/CommentSections";
import EmojiReactions from "../Interactions/EmojiReactions";

const ImageModal = ({ image, onClose }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col lg:flex-row">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-md bg-white hover:bg-slate-100 border"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-slate-900 flex items-center justify-center relative">
          {!loaded && (
            <div className="absolute text-white text-sm">
              Loading image...
            </div>
          )}

          <img
            src={image.fullUrl || image.url}
            alt={image.description}
            onLoad={() => setLoaded(true)}
            className="max-w-full max-h-[90vh] object-contain"
          />

          <div className="absolute bottom-0 w-full bg-black/60 px-4 py-3 text-white text-sm">
            <p className="font-medium line-clamp-2">
              {image.description || "Untitled image"}
            </p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{image.photographer?.name}</span>
              </div>

              <div className="flex gap-3">
                <a
                  href={image.photographer?.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={image.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col">
          
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Interactions</h3>
            <p className="text-sm text-slate-500">
              Reactions and comments update in real time
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <EmojiReactions imageId={image.id} />
            <CommentSection imageId={image.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
