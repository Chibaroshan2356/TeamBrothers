import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleGalleryProps {
  images: string[];
  className?: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ 
  images, 
  className 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload images
    const preloadImages = images.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    Promise.all(preloadImages.map(img => 
      new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      })
    )).then(() => {
      setIsLoading(false);
    });
  }, [images]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape') {
      closeFullscreen();
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className={cn("w-full h-64 bg-muted rounded-lg flex items-center justify-center", className)}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={cn("relative w-full h-64 md:h-96 bg-muted rounded-lg overflow-hidden group", className)}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Main Image */}
            <div className="relative w-full h-full">
              <img
                src={images[currentImageIndex]}
                alt={`Vehicle image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                onClick={openFullscreen}
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={goToPrevious}
                    className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={goToNext}
                    className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={openFullscreen}
                    className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                index === currentImageIndex
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-border hover:border-primary/50 hover:scale-105"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Fullscreen Image */}
            <img
              src={images[currentImageIndex]}
              alt={`Vehicle image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Fullscreen Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={goToPrevious}
                className="bg-black/50 hover:bg-black/70 text-white border-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={goToNext}
                className="bg-black/50 hover:bg-black/70 text-white border-white/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Fullscreen Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default VehicleGallery;
