import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { ProfileImage } from "../components/ProfileImage";
import { useData } from "../DataContext";
import SEO from "../components/SEO";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
  </div>
);

const AboutPage = () => {
  const { settings, stats, experience, loading } = useData();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-12"
    >
      <SEO
        title="About | Khoder Hammoud Portfolio"
        description={settings.aboutMe}
        keywords="about, full stack developer, experience, skills, background"
        url="/about"
        type="profile"
      />
      
      {/* About Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-app-border mb-12 group shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-card-bg">
        <div className="flex flex-col md:flex-row items-center gap-12 p-12">
          <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-neon-cyan shadow-[0_0_20px_rgba(0,242,255,0.3)] flex-shrink-0 bg-card-bg flex items-center justify-center">
            <ProfileImage 
              className="w-full h-full object-cover object-top transition-all duration-500" 
              fallbackSize="w-12 h-12"
            />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-app-text mb-4 tracking-tighter uppercase font-display">
              ABOUT <span className="text-neon-cyan">ME</span>
            </h1>
            <p className="text-lg text-app-text-muted leading-relaxed max-w-2xl">
              {settings.aboutMe}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : stats.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-xl bg-card-bg border border-app-border hover:border-neon-cyan transition-colors text-center">
              <h3 className="text-3xl font-black text-app-text mb-1">{stat.value}</h3>
              <p className="text-[10px] text-app-text-muted uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Experience Timeline */}
      <section className="mb-16">
        <h2 className="text-sm font-black text-app-text uppercase tracking-[0.3em] mb-12">Experience</h2>
        {loading ? (
          <LoadingSpinner />
        ) : experience.length > 0 ? (
        <div className="space-y-12">
          {experience.map((exp) => (
            <div key={exp.id} className="relative pl-8 border-l border-app-border group">
              <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)] group-hover:scale-150 transition-transform" />
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-app-text uppercase tracking-tight">{exp.role}</h3>
                <span className="text-xs font-bold text-neon-purple uppercase tracking-widest">{exp.period}</span>
              </div>
              <h4 className="text-sm font-bold text-app-text-muted mb-4 uppercase tracking-wider">{exp.company}</h4>
              <p className="text-app-text-muted leading-relaxed max-w-3xl">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      </section>

      {/* Social Links */}
      <div className="flex flex-wrap gap-6 mt-12 mb-24">
        {settings.cvDownloadUrl ? (
          <motion.a
            href={settings.cvDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(0,242,255,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-transparent border border-neon-cyan rounded-lg text-neon-cyan font-bold uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-neon-cyan/10"
          >
            Download CV <ArrowRight size={18} />
          </motion.a>
        ) : (
          <motion.button
            disabled
            className="px-8 py-4 bg-transparent border border-app-border rounded-lg text-app-text-muted font-bold uppercase tracking-widest flex items-center gap-3 opacity-50 cursor-not-allowed"
            title="CV link not configured in Dashboard Settings"
          >
            Download CV <ArrowRight size={18} />
          </motion.button>
        )}
        
        <div className="flex items-center gap-4">
          <a href={settings.githubUri} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-card-bg border border-app-border hover:text-neon-cyan transition-colors cursor-pointer">
            <Github size={24} />
          </a>
          <a href={settings.linkedinUri} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-card-bg border border-app-border hover:text-neon-cyan transition-colors cursor-pointer">
            <Linkedin size={24} />
          </a>
          {settings.whatsappNumber && (
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-card-bg border border-app-border hover:text-neon-cyan transition-colors cursor-pointer">
              <MessageCircle size={24} />
            </a>
          )}
          <div className="p-4 rounded-lg bg-card-bg border border-app-border hover:text-neon-cyan transition-colors cursor-pointer">
            <Mail size={24} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;