export default function NotFoundPage({ onBackHome }: { onBackHome: () => void }) {
  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      {/* Decorative Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-neon-cyan/30 rotate-45 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border-2 border-neon-purple/30 animate-bounceCustom"></div>
      <div className="absolute bottom-32 left-20 w-28 h-28 border-2 border-neon-cyan/20 rotate-12 animate-pulse"></div>
      <div className="absolute bottom-20 right-16 w-32 h-32 border-2 border-neon-purple/25 rotate-45 animate-bounceCustom"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-black tracking-tighter mb-4 animate-glitch">
            <span className="text-gradient">404</span>
          </h1>
        </div>

        {/* Error Title */}
        <h2 className="text-3xl font-bold mb-4 text-neon-cyan text-shadow-glow">
          Lost in the Grid?
        </h2>

        {/* Error Description */}
        <p className="text-lg text-app-text-muted mb-2 leading-relaxed">
          The data point you are looking for does not exist.
        </p>
        <p className="text-lg text-app-text-muted mb-8 leading-relaxed">
          Our neural pathways are misfiring.
        </p>

        {/* Back Button */}
        <button
          onClick={onBackHome}
          className="mt-8 px-8 py-4 border-2 border-neon-cyan text-neon-cyan font-bold text-lg font-display rounded-full uppercase tracking-widest hover:bg-neon-cyan/10 hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>

      {/* System Status Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-mono text-neon-cyan/60 tracking-widest">
        <p>SYSTEM STATUS: <span className="text-neon-purple">CRITICAL ERROR</span> // BACKEND DISCONNECTED // ERROR CODE: 0x404_NEON_GRID</p>
      </div>
    </div>
  );
}
