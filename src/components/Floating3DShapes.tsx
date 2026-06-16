import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  type: 'cube' | 'pyramid' | 'ring' | 'sphere' | 'wireframe' | 'hexagon';
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

export const Floating3DShapes = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    // إنشاء 12 شكل عشوائي حول الصورة
    const newShapes: Shape[] = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 360) / 12; // توزيع دائري متساوي
      const radius = 180 + Math.random() * 120; // مسافة متنوعة من المركز
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;

      return {
        id: i,
        type: ['cube', 'pyramid', 'ring', 'sphere', 'wireframe', 'hexagon'][Math.floor(Math.random() * 6)] as any,
        x,
        y,
        size: 30 + Math.random() * 50,
        duration: 12 + Math.random() * 8,
        delay: Math.random() * 5,
        color: i % 3 === 0 ? '#00F2FF' : i % 3 === 1 ? '#BC13FE' : '#FFFFFF',
        opacity: 0.2 + Math.random() * 0.3
      };
    });
    setShapes(newShapes);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ perspective: '1000px' }}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: shape.size,
            height: shape.size,
            opacity: shape.opacity,
          }}
          animate={{
            x: [shape.x, -shape.x, shape.x],
            y: [shape.y, -shape.y, shape.y],
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: shape.delay,
          }}
        >
          {shape.type === 'cube' && <Cube color={shape.color} />}
          {shape.type === 'pyramid' && <Pyramid color={shape.color} />}
          {shape.type === 'ring' && <Ring color={shape.color} />}
          {shape.type === 'sphere' && <Sphere color={shape.color} />}
          {shape.type === 'wireframe' && <Wireframe color={shape.color} />}
          {shape.type === 'hexagon' && <Hexagon color={shape.color} />}
        </motion.div>
      ))}
    </div>
  );
};

// مكعب ثلاثي الأبعاد محسن
const Cube = ({ color }: { color: string }) => (
  <div
    className="w-full h-full relative"
    style={{
      transformStyle: 'preserve-3d',
      transform: 'rotateX(45deg) rotateY(45deg)',
    }}
  >
    {[
      { transform: 'translateZ(20px)' },
      { transform: 'translateZ(-20px)' },
      { transform: 'rotateY(90deg) translateZ(20px)' },
      { transform: 'rotateY(90deg) translateZ(-20px)' },
      { transform: 'rotateX(90deg) translateZ(20px)' },
      { transform: 'rotateX(90deg) translateZ(-20px)' },
    ].map((face, i) => (
      <div
        key={i}
        className="absolute inset-0 border-2"
        style={{
          borderColor: color,
          backgroundColor: `${color}15`,
          transform: face.transform,
          boxShadow: `0 0 15px ${color}60, inset 0 0 10px ${color}30`,
        }}
      />
    ))}
  </div>
);

// هرم ثلاثي الأبعاد
const Pyramid = ({ color }: { color: string }) => (
  <div
    className="w-full h-full relative"
    style={{
      transformStyle: 'preserve-3d',
    }}
  >
    <div
      className="absolute inset-0"
      style={{
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        backgroundColor: `${color}25`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}70, inset 0 0 15px ${color}40`,
      }}
    />
  </div>
);

// حلقة ثلاثية الأبعاد
const Ring = ({ color }: { color: string }) => (
  <div
    className="w-full h-full rounded-full border-[3px]"
    style={{
      borderColor: color,
      boxShadow: `0 0 25px ${color}, inset 0 0 25px ${color}`,
      transformStyle: 'preserve-3d',
    }}
  >
    <div
      className="absolute inset-3 rounded-full border-2"
      style={{
        borderColor: color,
        boxShadow: `0 0 15px ${color}`,
      }}
    />
  </div>
);

// كرة ثلاثية الأبعاد
const Sphere = ({ color }: { color: string }) => (
  <div
    className="w-full h-full rounded-full"
    style={{
      background: `radial-gradient(circle at 30% 30%, ${color}70, ${color}30, transparent)`,
      border: `2px solid ${color}`,
      boxShadow: `0 0 25px ${color}70, inset 0 0 15px ${color}50`,
    }}
  />
);

// إطار سلكي
const Wireframe = ({ color }: { color: string }) => (
  <div
    className="w-full h-full relative"
    style={{
      transformStyle: 'preserve-3d',
    }}
  >
    <div
      className="absolute inset-0 border-2 rounded-lg"
      style={{
        borderColor: color,
        boxShadow: `0 0 20px ${color}60`,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: `linear-gradient(45deg, transparent 48%, ${color} 48%, ${color} 52%, transparent 52%)`,
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: `linear-gradient(-45deg, transparent 48%, ${color} 48%, ${color} 52%, transparent 52%)`,
        }}
      />
    </div>
  </div>
);

// سداسي ثلاثي الأبعاد
const Hexagon = ({ color }: { color: string }) => (
  <div
    className="w-full h-full relative"
    style={{
      transformStyle: 'preserve-3d',
    }}
  >
    <div
      className="absolute inset-0"
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        backgroundColor: `${color}20`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}70, inset 0 0 15px ${color}40`,
      }}
    />
  </div>
);
