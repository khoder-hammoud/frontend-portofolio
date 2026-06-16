import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, subtext, trend, color = "neon-cyan" }: any) => {
  const isPositive = trend && (trend.includes('+') || trend.includes('↑'));
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      className="p-8 bg-card-bg border border-app-border rounded-2xl relative overflow-hidden group cursor-pointer"
    >
      {/* Animated Background Glow */}
      <motion.div 
        className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 blur-3xl rounded-full -mr-16 -mt-16`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Hover Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Label with hover effect */}
        <motion.h3 
          className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.2em] mb-4 group-hover:text-neon-cyan transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          {label}
        </motion.h3>
        
        {/* Value and Trend */}
        <div className="flex items-end gap-4 mb-2">
          <motion.span 
            className={`text-5xl font-black text-${color} tracking-tighter drop-shadow-[0_2px_8px_rgba(0,242,255,0.3)]`}
            whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {value}
          </motion.span>
          
          {trend && (
            <motion.div 
              className={`flex items-center gap-1 mb-2 px-2 py-1 rounded-full ${
                isPositive 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {isPositive ? (
                <TrendingUp size={12} className="text-green-400" />
              ) : (
                <TrendingDown size={12} className="text-red-400" />
              )}
              <span className="text-[10px] font-bold uppercase">
                {trend}
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Subtext with hover effect */}
        <motion.p 
          className="text-[10px] text-app-text-muted/50 uppercase tracking-widest group-hover:text-app-text-muted/80 transition-colors duration-300"
          whileHover={{ x: 5 }}
        >
          {subtext}
        </motion.p>
      </div>
      
      {/* Animated Border on Hover */}
      <motion.div 
        className="absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ opacity: 1 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan rounded-2xl" 
             style={{ backgroundSize: '200% 100%' }} />
      </motion.div>
    </motion.div>
  );
};

export default StatCard;
