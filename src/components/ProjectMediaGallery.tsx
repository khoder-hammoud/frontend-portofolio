import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface ProjectMediaGalleryProps {
  mainImage: string;
  images?: string[];
  video?: string;
  title: string;
}

const ProjectMediaGallery = ({ 
  mainImage, 
  images = [], 
  video, 
  title 
}: ProjectMediaGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Combine main image with additional images
  const allImages = [mainImage, ...images];
  const totalMedia = allImages.length + (video ? 1 : 0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalMedia);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
  };

  const isVideoIndex = video && currentIndex === allImages.length;

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-app-border bg-card-bg group">
        <AnimatePresence mode="wait">
          {isVideoIndex ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <video
                src={video}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <OptimizedImage
              key={currentIndex}
              src={allImages[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              priority={currentIndex === 0}
              quality={85}
              format="auto"
              placeholder="blur"
              onClick={() => setShowLightbox(true)}
            />
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {totalMedia > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-app-text rounded-lg hover:bg-neon-cyan hover:text-black transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-app-text rounded-lg hover:bg-neon-cyan hover:text-black transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Media Type Indicator */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-[8px] text-neon-cyan uppercase tracking-widest rounded">
          {isVideoIndex ? 'Video' : `Image ${currentIndex + 1}/${allImages.length}`}
        </div>

        {/* Fullscreen Button */}
        {!isVideoIndex && (
          <button
            onClick={() => setShowLightbox(true)}
            className="absolute top-4 right-4 px-3 py-1 bg-black/80 text-[8px] text-app-text uppercase tracking-widest rounded hover:bg-neon-cyan hover:text-black transition-all opacity-0 group-hover:opacity-100"
          >
            Expand
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              currentIndex === index && !isVideoIndex
                ? 'border-neon-cyan scale-105'
                : 'border-app-border hover:border-app-text-muted'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        
        {/* Video Thumbnail */}
        {video && (
          <button
            onClick={() => setCurrentIndex(allImages.length)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all bg-black/50 ${
              isVideoIndex
                ? 'border-neon-purple scale-105'
                : 'border-app-border hover:border-app-text-muted'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Play size={24} className="text-neon-purple" />
            </div>
            <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/80 text-[6px] text-neon-purple uppercase tracking-widest rounded">
              Video
            </div>
          </button>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && !isVideoIndex && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-6 right-6 p-3 bg-black/80 text-app-text rounded-lg hover:bg-red-500 transition-all"
            >
              <X size={24} />
            </button>

            <div className="relative max-w-6xl w-full">
              <motion.img
                key={currentIndex}
                src={allImages[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-auto rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation in Lightbox */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 text-app-text rounded-lg hover:bg-neon-cyan hover:text-black transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 text-app-text rounded-lg hover:bg-neon-cyan hover:text-black transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-xs text-app-text uppercase tracking-widest rounded-lg">
                {currentIndex + 1} / {allImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectMediaGallery;
