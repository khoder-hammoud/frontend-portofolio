import { useState } from 'react';

import { motion } from 'framer-motion';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { PlayingCard } from './PlayingCard';

import { useCarouselSwipe, useTouchCapabilities } from '../hooks/useSwipeGestures';



interface Project {

  id: string;

  title: string;

  subtitle: string;

  description: string;

  image: string;

  demoVideo?: string;

  highlight?: boolean;

  stack?: Array<{ name: string; icon: any; color: string }>;

}



interface ProjectCarousel3DProps {

  projects: Project[];

  onProjectClick?: (id: string) => void;

}



export const ProjectCarousel3D = ({ projects, onProjectClick }: ProjectCarousel3DProps) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;



  // Touch capabilities

  useTouchCapabilities();



  const goToNext = () => {

    setCurrentIndex((prev) => (prev + 1) % projects.length);

  };



  const goToPrev = () => {

    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  };



  // Swipe gestures for carousel

  const { elementRef } = useCarouselSwipe(

    projects.length,

    currentIndex,

    setCurrentIndex,

    {

      threshold: 50,

      swipeVelocity: 0.3,

      swipeDistance: 100,

      touchOnly: false, // Allow both touch and mouse

      preventDefault: true

    }

  );



  const getCardStyle = (index: number) => {

    const diff = index - currentIndex;

    const absIndex = ((diff % projects.length) + projects.length) % projects.length;

    

    if (absIndex === 0) {

      // Center card

      return {

        x: '0%',

        scale: isMobile ? 0.9 : 1,

        rotateY: 0,

        zIndex: 30,

        opacity: 1,

        filter: 'brightness(1)',

        display: 'block'

      };

    } else if (absIndex === 1 || absIndex === projects.length - 1) {

      // Side cards

      const isRight = absIndex === 1;

      return {

        x: isRight ? (isMobile ? '45%' : '70%') : (isMobile ? '-45%' : '-70%'),

        scale: isMobile ? 0.65 : 0.8,

        rotateY: isRight ? -20 : 20,

        zIndex: 20,

        opacity: isMobile ? 0.4 : 0.7,

        filter: 'brightness(0.6)',

        display: 'block'

      };

    } else if (absIndex === 2 || absIndex === projects.length - 2) {

      // Far side cards

      const isRight = absIndex === 2;

      return {

        x: isRight ? (isMobile ? '80%' : '140%') : (isMobile ? '-80%' : '-140%'),

        scale: isMobile ? 0.45 : 0.6,

        rotateY: isRight ? -35 : 35,

        zIndex: 10,

        opacity: isMobile ? 0 : 0.4,

        filter: 'brightness(0.4)',

        display: isMobile ? 'none' : 'block'

      };

    } else {

      // Hidden cards

      return {

        x: '0%',

        scale: 0.3,

        rotateY: 0,

        zIndex: 0,

        opacity: 0,

        filter: 'brightness(0.2)',

        display: 'none'

      };

    }

  };



  return (

    <div ref={elementRef as React.RefObject<HTMLDivElement>} className="relative w-full max-w-4xl mx-auto perspective-1000">

      <div className="relative min-h-[280px] md:min-h-[420px] md:perspective-1000 center overflow-hidden md:overflow-visible pt-8 pb-16 md:pb-20 touch-pan-y selection:bg-neon-cyan/30">

        {/* Scroll Hint for Mobile */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 md:hidden text-[8px] text-neon-cyan/50 animate-pulse uppercase tracking-[0.2em] z-50">

          Swipe to explore

        </div>

        {/* Debug Info */}

        {projects.length === 0 && (

          <div className="text-center text-app-text-muted">

            <p className="text-xs uppercase tracking-widest">No projects available</p>

          </div>

        )}

        

        {/* 3D Perspective Container */}

        {projects.length > 0 && (

          <div className="relative w-full h-[450px] md:h-[600px]" style={{ perspective: '2000px' }}>

            <div className="absolute inset-0 flex items-center justify-center">

              {projects.map((project, index) => {

                const style = getCardStyle(index);

              

              return (

                <motion.div

                  key={project.id}

                  className="absolute"

                  style={{

                    width: 'clamp(260px, 60vw, 340px)',

                    transformStyle: 'preserve-3d',

                    pointerEvents: 'auto'

                  }}

                  animate={style}

                  transition={{

                    duration: 0.6,

                    ease: [0.32, 0.72, 0, 1]

                  }}

                >

                  <PlayingCard

                    title={project.title}

                    subtitle={project.subtitle}

                    description={project.description}

                    image={project.image}

                    demoVideo={project.demoVideo}

                    highlight={project.highlight}

                    stack={project.stack || []}

                    onClick={() => onProjectClick?.(project.id)}

                  />

                </motion.div>

              );

            })}

          </div>

        </div>

      )}



      {/* Navigation Buttons */}
      <div>
      {projects.length > 1 && (

        <>

          <button

            onClick={goToPrev}

            className="absolute left-2 md:left-8 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card-bg/80 backdrop-blur-md border-2 border-neon-cyan text-neon-cyan flex items-center justify-center hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"

            aria-label="Previous project"

          >

            <ChevronLeft size={isMobile ? 20 : 24} />

          </button>

          

          <button

            onClick={goToNext}

            className="absolute right-2 md:right-8 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card-bg/80 backdrop-blur-md border-2 border-neon-cyan text-neon-cyan flex items-center justify-center hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"

            aria-label="Next project"

          >

            <ChevronRight size={isMobile ? 20 : 24} />

          </button>



          {/* Dots Indicator */}

          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">

            {projects.map((_, index) => (

              <button

                key={index}

                onClick={() => setCurrentIndex(index)}

                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${

                  index === currentIndex 

                    ? 'bg-neon-cyan w-6 md:w-8 shadow-[0_0_10px_rgba(0,242,255,0.8)]' 

                    : 'bg-app-border w-1.5 md:w-2 hover:bg-neon-cyan/50'

                }`}

                aria-label={`Go to project ${index + 1}`}

              />

            ))}

          </div>

        </>

      )}
      </div>
      </div>
    </div>

  );

};
