import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { cardSounds } from "../utils/cardSounds";

interface PlayingCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  demoVideo?: string;
  highlight?: boolean;
  stack?: Array<{ name: string; icon: any; color: string }>;
  onClick?: () => void;
}

export const PlayingCard = ({ 
  title, 
  subtitle, 
  description, 
  image, 
  demoVideo,
  highlight = false,
  stack = [],
  onClick
}: PlayingCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (isFlipped && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isFlipped]);

  return (
    <div 
      ref={cardRef}
      className="perspective-1000 w-full mx-auto"
      style={{
        maxWidth: 'clamp(260px, 60vw, 340px)',
        height: 'clamp(450px, 75vh, 550px)',
      }}
      onMouseMove={!isFlipped ? handleMouseMove : undefined}
      onMouseLeave={!isFlipped ? handleMouseLeave : undefined}
      onMouseEnter={() => cardSounds.playHover()}
      tabIndex={0}
      role="button"
      aria-label={`${title} project card. Press Enter to view details or Space to flip card.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick) {
          onClick();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
          cardSounds.playFlip();
        } else if (e.key === 'Escape' && isFlipped) {
          setIsFlipped(false);
          cardSounds.playFlip();
        }
      }}
    >
      <motion.div
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 0 : rotateY,
          transformStyle: "preserve-3d"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full h-full"
      >
        {/* Card Container with holographic border */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative w-full h-full"
          style={{ 
            transformStyle: "preserve-3d"
          }}
        >
          {/* Front Face */}
          <div 
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              pointerEvents: isFlipped ? 'none' : 'auto'
            }}
          >
            {/* Holographic Border Effect */}
            <div className={`absolute inset-0 rounded-2xl p-[3px] ${
              highlight 
                ? "bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple"
                : "bg-gradient-to-br from-neon-cyan/50 via-app-border to-neon-purple/50"
            }`}
            style={highlight ? {
              backgroundSize: '200% 200%',
              animation: 'gradientFlow 3s ease infinite'
            } : undefined}
            >
              <div className="w-full h-full bg-card-bg rounded-2xl" />
            </div>
            
            {/* Glowing Shadow for Featured Cards */}
            {highlight && (
              <div 
                className="absolute inset-0 rounded-2xl -z-10 blur-xl opacity-60"
                style={{
                  background: 'linear-gradient(45deg, #ff51fa, #00ffff, #ff51fa)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientFlow 3s ease infinite'
                }}
              />
            )}

            {/* Card Content */}
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-card-bg to-black/90">
              {/* Corner Decorations */}
              <div className="absolute top-4 left-4 flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-neon-cyan">
                  {highlight ? "★" : "♦"}
                </span>
                <span className="text-[8px] font-black text-neon-cyan tracking-widest">
                  {subtitle.substring(0, 3)}
                </span>
              </div>
              
              <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1 rotate-180">
                <span className="text-2xl font-black text-neon-cyan">
                  {highlight ? "★" : "♦"}
                </span>
                <span className="text-[8px] font-black text-neon-cyan tracking-widest">
                  {subtitle.substring(0, 3)}
                </span>
              </div>

              {/* Featured Badge */}
              {highlight && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="px-3 py-1 bg-neon-purple text-black text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    RARE
                  </div>
                </div>
              )}

              {/* Main Image - Clickable for flip */}
              <div 
                className="absolute inset-0 flex items-center justify-center p-8 group"
              >
                <div 
                  className="relative w-full h-full rounded-xl overflow-hidden border-2 border-neon-cyan/30 group-hover:border-neon-cyan/60 transition-colors cursor-pointer"
                  onClick={() => {
                    if (!isFlipped) {
                      setIsFlipped(true);
                      cardSounds.playFlip();
                    }
                  }}
                >
                  {!imageLoaded && (
                    <div className="w-full h-full bg-card-bg animate-pulse flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <img 
                    src={image || null}
                    alt={title}
                    className="w-full h-full object-cover"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/me.png.jpg'; }}
                  />
                  
                  {/* Holographic Shine Overlay */}
                  <div 
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background: `linear-gradient(
                        115deg,
                        transparent 20%,
                        rgba(0, 255, 255, 0.3) 36%,
                        rgba(188, 19, 254, 0.3) 43%,
                        rgba(0, 255, 255, 0.3) 50%,
                        transparent 60%
                      )`,
                      backgroundSize: "200% 200%",
                      animation: "shine 3s linear infinite"
                    }}
                  />
                  
                  {/* Hover Overlay with Buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3" style={{ pointerEvents: 'auto' }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('View Details clicked', onClick);
                        try {
                          if (typeof onClick === 'function') {
                            onClick();
                          }
                        } catch (error) {
                          console.error('Error calling onClick:', error);
                        }
                      }}
                      className="px-6 py-3 bg-neon-cyan text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors cursor-pointer z-50"
                      aria-label="View project details"
                    >
                      <ExternalLink size={14} />
                      View Details
                    </button>
                    <p className="text-[10px] text-neon-cyan font-black uppercase tracking-widest pointer-events-none">
                      or click to flip
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-sm pointer-events-none">
                <h3 className="text-xs font-black text-neon-cyan uppercase tracking-[0.2em] mb-1">
                  {subtitle}
                </h3>
                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">
                  {title}
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              zIndex: isFlipped ? 50 : -1,
              pointerEvents: isFlipped ? 'auto' : 'none'
            }}
          >
            {/* Border */}
            <div className="absolute inset-0 rounded-2xl p-[3px] bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-purple">
              <div className="w-full h-full bg-card-bg rounded-2xl" />
            </div>

            {/* Back Content */}
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-black/95 to-card-bg p-6 flex flex-col">
              {/* Corner Decorations */}
              <div className="absolute top-4 left-4 flex flex-col items-center gap-1 pointer-events-none">
                <span className="text-2xl font-black text-neon-purple">
                  {highlight ? "★" : "♣"}
                </span>
              </div>
              
              <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1 rotate-180 pointer-events-none">
                <span className="text-2xl font-black text-neon-purple">
                  {highlight ? "★" : "♣"}
                </span>
              </div>

              {/* Close/Flip Back Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFlipped(false);
                  cardSounds.playFlip();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-4 right-4 z-[100] w-10 h-10 flex items-center justify-center bg-neon-purple hover:bg-white text-white hover:text-black rounded-full transition-all cursor-pointer shadow-lg text-lg font-bold"
                title="Flip back"
                aria-label="Close and flip card back"
              >
                ✕
              </button>

              {/* Video or Extended Info */}
              <div className="flex-1 flex flex-col justify-center items-center gap-4 mb-4">
                {demoVideo ? (
                  <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-neon-purple/30">
                    <video
                      ref={videoRef}
                      src={demoVideo}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                      <ExternalLink size={32} className="text-black" />
                    </div>
                    <p className="text-xs text-app-text-muted uppercase tracking-widest">
                      Click View to see details
                    </p>
                  </div>
                )}

                {/* Tech Stack */}
                {stack.length > 0 && (
                  <div className="w-full">
                    <h5 className="text-[8px] font-black text-app-text-muted uppercase tracking-widest mb-2 text-center">
                      Tech Stack
                    </h5>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {stack.slice(0, 6).map((tech, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-1 px-2 py-1 bg-black/50 rounded border border-app-border"
                        >
                          <tech.icon size={12} style={{ color: tech.color }} />
                          <span className="text-[8px] font-bold text-white">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 relative z-[60]">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Back View Details clicked', onClick);
                    try {
                      if (typeof onClick === 'function') {
                        onClick();
                      }
                    } catch (error) {
                      console.error('Error calling onClick:', error);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-neon-cyan text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors cursor-pointer"
                  aria-label="View full project details"
                >
                  <ExternalLink size={12} />
                  View Details
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                    cardSounds.playFlip();
                  }}
                  className="px-4 py-3 bg-neon-purple text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors cursor-pointer"
                  aria-label="Flip card back"
                >
                  ↩ Back
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
