
import { useState, useCallback } from "react";
import { Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";
import useImages from "../../hooks/useImages";

const ImageGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    images,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useImages();

  const { ref: loadMoreRef } = useInView({
    threshold: 0.3,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading images...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="max-w-sm w-full text-center bg-white border border-slate-200 rounded-xl p-6">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-800 font-semibold">
            Failed to load images
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {error?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center text-slate-500">
          <ImageIcon className="w-10 h-10 mx-auto mb-2" />
          <p className="font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Gallery
        </h2>
        <p className="text-sm text-slate-500">
          {images.length} images loaded — click to view and interact
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex justify-center py-10"
        >
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more
            </div>
          )}
        </div>
      )}

      {!hasNextPage && (
        <div className="text-center text-sm text-slate-500 py-10">
          You’ve reached the end of the gallery
        </div>
      )}

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={closeModal} />
      )}
    </div>
  );
};

export default ImageGrid;
