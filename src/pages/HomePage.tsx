import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { TypingText } from "../components/TypingText";
import { ProfileImage } from "../components/ProfileImage";

import { ProjectCarousel3D } from "../components/ProjectCarousel3D";
import { ReviewInfiniteScroll } from "../components/ReviewInfiniteScroll";
import { useData } from "../DataContext";
import SEO from "../components/SEO";

interface HomePageProps {
  onProjectClick: (projectId: string) => void;
  onViewWork: () => void;
  onContactClick: () => void;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
  </div>
);

const HomePage = ({ onProjectClick, onViewWork, onContactClick }: HomePageProps) => {
  const { projects, skills, settings, testimonials, addTestimonial, loading } = useData();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: '', text: '', avatar: 'https://i.pravatar.cc/150?u=new' });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Filter only approved testimonials
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');
  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (newReview.name && newReview.text) {
      addTestimonial({
        ...newReview,
        id: crypto.randomUUID(),
        avatar: `https://i.pravatar.cc/150?u=${newReview.name}`,
        rating: rating
      });
      setNewReview({ name: '', role: '', text: '', avatar: 'https://i.pravatar.cc/150?u=new' });
      setRating(5);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowReviewForm(false);
      }, 3000);
    }
  };

  const featuredProjects = projects.filter(p => p.showOnHome || p.highlight).slice(0, 6);
  
  // If no featured projects, show first 6 projects
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SEO
        title="ARCHITECT_NULL | Full Stack Developer Portfolio"
        description="Full Stack Developer specializing in Industrial Cyber-Brutalism. Building high-performance, modular, and data-driven web experiences."
        keywords="full stack developer, web developer, react, node.js, typescript, mongodb, portfolio"
        url="/"
      />
      
      {/* Professional Hero Section */}
      <section className="mb-32 pt-12 flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-grow text-center lg:text-left"
        >
          <div className="relative mb-12">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] font-display">
              <div className="flex flex-col">
                <div className="relative inline-block group">
                  <span className="text-gradient block scanline-text">KHODER HAMMOUD</span>
                  <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/30 group-hover:border-neon-cyan transition-colors" />
                  <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-neon-purple/30 group-hover:border-neon-purple transition-colors" />
                  <div className="absolute -inset-4 bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5 -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-app-text-muted font-medium tracking-widest uppercase mb-12 max-w-2xl leading-relaxed mx-auto lg:mx-0 min-h-[3em]">
            <TypingText text={settings.technicalBio} />
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewWork}
              className="group relative px-8 py-4 bg-transparent border border-neon-cyan rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
            >
              <div className="absolute inset-0 bg-neon-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative text-neon-cyan font-bold uppercase tracking-widest flex items-center gap-3">
                View Projects <ArrowRight size={18} />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContactClick}
              className="group relative px-8 py-4 bg-transparent border border-app-border rounded-lg overflow-hidden transition-all duration-300 hover:border-app-text-muted"
            >
              <span className="relative text-app-text-muted group-hover:text-app-text font-bold uppercase tracking-widest flex items-center gap-3">
                Contact Me <Mail size={18} />
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="relative shrink-0"
        >
          {/* خلفية نيون خفيفة */}
          <div className="absolute -inset-8 bg-gradient-to-tr from-neon-cyan to-neon-purple opacity-8 blur-3xl rounded-full" />
          
          {/* Neon Pulse — drop-shadow يتتبع حدود الجسم */}
          <div className="relative w-[20rem] h-[20rem] md:w-[24rem] md:h-[24rem] lg:w-[28rem] lg:h-[28rem] flex items-center justify-center z-10 animate-neonPulse">
            <ProfileImage className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" />
          </div>
        </motion.div>
      </section>

      {/* 3D Projects Carousel */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-sm font-black text-app-text uppercase tracking-[0.3em] font-display">Featured Projects</h2>
          <div className="h-px flex-grow bg-app-border ml-8" />
          <button
            onClick={onViewWork}
            className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : displayProjects.length > 0 ? (
          <ProjectCarousel3D projects={displayProjects} onProjectClick={onProjectClick} />
        ) : (
          <div className="text-center py-24 text-app-text-muted">
            <p className="text-xs uppercase tracking-widest">No featured projects yet</p>
          </div>
        )}
      </section>

      {/* Skills Progress Rings */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-sm font-black text-app-text uppercase tracking-[0.3em] font-display">Skills & Technologies</h2>
          <div className="h-px flex-grow bg-app-border ml-8" />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : skills.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {skills.map((skill, i) => {
              const SkillIcon = skill.icon;
              const skillColor = skill.colorHex || `var(--${skill.color})`;
              const r = 54;
              const circumference = 2 * Math.PI * r;
              const offset = circumference - (skill.level / 100) * circumference;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex flex-col items-center group"
                >
                  {/* Circular Progress */}
                  <div className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] mb-5">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                      <circle
                        cx="64" cy="64" r={r}
                        fill="none"
                        stroke="var(--app-border)"
                        strokeWidth="6"
                      />
                      <motion.circle
                        cx="64" cy="64" r={r}
                        fill="none"
                        stroke={skillColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: offset }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0 0 6px ${skillColor})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <SkillIcon size={32} style={{ color: skillColor }} />
                      <span className="text-[10px] font-black text-app-text mt-1 tabular-nums">{skill.level}%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-black text-app-text uppercase tracking-wider text-center">{skill.label}</h3>
                  {skill.sublabel && (
                    <p className="text-[8px] text-app-text-muted uppercase tracking-[0.2em] mt-1 text-center max-w-[140px]">{skill.sublabel}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-app-text-muted">
            <p className="text-xs uppercase tracking-widest">No skills yet</p>
          </div>
        )}
      </section>

      {/* Reviews Infinite Scroll */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-black text-app-text uppercase tracking-[0.3em] font-display">Reviews</h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest border border-neon-cyan/30 px-3 py-1 rounded hover:bg-neon-cyan/10 transition-colors"
            >
              {showReviewForm ? "Close" : "Add Review"}
            </button>
          </div>
          <div className="h-px flex-grow bg-app-border ml-8" />
        </div>

        {showReviewForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 rounded-2xl bg-card-bg border border-neon-cyan/30 max-w-2xl mx-auto"
          >
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center text-neon-cyan mx-auto mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-app-text uppercase tracking-tighter mb-2">Review_Submitted</h3>
                <p className="text-[10px] text-app-text-muted uppercase tracking-widest">Thank you for your feedback. It has been added to the system.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReview.name}
                      onChange={e => setNewReview({...newReview, name: e.target.value})}
                      className="w-full bg-card-bg border border-app-border p-3 text-xs text-app-text tracking-widest focus:border-neon-cyan focus:ring-0 outline-none"
                      placeholder="E.G. JOHN DOE"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Your Role / Company</label>
                    <input 
                      type="text" 
                      value={newReview.role}
                      onChange={e => setNewReview({...newReview, role: e.target.value})}
                      className="w-full bg-card-bg border border-app-border p-3 text-xs text-app-text tracking-widest focus:border-neon-cyan focus:ring-0 outline-none"
                      placeholder="E.G. CEO AT TECHCORP"
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Your Feedback</label>
                  <textarea 
                    required
                    value={newReview.text}
                    onChange={e => setNewReview({...newReview, text: e.target.value})}
                    className="w-full bg-card-bg border border-app-border p-3 text-xs text-app-text tracking-widest focus:border-neon-cyan focus:ring-0 outline-none min-h-[100px]"
                    placeholder="TELL US ABOUT YOUR EXPERIENCE..."
                  />
                </div>
                
                {/* Star Rating */}
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl transition-all hover:scale-110"
                      >
                        <span className={`${
                          star <= (hoverRating || rating)
                            ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]'
                            : 'text-app-border'
                        }`}>
                          ★
                        </span>
                      </button>
                    ))}
                    <span className="ml-4 text-sm text-app-text-muted self-center">
                      {rating} / 5
                    </span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="px-6 py-3 bg-neon-cyan text-black font-bold uppercase tracking-widest text-[10px] rounded hover:shadow-[0_0_15px_rgba(0,242,255,0.5)] transition-all"
                >
                  Submit Review
                </button>
              </form>
            )}
          </motion.div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : approvedTestimonials.length > 0 ? (
          <ReviewInfiniteScroll testimonials={approvedTestimonials} />
        ) : (
          <div className="text-center py-24 text-app-text-muted">
            <p className="text-xs uppercase tracking-widest">No reviews yet</p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default HomePage;
