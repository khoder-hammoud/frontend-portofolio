import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { PlayingCard } from "../components/PlayingCard";
import { CardDeckControls } from "../components/CardDeckControls";
import { CardSuitFilter } from "../components/CardSuitFilter";
import ProjectMediaGallery from "../components/ProjectMediaGallery";
import SearchBar from "../components/SearchBar";
import { useData } from "../DataContext";
import SEO from "../components/SEO";
import { useProjectSearch, useSearchSuggestions } from "../hooks/useSearch";
import TagFilter from "../components/TagFilter";
import { useState, useEffect } from "react";

interface WorkPageProps {
  projectId: string | null;
  onProjectClick: (id: string) => void;
  onBack: () => void;
}

const WorkPage = ({ 
  projectId, 
  onProjectClick = () => {},
  onBack = () => {}
}: WorkPageProps) => {
  const { projects } = useData();
  const project = projects.find(p => p.id === projectId);
  const [shuffledProjects, setShuffledProjects] = useState(projects);
  const [viewMode, setViewMode] = useState<'grid' | 'deck' | 'stacked'>('grid');
  const [selectedSuit, setSelectedSuit] = useState('all');
  const [showSearch, setShowSearch] = useState(false);

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    results: searchResults,
    isSearching
  } = useProjectSearch(projects);

  // Search suggestions
  const { suggestions } = useSearchSuggestions(projects, ['title', 'stack', 'category']);

  useEffect(() => {
    setShuffledProjects(projects);
  }, [projects]);

  const handleShuffle = () => {
    const shuffled = [...shuffledProjects].sort(() => Math.random() - 0.5);
    setShuffledProjects(shuffled);
  };

  const filteredProjects = searchQuery || selectedTags.length > 0 
    ? searchResults.map(result => result.item)
    : shuffledProjects.filter(p => {
        if (selectedSuit === 'all') return true;
        if (selectedSuit === 'featured') return p.highlight;
        return true;
      });

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearch(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  if (!project) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="pt-12"
      >
      <SEO
        title="Projects | Khoder Hammoud Portfolio"
        description="A collection of projects ranging from complex backend architectures to immersive frontend experiences."
        keywords="projects, portfolio, web development, full stack projects"
        url="/work"
      />
      
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-app-text mb-4 tracking-tighter uppercase font-display">
          <span className="text-neon-purple">PROJECTS</span>
        </h1>
        <p className="text-lg text-app-text-muted leading-relaxed max-w-2xl mb-8">
          A collection of projects I've built, ranging from complex backend architectures to immersive frontend experiences.
        </p>
        
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            isLoading={isSearching}
            resultCount={searchResults.length}
            showShortcuts={true}
          />
          
          {/* Advanced Tag Filter */}
          <div className="mt-4">
            <TagFilter
              items={filteredProjects}
              selectedTags={selectedTags}
              onTagsChange={(tags) => setSelectedTags(tags)}
              showCategories={true}
              showTagCloud={true}
              maxTags={30}
              placeholder="Filter projects by tags..."
              className="w-full"
            />
          </div>
          
          {/* Active Filters Display */}
          {(searchQuery || selectedTags.length > 0) && (
            <div className="mt-4 flex items-center gap-4">
              <div className="text-xs text-app-text-muted">
                Active filters:
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-2 py-1 text-xs bg-neon-purple/20 border border-neon-purple text-neon-purple rounded">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded">
                    {tag}
                  </span>
                ))}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                  className="px-2 py-1 text-xs bg-app-border/50 text-app-text-muted hover:text-app-text transition-colors rounded"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
        
        <CardSuitFilter 
          selectedSuit={selectedSuit}
          onSuitChange={setSelectedSuit}
        />
        
        <CardDeckControls 
          onShuffle={handleShuffle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

        {/* Playing Cards Grid Layout */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🃏</div>
            <h3 className="text-2xl font-black text-app-text mb-2 uppercase">
              No Cards Found
            </h3>
            <p className="text-app-text-muted">
              Try selecting a different filter or shuffle the deck
            </p>
          </motion.div>
        ) : viewMode === 'stacked' ? (
          /* Stacked Cards View */
          <div className="relative w-full min-h-[500px] flex items-start justify-center mb-24 pt-2">
            <div className="relative w-full max-w-[clamp(320px,85vw,480px)] h-[600px] lg:h-[700px]">
              {filteredProjects.slice(0, 8).map((p, index) => {
                const totalCards = Math.min(filteredProjects.length, 8);
                const centerIndex = (totalCards - 1) / 2;
                const distanceFromCenter = index - centerIndex;
                
                // زوايا أصغر وأكثر قابلية للقراءة
                const rotation = distanceFromCenter * 8; // تقليل من 12 إلى 8
                
                // إزاحة أفقية وعمودية محسّنة
                const xOffset = distanceFromCenter * 30; // تقليل من 40 إلى 30
                const yOffset = Math.abs(distanceFromCenter) * 15; // تقليل من 25 إلى 15
                
                const zIndex = index;
                
                return (
                  <motion.div
                    key={p.id}
                    initial={{ 
                      opacity: 0, 
                      y: -100,
                      x: 0,
                      rotateZ: rotation - 30
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: yOffset,
                      x: xOffset,
                      rotateZ: rotation
                    }}
                    transition={{ 
                      duration: 0.7, 
                      delay: index * 0.12,
                      type: "spring",
                      stiffness: 80,
                      damping: 15
                    }}
                    whileHover={{
                      y: yOffset - 60, // زيادة الارتفاع عند hover
                      x: xOffset,
                      rotateZ: 0,
                      scale: 1.12, // زيادة التكبير
                      zIndex: 100,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      position: 'absolute',
                      top: '15%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: zIndex,
                      width: '100%',
                    }}
                    className="cursor-pointer"
                    tabIndex={0}
                    role="button"
                    aria-label={`${p.title} project card`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onProjectClick(p.id);
                      }
                    }}
                  >
                    <PlayingCard 
                      title={p.title}
                      subtitle={p.subtitle}
                      description={p.description}
                      image={p.image}
                      demoVideo={p.demoVideo}
                      highlight={p.highlight}
                      stack={p.stack}
                      onClick={() => onProjectClick(p.id)}
                    />
                  </motion.div>
                );
              })}
            </div>
            
            {/* عداد الكاردات */}
            {filteredProjects.length > 8 && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-2 bg-card-bg border border-app-border rounded-lg">
                <p className="text-xs text-app-text-muted uppercase tracking-widest">
                  Showing 8 of {filteredProjects.length} cards
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={`mb-24 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
              : 'flex flex-wrap justify-center gap-8'
          }`}>
            {filteredProjects.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className={viewMode === 'deck' ? 'w-80' : ''}
              >
                <PlayingCard 
                  title={p.title}
                  subtitle={p.subtitle}
                  description={p.description}
                  image={p.image}
                  demoVideo={p.demoVideo}
                  highlight={p.highlight}
                  stack={p.stack}
                  onClick={() => onProjectClick(p.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-12"
    >
      <SEO
        title={`${project.title} | Khoder Hammoud Portfolio`}
        description={project.description}
        keywords={`${project.title}, ${project.stack.map(s => s.name).join(', ')}, project`}
        image={project.image}
        url={`/work/${project.id}`}
        type="article"
      />
      
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        whileHover={{ x: -5 }}
        className="flex items-center gap-2 text-neon-cyan text-xs font-bold uppercase tracking-widest mb-8 group"
      >
        <ArrowRight size={16} className="rotate-180 group-hover:text-app-text transition-colors" />
        <span className="group-hover:text-app-text transition-colors">Back</span>
      </motion.button>

      {/* Project Title */}
      <div className="mb-8">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-app-text mb-2 tracking-tighter uppercase font-display"
        >
          {project.title}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-app-text-muted font-medium"
        >
          {project.subtitle}
        </motion.p>
      </div>

      {/* Media Gallery */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <ProjectMediaGallery
          mainImage={project.image}
          images={project.images}
          video={project.demoVideo}
          title={project.title}
        />
      </motion.div>

      {/* Technologies */}
      <section className="mb-16">
        <h2 className="text-sm font-black text-app-text uppercase tracking-[0.3em] mb-8 font-display">Technologies</h2>
        <div className="flex flex-wrap gap-8">
          {project.stack.map((tech, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-card-bg border border-app-border group-hover:border-app-text-muted transition-colors">
                <tech.icon className={tech.color} size={20} />
              </div>
              <span className="text-sm font-bold text-app-text-muted">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section className="mb-16">
        <h2 className="text-sm font-black text-app-text uppercase tracking-[0.3em] mb-6 font-display">Overview</h2>
        <p className="text-app-text-muted leading-relaxed max-w-4xl text-lg">
          {project.overview}
        </p>
      </section>

      {/* Key Features */}
      <section className="mb-16">
        <h2 className="text-sm font-black text-app-text uppercase tracking-[0.3em] mb-6 font-display">Key Features</h2>
        <ul className="space-y-6">
          {project.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-4 text-app-text-muted">
              <span className="text-xl">{feature.icon}</span>
              <span className="text-lg">{feature.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-6 mt-12 mb-24">
        {project.liveUrl ? (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(0,242,255,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-transparent border border-neon-cyan rounded-lg text-neon-cyan font-bold uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            View Live Site <ArrowRight size={18} />
          </motion.a>
        ) : (
          <motion.button
            disabled
            className="px-8 py-4 bg-transparent border border-app-border rounded-lg text-app-text-muted font-bold uppercase tracking-widest flex items-center gap-3 opacity-50 cursor-not-allowed"
            title="Live site URL not configured"
          >
            View Live Site <ArrowRight size={18} />
          </motion.button>
        )}
        
        {project.githubUrl ? (
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(188,19,254,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-transparent border border-neon-purple rounded-lg text-neon-purple font-bold uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            View Code <Github size={18} />
          </motion.a>
        ) : (
          <motion.button
            disabled
            className="px-8 py-4 bg-transparent border border-app-border rounded-lg text-app-text-muted font-bold uppercase tracking-widest flex items-center gap-3 opacity-50 cursor-not-allowed"
            title="GitHub URL not configured"
          >
            View Code <Github size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default WorkPage;
