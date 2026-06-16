import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'title' | 'stat';
  count?: number;
  className?: string;
}

export const LoadingSkeleton = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}: LoadingSkeletonProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative group rounded-xl overflow-hidden h-full flex flex-col bg-card-bg ${className}`}
          >
            {/* Skeleton Border */}
            <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-app-border via-app-border to-app-border">
              <div className="w-full h-full bg-card-bg rounded-xl" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full rounded-xl overflow-hidden">
              {/* Image Skeleton */}
              <div className="relative overflow-hidden flex-1 min-h-[200px]">
                <div className="w-full h-full bg-gradient-to-br from-card-bg via-card-bg/50 to-card-bg animate-pulse" />
                
                {/* Shimmer Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              
              {/* Content Skeleton */}
              <div className="p-6 relative z-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-neon-cyan/30 rounded-full animate-pulse" />
                  <div className="h-3 w-24 bg-neon-cyan/20 rounded animate-pulse" />
                </div>
                <div className="h-6 w-32 bg-white/20 rounded mb-3 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-300/20 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-300/20 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="h-3 w-full bg-gray-300/20 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-gray-300/20 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-300/20 rounded animate-pulse" />
          </div>
        );

      case 'avatar':
        return (
          <div className={`w-12 h-12 rounded-full bg-neon-cyan/20 animate-pulse ${className}`} />
        );

      case 'title':
        return (
          <div className={`h-8 w-48 bg-white/20 rounded animate-pulse ${className}`} />
        );

      case 'stat':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 bg-card-bg border border-app-border rounded-2xl relative overflow-hidden ${className}`}
          >
            <div className="space-y-4">
              <div className="h-3 w-24 bg-app-text-muted/20 rounded animate-pulse" />
              <div className="h-12 w-16 bg-neon-cyan/20 rounded animate-pulse" />
              <div className="h-2 w-32 bg-app-text-muted/10 rounded animate-pulse" />
            </div>
            
            {/* Shimmer Effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        );

      default:
        return <div className={`h-4 w-full bg-gray-300/20 rounded animate-pulse ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

// Grid wrapper for multiple card skeletons
export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <LoadingSkeleton type="card" count={count} />
  </div>
);

// Stats grid wrapper
export const StatsSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <LoadingSkeleton type="stat" count={4} />
  </div>
);
