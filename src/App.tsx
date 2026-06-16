import { useState, useEffect, useRef, FormEvent, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";
import { settingsAPI } from "./services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "./DataContext";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { WavyDotsBackground } from "./components/WavyDotsBackground";
import { Sun, Moon, Menu, X } from "lucide-react";

const Dashboard = lazy(() => import("./Dashboard"));

// WorkPage wrapper component to use useParams hook
function WorkPageRoute({ handleProjectClick, navigate }: any) {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <WorkPage 
        projectId={projectId || null}
        onProjectClick={handleProjectClick}
        onBack={() => navigate('/work')}
      />
    </motion.div>
  );
}

const SystemLoader = ({ progress }: { progress: number }) => {
  const [text, setText] = useState('');
  const [dots, setDots] = useState('');
  const fullText = 'INITIALIZING SYSTEM';

  useEffect(() => {
    let i = 0;
    const t1 = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(t1);
    }, 80);
    const t2 = setInterval(() => {
      setDots(p => p.length >= 3 ? '' : p + '.');
    }, 500);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-app-bg flex flex-col items-center justify-center"
    >
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,242,255,0.03)_2px,rgba(0,242,255,0.03)_4px)] pointer-events-none" />

      {/* Rotating cyber frame */}
      <motion.div
        className="relative mb-12 w-32 h-32"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
      </motion.div>

      <h1 className="text-3xl md:text-5xl font-black tracking-[0.3em] uppercase font-display text-neon-cyan">
        {text}<span className="animate-pulse">{dots}</span>
      </h1>

      {/* Progress bar */}
      <div className="mt-12 w-64">
        <div className="flex justify-between text-[8px] text-app-text-muted uppercase tracking-widest mb-2">
          <span>Loading</span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <div className="w-full h-[3px] bg-app-border relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-neon-purple"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ boxShadow: '0 0 8px rgba(0,242,255,0.5)' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

function AppContent() {
  const { settings, loading, loadingProgress } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Determine if current route is a valid page
  const validPaths = ["/", "/work", "/about", "/contact"];
  const isWorkDetail = location.pathname.startsWith("/work/") && location.pathname !== "/work";
  const isNotFound = !validPaths.includes(location.pathname) && !isWorkDetail;

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Prevent body scroll when Dashboard is open
  useEffect(() => {
    if (showDashboard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDashboard]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const lastTrackRef = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (now - lastTrackRef.current < 3000) return;
    lastTrackRef.current = now;
    import('./services/api').then(({ analyticsAPI }) => {
      analyticsAPI.trackPageView({
        path: location.pathname,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent,
      }).catch(() => {});
    });
  }, [location.pathname]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    if (!loginPassword) {
      setLoginError("Password is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await settingsAPI.verifyPassword(loginPassword);
      if (!result?.token) {
        setLoginError("Invalid password");
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem("auth_token", result.token);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setShowDashboard(true);
      setLoginPassword("");
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError("Invalid password");
    }
    setIsSubmitting(false);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/work/${projectId}`);
  };

  return (
    <div className="relative min-h-screen bg-app-bg text-app-text transition-colors duration-300">
      {loading && <SystemLoader progress={loadingProgress} />}
      {!isNotFound && <WavyDotsBackground theme={theme} />}
      
      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowLoginModal(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              {/* Cyber Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-2xl blur-xl" />
              
              <div className="relative bg-card-bg border-2 border-neon-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.3)]">
                {/* Header */}
                <div className="relative border-b border-app-border p-6 bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-app-text/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="text-app-text-muted hover:text-neon-cyan transition-colors"
                      aria-label="Close login modal"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <h2 id="login-modal-title" className="text-2xl font-black text-app-text uppercase tracking-[0.2em] font-display">
                    System_Access
                  </h2>
                  <p className="text-[10px] text-neon-cyan uppercase tracking-[0.3em] mt-1 font-bold">
                    Authentication Required
                  </p>
                </div>

                {/* Body */}
                <div className="p-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Password Input */}
                    <div className="space-y-3">
                      <label className="text-[10px] text-app-text-muted uppercase tracking-[0.3em] font-bold block">
                        Access_Key
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="��������"
                          autoFocus
                          className="relative w-full bg-card-bg border-2 border-app-border focus:border-neon-cyan p-4 text-sm text-app-text uppercase tracking-widest font-mono focus:ring-0 transition-all placeholder:text-app-text-muted/30 rounded-lg"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {loginError && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                        </svg>
                        <span className="text-[10px] text-red-400 uppercase tracking-[0.2em] font-bold">{loginError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowLoginModal(false)}
                        className="flex-1 py-4 px-6 bg-transparent border-2 border-app-border text-app-text-muted hover:border-neon-cyan hover:text-neon-cyan font-black uppercase tracking-[0.2em] text-sm transition-all rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-100 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative py-4 px-6 flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              <span className="text-black font-black uppercase tracking-[0.2em] text-sm">
                                Auth...
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-black font-black uppercase tracking-[0.2em] text-sm">
                                Login
                              </span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </form>

                  {/* Footer Info */}
                  <div className="mt-8 pt-6 border-t border-app-border/30">
                    <div className="flex items-center justify-between text-[8px] text-app-text-muted uppercase tracking-widest">
                      <span>Security_Level: High</span>
                      <span className="text-neon-cyan">Encrypted_Session</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-purple/5 rounded-full blur-3xl -ml-16 -mb-16" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard */}
      <AnimatePresence>
        {showDashboard && isLoggedIn && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 bg-app-bg overflow-hidden"
          >
            <Suspense fallback={<SystemLoader progress={100} />}>
              <Dashboard onLogout={() => { setShowDashboard(false); setIsLoggedIn(false); }} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation - Left Sidebar */}
      {!isNotFound && !showDashboard && (
      <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-6 z-[100] lg:hidden p-3 bg-card-bg border border-app-border rounded-lg text-app-text hover:text-neon-cyan transition-all shadow-lg"
        aria-label="Toggle menu"
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <div className="portfolio-title">PORTFOLIO</div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="top-mode-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        <div className="nav-center">
          {[
            { path: "/", label: "HOME" },
            { path: "/work", label: "WORK" },
            { path: "/about", label: "ABOUT" },
            { path: "/contact", label: "CONTACT" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </button>
          ))}

          <div className="system-divider" />
          <button
            onClick={() => {
              if (isLoggedIn) {
                setShowDashboard(true);
              } else {
                setShowLoginModal(true);
              }
              setIsSidebarOpen(false);
            }}
            className="system-login-btn"
            aria-label="System login"
          >
            <span className="login-icon">?</span>
            <span className="system-login-text">SYSTEM_LOGIN</span>
          </button>
        </div>
      </nav>
      </>
      )}

      {/* Page Content */}
      {!isNotFound && !showDashboard && (
      <main className="relative z-10 pt-6 px-4 md:px-6 lg:pl-[calc(15vw+1rem)] lg:pr-8 pb-12 min-h-screen">
        <div className="w-full max-w-6xl px-2 sm:px-4">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomePage
                    onProjectClick={handleProjectClick}
                    onViewWork={() => navigate('/work')}
                    onContactClick={() => navigate('/contact')}
                  />
                </motion.div>
              } />
              <Route path="/work" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WorkPage 
                    projectId={null}
                    onProjectClick={handleProjectClick}
                    onBack={() => navigate('/work')}
                  />
                </motion.div>
              } />
              <Route path="/work/:projectId" element={
                <WorkPageRoute handleProjectClick={handleProjectClick} navigate={navigate} />
              } />
              <Route path="/about" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AboutPage />
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContactPage />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
      )}

      {/* NotFound Page - full screen, no sidebar */}
      {isNotFound && (
        <NotFoundPage />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
