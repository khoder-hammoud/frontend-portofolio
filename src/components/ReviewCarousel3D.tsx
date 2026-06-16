import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating?: number;
}

interface ReviewCarousel3DProps {
  testimonials: Testimonial[];
}

export const ReviewCarousel3D = ({ testimonials }: ReviewCarousel3DProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const absIndex = ((diff % testimonials.length) + testimonials.length) % testimonials.length;
    
    if (absIndex === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)'
      };
    } else if (absIndex === 1 || absIndex === testimonials.length - 1) {
      const isRight = absIndex === 1;
      return {
        transform: `translateX(${isRight ? '75%' : '-75%'}) scale(0.75) rotateY(${isRight ? '-25deg' : '25deg'})`,
        zIndex: 20,
        opacity: 0.5,
        filter: 'brightness(0.5)'
      };
    } else if (absIndex === 2 || absIndex === testimonials.length - 2) {
      const isRight = absIndex === 2;
      return {
        transform: `translateX(${isRight ? '150%' : '-150%'}) scale(0.5) rotateY(${isRight ? '-45deg' : '45deg'})`,
        zIndex: 10,
        opacity: 0.3,
        filter: 'brightness(0.3)'
      };
    } else {
      return {
        transform: 'translateX(0%) scale(0.3)',
        zIndex: 0,
        opacity: 0,
        filter: 'brightness(0.2)'
      };
    }
  };

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full" style={{ perspective: '1800px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {testimonials.map((testimonial, index) => {
            const style = getCardStyle(index);
            
            return (
              <motion.div
                key={testimonial.id}
                className="absolute w-[clamp(300px,85vw,440px)] h-[300px] md:h-[380px] lg:h-[440px] rounded-2xl overflow-hidden border-2 border-app-border bg-card-bg shadow-[0_0_25px_rgba(0,0,0,0.3)]"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
                animate={style}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1]
                }}
              >
                <div className="relative w-full h-full p-8 flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img 
                        src={testimonial.avatar || null} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full border-2 border-neon-cyan"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center">
                        <Quote size={12} className="text-black" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-app-text uppercase tracking-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-[10px] text-app-text-muted uppercase tracking-[0.3em]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <p className="text-base text-app-text-muted leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                  
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 ${
                          i < (testimonial.rating || 5) 
                            ? 'text-neon-cyan drop-shadow-[0_0_4px_rgba(0,242,255,0.6)]' 
                            : 'text-app-border'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-8 z-40 w-12 h-12 rounded-full bg-card-bg border-2 border-neon-cyan text-neon-cyan flex items-center justify-center hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-8 z-40 w-12 h-12 rounded-full bg-card-bg border-2 border-neon-cyan text-neon-cyan flex items-center justify-center hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-neon-cyan w-8' 
                : 'bg-app-border hover:bg-neon-cyan/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
