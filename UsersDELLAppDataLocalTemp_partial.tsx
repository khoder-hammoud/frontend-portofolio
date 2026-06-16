import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData, Project, Skill, Settings as PortfolioSettings } from './DataContext';
import { useToast } from './hooks/useToast';
import { usePagination } from './hooks/usePagination';
import { ToastProvider } from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import ImageUpload from './components/ImageUpload';
import VideoUpload from './components/VideoUpload';
import MultiImageUpload from './components/MultiImageUpload';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import Pagination from './components/Pagination';
import { NotificationsPanel } from './components/NotificationsPanel';
import { 
  LayoutDashboard, 
  Briefcase, 
  Zap, 
  Settings, 
  Bell, 
  User, 
  LogOut, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Download,
  Terminal,
  Activity,
  Globe,
  Shield,
  Cpu,
  Cloud,
  Database,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
  X,
  MessageCircle,
  Code2,
  Quote,
  BarChart2,
  Layout,
  Server,
  Atom,
  Wind,
  ArrowLeft,
  Layers,
  Box,
  Package,
  Eye,
  EyeOff,
  Palette,
  Folder,
  ArrowUp,
  ArrowDown,
  FileText
} from 'lucide-react';
import { 
  SiReact, 
  SiVuedotjs, 
  SiAngular, 
  SiNextdotjs,
  SiNodedotjs,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiDocker,
  SiGit,
  SiGithub,
  SiGraphql,
  SiFirebase
} from 'react-icons/si';
import { WhatsAppIcon } from './components/Icons';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// Mock Data for Skills Radar
const SKILLS_RADAR_DATA = [
  { subject: 'FRONTEND', A: 120, fullMark: 150 },
  { subject: 'BACKEND', A: 98, fullMark: 150 },
  { subject: 'DEVOPS', A: 86, fullMark: 150 },
  { subject: 'SECURITY', A: 99, fullMark: 150 },
  { subject: 'CLOUD', A: 85, fullMark: 150 },
];

// Components
const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <motion.div
    whileHover={{ x: 5 }}
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all border-l-2 ${
      active 
        ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' 
        : 'border-transparent text-app-text-muted hover:text-app-text'
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </motion.div>
);

const StatCard = ({ label, value, subtext, trend, color }: any) => {
  return (
  <div className="p-8 bg-card-bg border border-app-border rounded-2xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 opacity-5"
      style={{ background: color === 'neon-cyan' ? '#00F2FF' : color === 'neon-purple' ? '#BC13FE' : 'var(--app-text)' }} />
    <h3 className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.2em] mb-4">{label}</h3>
    <div className="flex items-end gap-4 mb-2">
      <span className="text-5xl font-black tracking-tighter"
        style={{ color: color === 'neon-cyan' ? '#00F2FF' : color === 'neon-purple' ? '#BC13FE' : color === 'app-text' ? 'var(--app-text)' : color }}>
        {value}
      </span>
      {trend && (
        <span className="text-[10px] font-bold text-neon-cyan mb-2">
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] text-app-text-muted/50 uppercase tracking-widest">{subtext}</p>
  </div>
);};

const AnalyticsView = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [deviceStats, setDeviceStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { analyticsAPI } = await import('./services/api');
      const [summary, timeline, devices] = await Promise.all([
        analyticsAPI.getSummary(days),
        analyticsAPI.getTimeline(days),
        analyticsAPI.getDeviceStats(days)
      ]);
      
      setAnalyticsData(summary);
      setTimelineData(timeline);
      setDeviceStats(devices);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const seedData = async () => {
    try {
      if (!localStorage.getItem('auth_token')) return;
      const { analyticsAPI } = await import('./services/api');
      await analyticsAPI.seedData();
      loadAnalytics();
    } catch (err) {
      console.error('Failed to seed data:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const chartData = timelineData.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    traffic: item.pageViews,
    conversions: item.uniqueVisitors
  }));

  const deviceChartData = deviceStats ? [
    { name: 'Desktop', value: deviceStats.desktop, color: '#00f2ff' },
    { name: 'Mobile', value: deviceStats.mobile, color: '#bc13fe' },
    { name: 'Tablet', value: deviceStats.tablet, color: '#ffffff' }
  ] : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-[0.4em] mb-2 block">Dashboard</span>
          <h1 className="text-7xl font-black text-app-text uppercase tracking-tighter font-display">Analytics</h1>
        </div>
        <div className="flex gap-4">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-6 py-3 bg-card-bg border border-app-border text-[10px] text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
          <button 
            onClick={seedData}
            className="px-8 py-4 bg-neon-purple text-app-text font-black uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all"
          >
            Seed Data
          </button>
            </div>
          </div>

          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">Traffic_Flow_Monitor</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neon-cyan" />
                <span className="text-[10px] text-app-text-muted uppercase">Page_Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neon-purple" />
                <span className="text-[10px] text-app-text-muted uppercase">Visitors</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--app-text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--app-border)' }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#00F2FF" 
                  strokeWidth={3} 
                  dot={false} 
                  filter="drop-shadow(0 0 8px rgba(0,242,255,0.5))"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#BC13FE" 
                  strokeWidth={3} 
                  dot={false} 
                  filter="drop-shadow(0 0 8px rgba(188,19,254,0.5))"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
          <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em] mb-8">Device_Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceChartData}>
                <XAxis dataKey="name" stroke="var(--app-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--app-border)' }}
                  cursor={{ fill: 'var(--app-text-muted)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {deviceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-app-border">
            <div className="text-center">
              <span className="text-2xl font-black text-neon-cyan">{deviceStats?.desktop || 0}</span>
              <p className="text-[8px] text-app-text-muted uppercase tracking-widest mt-1">Desktop</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-black text-neon-purple">{deviceStats?.mobile || 0}</span>
              <p className="text-[8px] text-app-text-muted uppercase tracking-widest mt-1">Mobile</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-black text-app-text">{deviceStats?.tablet || 0}</span>
              <p className="text-[8px] text-app-text-muted uppercase tracking-widest mt-1">Tablet</p>
            </div>
          </div>
        </div>
      </div>
  );
};

const ICON_MAP: Record<string, any> = {
  // Lucide Icons (General)
  Code2, Layout, Server, Atom, Wind, Cpu, Cloud, Database, Globe, Shield, Terminal, Activity, Zap, Briefcase, Settings, Mail, Linkedin, Github, X, Layers, Box, Package,
  
  // Tech Icons (Most Common)
  React: SiReact,
  Vue: SiVuedotjs,
  Angular: SiAngular,
  NextJS: SiNextdotjs,
  NodeJS: SiNodedotjs,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  TailwindCSS: SiTailwindcss,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Python: SiPython,
  Docker: SiDocker,
  Git: SiGit,
  GitHubIcon: SiGithub,
  GraphQL: SiGraphql,
  Firebase: SiFirebase
};

const SKILL_COLOR_MAP: Record<string, string> = {
  'neon-cyan': '#00F2FF',
  'neon-purple': '#BC13FE',
  'red-500': '#EF4444',
  'orange-500': '#F97316',
  'yellow-500': '#EAB308',
  'green-500': '#22C55E',
  'emerald-500': '#10B981',
  'teal-500': '#14B8A6',
  'blue-500': '#3B82F6',
  'purple-500': '#A855F7',
  'pink-500': '#EC4899',
  'rose-500': '#F43F5E',
  'app-text': 'var(--app-text)',
};

const STATUS_COLOR_MAP: Record<string, string> = {
  approved: '#00F2FF',
  rejected: '#EF4444',
  pending: '#BC13FE',
};

const ProjectsView = ({ onSuccess, onError }: { onSuccess: (msg: string) => void; onError: (msg: string) => void }) => {
  const { projects, deleteProject, addProject, updateProject, refreshData } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    subtitle: '',
    description: '',
    image: '/me.png.jpgseed/new/800/600',
    images: [],
    demoVideo: '',
    githubUrl: '',
    liveUrl: '',
    overview: '',
    features: [],
    stack: [],
    highlight: false,
    showOnHome: false
  });

  const [currentStackItem, setCurrentStackItem] = useState<{ name: string; icon: string; color: string }>({ name: '', icon: 'Code2', color: '#00F2FF' });
  const [currentFeature, setCurrentFeature] = useState({ text: '', icon: '⚡' });

  // Filter and search projects
  const filteredProjects = projects
    .filter(project => {
      // Search filter - enhanced to include stack
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = project.title.toLowerCase().includes(searchLower) ||
                           project.subtitle.toLowerCase().includes(searchLower) ||
                           project.description.toLowerCase().includes(searchLower) ||
                           project.stack.some(tech => tech.name.toLowerCase().includes(searchLower)) ||
                           (project.overview && project.overview.toLowerCase().includes(searchLower));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'highlighted' && project.highlight) ||
                           (statusFilter === 'normal' && !project.highlight);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return projects.indexOf(b) - projects.indexOf(a);
      if (sortBy === 'oldest') return projects.indexOf(a) - projects.indexOf(b);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProjects,
    goToPage,
    itemsPerPage
  } = usePagination({
    items: filteredProjects,
    itemsPerPage: 10
  });

  const openAddModal = () => {
    setEditingProjectId(null);
    setNewProject({ 
      title: '', 
      subtitle: '', 
      description: '', 
      image: '/me.png.jpgseed/new/800/600', 
      images: [],
      demoVideo: '', 
      githubUrl: '', 
      liveUrl: '',
      overview: '', 
      features: [], 
      stack: [],
      highlight: false,
      showOnHome: false
    });
    setShowAddModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProjectId(project.id);
    setNewProject({
      ...project,
      images: project.images || [],
      demoVideo: project.demoVideo || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      highlight: project.highlight || false,
      showOnHome: project.showOnHome || false
    });
    setShowAddModal(true);
  };

  const addStackItem = () => {
    if (currentStackItem.name) {
      setNewProject({
        ...newProject,
        stack: [...(newProject.stack || []), { 
          name: currentStackItem.name, 
          icon: ICON_MAP[currentStackItem.icon] || Code2, 
          color: currentStackItem.color 
        }]
      });
      setCurrentStackItem({ name: '', icon: 'Code2', color: '#00F2FF' });
    }
  };

  const removeStackItem = (index: number) => {
    const updatedStack = [...(newProject.stack || [])];
    updatedStack.splice(index, 1);
    setNewProject({ ...newProject, stack: updatedStack });
  };

  const addFeature = () => {
    if (currentFeature.text) {
      setNewProject({
        ...newProject,
        features: [...(newProject.features || []), { 
          text: currentFeature.text, 
          icon: currentFeature.icon 
        }]
      });
      setCurrentFeature({ text: '', icon: '⚡' });
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...(newProject.features || [])];
    updatedFeatures.splice(index, 1);
    setNewProject({ ...newProject, features: updatedFeatures });
  };

  const handleAdd = async () => {
    if (newProject.title && newProject.subtitle) {
      try {
        const project: Project = {
          id: editingProjectId || Math.random().toString(36).substr(2, 9),
          title: newProject.title!,
          subtitle: newProject.subtitle!,
          description: newProject.description || '',
          image: newProject.image || '/me.png.jpgseed/new/800/600',
          images: newProject.images || [],
          demoVideo: newProject.demoVideo || '',
          githubUrl: newProject.githubUrl || '',
          liveUrl: newProject.liveUrl || '',
          overview: newProject.overview || '',
          features: newProject.features || [],
          stack: newProject.stack || [],
          highlight: newProject.highlight || false,
          showOnHome: newProject.showOnHome || false
        };

        if (editingProjectId) {
          await updateProject(editingProjectId, project);
          onSuccess('Project updated successfully!');
        } else {
          await addProject(project);
          onSuccess('Project added successfully!');
        }
        
        setShowAddModal(false);
        setNewProject({ 
          title: '', 
          subtitle: '', 
          description: '', 
          image: '/me.png.jpgseed/new/800/600', 
          images: [],
          demoVideo: '', 
          githubUrl: '', 
          liveUrl: '', 
          overview: '', 
          features: [], 
          stack: [],
          highlight: false,
          showOnHome: false
        });
        setEditingProjectId(null);
      } catch (err) {
        onError('Failed to save project. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      await deleteProject(id);
      onSuccess('Project deleted successfully!');
    } catch (err) {
      onError('Failed to delete project. Please try again.');
    }
  };

  const handleMoveUp = async (projectId: string) => {
    const idx = filteredProjects.findIndex(p => p.id === projectId);
    if (idx <= 0) return;
    const reordered = [...filteredProjects];
    [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
    try {
      const { projectsAPI } = await import('./services/api');
      await projectsAPI.reorder(reordered.map((p, i) => ({ id: p.id, priority: (reordered.length - i) * 10 })));
      refreshData();
      onSuccess('Project moved up');
    } catch (e) { onError('Failed to reorder'); }
  };

  const handleMoveDown = async (projectId: string) => {
    const idx = filteredProjects.findIndex(p => p.id === projectId);
    if (idx < 0 || idx >= filteredProjects.length - 1) return;
    const reordered = [...filteredProjects];
    [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
    try {
      const { projectsAPI } = await import('./services/api');
      await projectsAPI.reorder(reordered.map((p, i) => ({ id: p.id, priority: (reordered.length - i) * 10 })));
      refreshData();
      onSuccess('Project moved down');
    } catch (e) { onError('Failed to reorder'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.4em] mb-2 block">Manage Projects</span>
          <h1 className="text-7xl font-black text-app-text uppercase tracking-tighter font-display">Projects</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={openAddModal}
            className="px-8 py-4 bg-neon-purple text-app-text font-black uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all"
          >
            Add New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard label="Total_Nodes" value={projects.length} trend="+4 SINCE LAST CYCLE" subtext="trending_up" color="neon-cyan" />
        <StatCard label="Active_Protocols" value={filteredProjects.length} trend={`${filteredProjects.length} VISIBLE`} subtext="data_usage" color="neon-purple" />
        <StatCard label="Storage_Reserve" value="84%" trend="DATABASE 1.2TB REMAINING" subtext="database" color="app-text" />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="SEARCH_PROJECTS..."
          />
        </div>
        <div className="flex gap-4">
          <FilterDropdown
            label="Status"
            options={[
              { value: 'all', label: 'All' },
              { value: 'highlighted', label: 'Highlighted' },
              { value: 'normal', label: 'Normal' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Sort"
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'name', label: 'Name' }
            ]}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      <div className="bg-card-bg border border-app-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-app-border flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-cyan" />
            <div className="w-3 h-3 rounded-full bg-neon-purple" />
            <span className="text-[10px] text-app-text-muted uppercase tracking-widest ml-4">
              Project_Index.log ({filteredProjects.length} results)
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-app-border text-[10px] text-app-text-muted uppercase tracking-[0.2em]">
              <th className="px-8 py-6 font-black">Project_Name</th>
              <th className="px-8 py-6 font-black">Status</th>
              <th className="px-8 py-6 font-black">Tech_Stack</th>
              <th className="px-8 py-6 font-black">Last_Updated</th>
              <th className="px-8 py-6 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center gap-4 text-app-text-muted">
                    <Search size={48} className="opacity-20" />
                    <p className="text-xs uppercase tracking-widest">No projects found</p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[10px] text-neon-cyan uppercase tracking-wider hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>