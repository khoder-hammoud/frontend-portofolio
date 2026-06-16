import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  fallbackFormat?: 'jpg' | 'png' | 'jpeg';
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty' | 'color';
  blurDataURL?: string;
  onClick?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  format = 'auto',
  fallbackFormat = 'jpg',
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
  onClick
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Generate WebP and AVIF URLs
  const generateOptimizedUrl = (originalSrc: string, targetFormat: string) => {
    if (originalSrc.startsWith('data:')) return originalSrc;
    
    // If it's already a webp/avif, return as is
    if (originalSrc.match(/\.(webp|avif)$/i)) return originalSrc;
    
    // Generate optimized URL
    const url = new URL(originalSrc, window.location.origin);
    const pathname = url.pathname;
    
    // Add format parameter for image optimization services
    if (pathname.match(/\.(jpg|jpeg|png)$/i)) {
      const baseName = pathname.replace(/\.(jpg|jpeg|png)$/i, '');
      return `${baseName}.${targetFormat}?q=${quality}`;
    }
    
    return originalSrc;
  };

  // Check browser support for formats
  const checkFormatSupport = async (format: string): Promise<boolean> => {
    if (format === 'webp') {
      return new Promise(resolve => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    }
    
    if (format === 'avif') {
      return new Promise(resolve => {
        const avif = new Image();
        avif.onload = avif.onerror = () => resolve(avif.height === 2);
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg';
      });
    }
    
    return false;
  };

  // Generate blur placeholder
  const generateBlurPlaceholder = (src: string): string => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = 40;
    canvas.height = 40;
    
    // Create gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, 40, 40);
    gradient.addColorStop(0, '#141a2b');
    gradient.addColorStop(1, '#1e293b');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 40, 40);
    
    return canvas.toDataURL();
  };

  useEffect(() => {
    const loadImage = async () => {
      if (!src) { setImageSrc(null); return; }

      try {
        let optimizedSrc = src;
        
        // Try modern formats first
        if (format === 'auto') {
          // Try AVIF first (best compression)
          if (await checkFormatSupport('avif')) {
            optimizedSrc = generateOptimizedUrl(src, 'avif');
          }
          // Fall back to WebP
          else if (await checkFormatSupport('webp')) {
            optimizedSrc = generateOptimizedUrl(src, 'webp');
          }
          // Use original
          else {
            optimizedSrc = src;
          }
        } else if (format === 'webp' && await checkFormatSupport('webp')) {
          optimizedSrc = generateOptimizedUrl(src, 'webp');
        } else if (format === 'avif' && await checkFormatSupport('avif')) {
          optimizedSrc = generateOptimizedUrl(src, 'avif');
        } else {
          optimizedSrc = src;
        }

        setImageSrc(optimizedSrc);
      } catch (error) {
        console.error('Failed to load optimized image:', error);
        setImageSrc(src);
      }
    };

    if (priority || isInView) {
      loadImage();
    }
  }, [src, format, priority, isInView]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById(`optimized-img-${src}`);
    if (target) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    onError?.();
  };

  const placeholderSrc = placeholder === 'blur' ? generateBlurPlaceholder(src) : '';

  return (
    <div id={`optimized-img-${src}`} className={`relative ${className}`}>
      {/* Placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <div 
          className="absolute inset-0 blur-xl scale-110"
          style={{
            backgroundImage: `url(${placeholderSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Main Image */}
      <motion.img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        onClick={onClick}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          hasError ? 'opacity-50' : isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 1.05 
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          filter: hasError ? 'blur(2px)' : 'none'
        }}
      />
      
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-card-bg animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-card-bg/80 text-app-text-muted">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-xs">Failed to load image</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
