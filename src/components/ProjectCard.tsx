import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  demoVideo?: string;
  highlight?: boolean;
  onClick?: () => void;
}

export const ProjectCard = ({ 
  title, 
  subtitle, 
  description, 
  image, 
  demoVideo,
  highlight = false,
  onClick
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative group rounded-xl overflow-hidden cursor-pointer h-full flex flex-col bg-card-bg"
    >
      {/* Animated Border */}
      <div className={`absolute inset-0 rounded-xl p-[2px] ${
        highlight 
          ? "bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple bg-[length:200%_100%] animate-[gradient_3s_linear_infinite]"
          : "bg-gradient-to-r from-neon-cyan via-app-border to-neon-cyan bg-[length:200%_100%] group-hover:animate-[gradient_3s_linear_infinite]"
      }`}>
        <div className="w-full h-full bg-card-bg rounded-xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full rounded-xl overflow-hidden">
        <div className="relative overflow-hidden flex-1 min-h-[200px]">
          {demoVideo && isHovered ? (
            <video
              ref={videoRef}
              src={demoVideo}
              muted
              loop
              playsInline
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <>
              {!imageLoaded && (
                <div className="w-full h-full bg-card-bg animate-pulse flex items-center justify-center absolute inset-0">
                  <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img 
                src={image} 
                alt={title} 
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="no-referrer"
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-card-bg/50 to-transparent" />
          
          {highlight && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-neon-purple text-black text-[8px] font-black uppercase tracking-widest">
              FEATURED
            </div>
          )}
          
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                rotate: [0, -2, 2, 0],
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-neon-cyan text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-neon-cyan/50"
            >
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                View Project
              </motion.span>
              <motion.div
                animate={{ x: isHovered ? 10 : 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ExternalLink size={14} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
        
        <div className="p-6 relative z-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            <h3 className="text-[10px] font-bold text-neon-cyan uppercase tracking-[0.3em] group-hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,255,255,0.8)]">{subtitle}</h3>
          </div>
          <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-neon-cyan group-hover:scale-105 transition-all duration-300 origin-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">{title}</h4>
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 group-hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};