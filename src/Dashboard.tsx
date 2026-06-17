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
  FileText,
  Link,
  Check
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
    <Icon size={22} />
    <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
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
    image: '',
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
      image: '', 
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
    const errors: string[] = [];
    if (!newProject.title) errors.push('Title is required.');
    if (!newProject.subtitle) errors.push('Subtitle is required.');
    else if (newProject.subtitle.length < 5) errors.push('Subtitle must be at least 5 characters.');
    if (!newProject.description) errors.push('Description is required.');
    else if (newProject.description.length < 10) errors.push('Description must be at least 10 characters.');
    if (errors.length > 0) { onError(errors.join(' ')); return; }

    if (newProject.title && newProject.subtitle) {
      try {
        const project: Project = {
          id: editingProjectId || Math.random().toString(36).substr(2, 9),
          title: newProject.title!,
          subtitle: newProject.subtitle!,
          description: newProject.description || '',
          image: newProject.image || '',
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
          image: '', 
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
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx <= 0) return;
    const reordered = [...projects];
    [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
    try {
      const { projectsAPI } = await import('./services/api');
      await projectsAPI.reorder(reordered.map((p, i) => ({ id: p.id, priority: (reordered.length - i) * 10 })));
      refreshData();
      onSuccess('Project moved up');
    } catch (_) { onError('Failed to reorder'); }
  };

  const handleMoveDown = async (projectId: string) => {
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx < 0 || idx >= projects.length - 1) return;
    const reordered = [...projects];
    [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
    try {
      const { projectsAPI } = await import('./services/api');
      await projectsAPI.reorder(reordered.map((p, i) => ({ id: p.id, priority: (reordered.length - i) * 10 })));
      refreshData();
      onSuccess('Project moved down');
    } catch (_) { onError('Failed to reorder'); }
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
              </tr>
            ) : (
              paginatedProjects.map((p, index) => (
                <tr key={p.id} className="group hover:bg-card-bg/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-card-bg rounded border border-app-border overflow-hidden">
                        <img src={p.image || null} alt="" className="w-full h-full object-cover opacity-50" />
                      </div>
                      <span className="text-xs font-black text-app-text uppercase tracking-widest">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 text-[8px] font-black rounded border border-neon-cyan text-neon-cyan bg-neon-cyan/10`}>
                      LIVE
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      {p.stack.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] font-mono text-neon-cyan">{s.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] text-app-text-muted font-mono">{p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0].replace(/-/g, '.') : p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0].replace(/-/g, '.') : '--'}</td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3 text-app-text-muted items-center">
                      <ArrowUp 
                        size={14} 
                        onClick={() => handleMoveUp(p.id)}
                        className="hover:text-neon-cyan cursor-pointer transition-colors"
                      />
                      <ArrowDown 
                        size={14} 
                        onClick={() => handleMoveDown(p.id)}
                        className="hover:text-neon-cyan cursor-pointer transition-colors"
                      />
                      <div className="w-px h-4 bg-app-border mx-1" />
                      <Edit 
                        size={16} 
                        onClick={() => openEditModal(p)}
                        className="hover:text-neon-cyan cursor-pointer transition-colors"
                        aria-label={`Edit ${p.title} project`}
                      />
                      <Trash2 
                        size={16} 
                        onClick={() => handleDelete(p.id)}
                        className="hover:text-red-500 cursor-pointer transition-colors"
                        aria-label={`Delete ${p.title} project`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredProjects.length}
        />
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              key={editingProjectId || 'new-project'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl bg-card-bg border border-app-border rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-6 border-b border-app-border flex items-center justify-between bg-card-bg">
                <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">
                  {editingProjectId ? 'Edit Project' : 'Add Project'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-app-text-muted hover:text-app-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Title</label>
                    <input 
                      type="text" 
                      value={newProject.title}
                      onChange={e => setNewProject({...newProject, title: e.target.value})}
                      className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                      placeholder="E.G. NEON_VALLEY"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Subtitle / Category</label>
                    <input 
                      type="text" 
                      value={newProject.subtitle}
                      onChange={e => setNewProject({...newProject, subtitle: e.target.value})}
                      className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                      placeholder="E.G. WEB_APP"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                    placeholder="BRIEF OVERVIEW OF THE PROJECT..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Full Description</label>
                  <textarea 
                    value={newProject.overview}
                    onChange={e => setNewProject({...newProject, overview: e.target.value})}
                    className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                    placeholder="FULL PROJECT DESCRIPTION..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <ImageUpload
                    value={newProject.image || ''}
                    onChange={(url) => setNewProject({...newProject, image: url})}
                    label="Project_Image (Main)"
                  />
                </div>
                
                {/* Additional Images - ImageUpload Version */}
                <div className="space-y-4 pt-4 border-t-2 border-neon-cyan/30 bg-neon-cyan/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-neon-cyan uppercase tracking-widest font-black">
                      🖼️ Additional Images (Optional - Max 5)
                    </label>
                    <span className="text-[8px] text-app-text-muted uppercase tracking-widest">
                      {(newProject.images?.filter(Boolean).length || 0)} / 5 Added
                    </span>
                  </div>
                  <p className="text-[8px] text-app-text-muted uppercase tracking-widest">
                    Add up to 5 extra images for gallery view
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <ImageUpload
                        key={index}
                        value={(newProject.images && newProject.images[index]) || ''}
                        onChange={(url) => {
                          const newImages = [...(newProject.images || [])];
                          if (url) {
                            newImages[index] = url;
                          } else {
                            newImages.splice(index, 1);
                          }
                          const filtered = newImages.filter(Boolean);
                          setNewProject({...newProject, images: filtered});
                        }}
                        label={`Additional Image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <VideoUpload
                    value={newProject.demoVideo || ''}
                    onChange={(url) => setNewProject({...newProject, demoVideo: url})}
                    label="Demo_Video"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Live Site URL</label>
                    <input 
                      type="text" 
                      value={newProject.liveUrl}
                      onChange={e => setNewProject({...newProject, liveUrl: e.target.value})}
                      className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                      placeholder="HTTPS://EXAMPLE.COM"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Github URL</label>
                    <input 
                      type="text" 
                      value={newProject.githubUrl}
                      onChange={e => setNewProject({...newProject, githubUrl: e.target.value})}
                      className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                      placeholder="HTTPS://GITHUB.COM/USER/REPO"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-app-border">
                  <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Technologies</label>
                  
                  <div className="flex flex-wrap gap-2">
                    {newProject.stack?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-card-bg border border-app-border rounded text-[10px] text-app-text uppercase tracking-widest group">
                        <item.icon size={12} style={{ color: item.color }} />
                        <span>{item.name}</span>
                        <button 
                          onClick={() => removeStackItem(idx)}
                          className="text-app-text-muted/20 hover:text-red-500 transition-colors ml-1"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-card-bg border border-app-border rounded-xl">
                    <div className="space-y-2">
                      <label className="text-[8px] text-app-text-muted uppercase">Stack_Name</label>
                      <input 
                        type="text" 
                        value={currentStackItem.name}
                        onChange={e => setCurrentStackItem({...currentStackItem, name: e.target.value})}
                        className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                        placeholder="E.G. REACT"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] text-app-text-muted uppercase">Icon</label>
                      <div className="relative">
                        <div className="w-full bg-card-bg border border-app-border p-2 flex items-center gap-2 cursor-pointer hover:border-neon-cyan transition-all">
                          {ICON_MAP[currentStackItem.icon] && React.createElement(ICON_MAP[currentStackItem.icon], { size: 16, className: "text-neon-cyan" })}
                          <select 
                            value={currentStackItem.icon}
                            onChange={e => setCurrentStackItem({...currentStackItem, icon: e.target.value})}
                            className="flex-1 bg-transparent border-none p-0 text-[10px] text-app-text uppercase tracking-widest focus:ring-0 cursor-pointer"
                          >
                            {Object.keys(ICON_MAP).map(iconName => (
                              <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] text-app-text-muted uppercase">Color_Hex</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={currentStackItem.color}
                          onChange={e => setCurrentStackItem({...currentStackItem, color: e.target.value})}
                          className="w-10 h-10 bg-transparent border-none p-0 cursor-pointer"
                        />
                        <button 
                          onClick={addStackItem}
                          className="flex-grow bg-neon-cyan text-black font-black uppercase tracking-widest text-[8px] hover:bg-white transition-all"
                        >
                          Add_Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-app-border">
                  <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Key Features</label>
                  
                  <div className="space-y-2">
                    {newProject.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-card-bg border border-app-border rounded group">
                        <span className="text-lg">{feature.icon}</span>
                        <span className="flex-1 text-[10px] text-app-text leading-relaxed">{feature.text}</span>
                        <button 
                          onClick={() => removeFeature(idx)}
                          className="text-app-text-muted/20 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 bg-card-bg border border-app-border rounded-xl">
                    <div className="space-y-2">
                      <label className="text-[8px] text-app-text-muted uppercase">Icon</label>
                      <select 
                        value={currentFeature.icon}
                        onChange={e => setCurrentFeature({...currentFeature, icon: e.target.value})}
                        className="w-16 bg-card-bg border border-app-border p-2 text-center text-lg focus:border-neon-cyan focus:ring-0 transition-all cursor-pointer"
                      >
                        <option value="⚡">⚡</option>
                        <option value="🚀">🚀</option>
                        <option value="💡">💡</option>
                        <option value="🎯">🎯</option>
                        <option value="✨">✨</option>
                        <option value="🔥">🔥</option>
                        <option value="💎">💎</option>
                        <option value="🎨">🎨</option>
                        <option value="🔒">🔒</option>
                        <option value="⚙️">⚙️</option>
                        <option value="📱">📱</option>
                        <option value="💻">💻</option>
                        <option value="🌐">🌐</option>
                        <option value="📊">📊</option>
                        <option value="🔔">🔔</option>
                        <option value="🎮">🎮</option>
                        <option value="🏆">🏆</option>
                        <option value="⭐">⭐</option>
                        <option value="✅">✅</option>
                        <option value="🎪">🎪</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] text-app-text-muted uppercase">Feature Description</label>
                      <input 
                        type="text" 
                        value={currentFeature.text}
                        onChange={e => setCurrentFeature({...currentFeature, text: e.target.value})}
                        className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text focus:border-neon-cyan focus:ring-0 transition-all"
                        placeholder="E.G. REAL-TIME DATA SYNCHRONIZATION"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] text-app-text-muted uppercase opacity-0">Add</label>
                      <button 
                        onClick={addFeature}
                        className="h-10 px-6 bg-neon-purple text-black font-black uppercase tracking-widest text-[8px] hover:bg-white transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Project Settings */}
                <div className="space-y-4 pt-4 border-t border-app-border">
                  <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Project Settings</label>
                  
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={newProject.highlight || false}
                        onChange={(e) => setNewProject({...newProject, highlight: e.target.checked})}
                        className="w-5 h-5 bg-card-bg border-2 border-app-border rounded checked:bg-neon-purple checked:border-neon-purple focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-app-text uppercase tracking-widest group-hover:text-neon-purple transition-colors">
                          Highlight Project
                        </span>
                        <span className="text-[8px] text-app-text-muted uppercase tracking-widest">
                          Show "FEATURED" badge on project card
                        </span>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={newProject.showOnHome || false}
                        onChange={(e) => setNewProject({...newProject, showOnHome: e.target.checked})}
                        className="w-5 h-5 bg-card-bg border-2 border-app-border rounded checked:bg-neon-cyan checked:border-neon-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-app-text uppercase tracking-widest group-hover:text-neon-cyan transition-colors">
                          Show on Home Page
                        </span>
                        <span className="text-[8px] text-app-text-muted uppercase tracking-widest">
                          Display this project in the home page featured section
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card-bg border-t border-app-border flex justify-end gap-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-[10px] font-black text-app-text-muted uppercase tracking-widest hover:text-app-text transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  className="px-10 py-3 bg-neon-cyan text-black font-black uppercase tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all"
                >
                  {editingProjectId ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillsView = ({ onSuccess, onError }: { onSuccess: (msg: string) => void; onError: (msg: string) => void }) => {
  const { skills, addSkill, deleteSkill, updateSkill } = useData();
  const [editingSkillLabel, setEditingSkillLabel] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    label: '',
    sublabel: '',
    level: 50,
    color: 'neon-cyan',
    iconName: 'Code2'
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedSkills,
    goToPage,
    itemsPerPage
  } = usePagination({
    items: skills,
    itemsPerPage: 8
  });

  const radarData = skills.map(s => ({
    subject: s.label.toUpperCase(),
    A: s.level,
    fullMark: 100
  }));

  const handleEdit = (skill: Skill) => {
    setEditingSkillLabel(skill.label);
    setNewSkill({
      ...skill,
      iconName: Object.keys(ICON_MAP).find(key => ICON_MAP[key] === skill.icon) || 'Code2'
    });
  };

  const handleAdd = async () => {
    if (newSkill.label) {
      try {
        const skill: Skill = {
          label: newSkill.label!,
          sublabel: newSkill.sublabel || '',
          level: newSkill.level || 50,
          color: newSkill.color || 'neon-cyan',
          icon: ICON_MAP[newSkill.iconName as string] || Code2
        };

        if (editingSkillLabel) {
          await updateSkill(editingSkillLabel, skill);
          onSuccess('Skill updated successfully!');
        } else {
          await addSkill(skill);
          onSuccess('Skill added successfully!');
        }
        
        setNewSkill({ label: '', sublabel: '', level: 50, color: 'neon-cyan', iconName: 'Code2' });
        setEditingSkillLabel(null);
      } catch (err) {
        onError('Failed to save skill. Please try again.');
      }
    }
  };

  const handleDelete = async (label: string) => {
    try {
      await deleteSkill(label);
      onSuccess('Skill deleted successfully!');
    } catch (err) {
      onError('Failed to delete skill. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-7xl font-black text-app-text uppercase tracking-tighter font-display">Skills</h1>
          <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.4em] mt-2 block">Manage Your Skills</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-card-bg border border-app-border rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Activity size={14} className="text-neon-cyan" />
            <span className="text-[8px] text-app-text-muted uppercase tracking-widest">Skills Overview</span>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--app-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--app-text-muted)', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#00F2FF"
                  fill="#00F2FF"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-8 border-t border-app-border pt-8">
            <div className="text-center">
              <span className="text-2xl font-black text-neon-purple">
                {Math.round(skills.reduce((acc, s) => acc + s.level, 0) / (skills.length || 1))}%
              </span>
              <p className="text-[8px] text-app-text-muted uppercase tracking-widest mt-1">Aggregate_Proficiency</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-black text-neon-cyan">{skills.length}</span>
              <p className="text-[8px] text-app-text-muted uppercase tracking-widest mt-1">Core_Modules</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-black text-app-text">LVL_42</span>
              <p className="text-[8px] text-app-text-muted uppercase tracking-widest mt-1">Experience_Tier</p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Plus size={16} className="text-neon-cyan" />
            <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">
              {editingSkillLabel ? 'Update Skill' : 'Add Skill'}
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Name</label>
              <input 
                type="text" 
                value={newSkill.label}
                onChange={e => setNewSkill({...newSkill, label: e.target.value})}
                placeholder="E.G. RUST_SYSTEMS" 
                className="w-full bg-white/5 border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Sublabel</label>
              <input 
                type="text" 
                value={newSkill.sublabel}
                onChange={e => setNewSkill({...newSkill, sublabel: e.target.value})}
                placeholder="E.G. SYSTEMS_PROGRAMMING" 
                className="w-full bg-white/5 border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-app-text-muted uppercase tracking-widest mb-4">
                <span>Level</span>
                <span className="text-neon-cyan">{newSkill.level}%</span>
              </div>
              <input 
                type="range" 
                value={newSkill.level}
                onChange={e => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                className="w-full accent-neon-cyan" 
              />
            </div>
            <div>
              <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Icon</label>
              <div className="relative">
                <div className="w-full bg-white/5 border border-app-border p-4 flex items-center gap-3 cursor-pointer hover:border-neon-cyan transition-all">
                  {ICON_MAP[newSkill.iconName as string] && React.createElement(ICON_MAP[newSkill.iconName as string], { size: 20, className: "text-neon-cyan" })}
                  <select 
                    value={newSkill.iconName}
                    onChange={e => setNewSkill({...newSkill, iconName: e.target.value})}
                    className="flex-1 bg-transparent border-none p-0 text-xs text-app-text uppercase tracking-widest focus:ring-0 cursor-pointer"
                  >
                    {Object.keys(ICON_MAP).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Color</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { value: 'neon-cyan', hex: '#00F2FF' },
                  { value: 'neon-purple', hex: '#BC13FE' },
                  { value: 'red-500', hex: '#EF4444' },
                  { value: 'orange-500', hex: '#F97316' },
                  { value: 'yellow-500', hex: '#EAB308' },
                  { value: 'green-500', hex: '#22C55E' },
                  { value: 'emerald-500', hex: '#10B981' },
                  { value: 'teal-500', hex: '#14B8A6' },
                  { value: 'blue-500', hex: '#3B82F6' },
                  { value: 'purple-500', hex: '#A855F7' },
                  { value: 'pink-500', hex: '#EC4899' },
                  { value: 'rose-500', hex: '#F43F5E' },
                  { value: 'app-text', hex: '#FFFFFF' },
                ].map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewSkill({...newSkill, color: color.value})}
                    className={`w-full h-10 rounded-lg border-2 transition-all ${
                      newSkill.color === color.value 
                        ? 'border-white scale-110' 
                        : 'border-app-border hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.value}
                  />
                ))}
              </div>
              <p className="text-[8px] text-app-text-muted uppercase tracking-widest mt-2">
                Selected: {newSkill.color}
              </p>
            </div>
            <button 
              onClick={handleAdd}
              className="w-full py-4 bg-neon-purple text-app-text font-black uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all mt-4"
            >
              {editingSkillLabel ? 'Update' : 'Add'}
            </button>
            {editingSkillLabel && (
              <button 
                onClick={() => {
                  setEditingSkillLabel(null);
                  setNewSkill({ label: '', sublabel: '', level: 50, color: 'neon-cyan', iconName: 'Code2' });
                }}
                className="w-full py-2 text-[10px] font-black text-app-text-muted uppercase tracking-widest hover:text-app-text transition-all"
              >
                Cancel_Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {paginatedSkills.map((skill, i) => (
          <div key={i} className="p-6 bg-card-bg border border-app-border rounded-2xl border-l-4 group hover:bg-card-bg/50 transition-all relative"
            style={{ borderLeftColor: SKILL_COLOR_MAP[skill.color] || skill.color }}>
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => handleEdit(skill)}
                className="text-app-text-muted/20 hover:text-neon-cyan transition-colors"
              >
                <Edit size={14} />
              </button>
              <button 
                onClick={() => handleDelete(skill.label)}
                className="text-app-text-muted/20 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex justify-between items-start mb-6">
              <skill.icon size={20} style={{ color: SKILL_COLOR_MAP[skill.color] || skill.color }} />
              <span className="text-[8px] text-app-text-muted/20 uppercase tracking-widest">ACTIVE_NODE</span>
            </div>
            <h4 className="text-sm font-black text-app-text uppercase tracking-widest mb-4">{skill.label}</h4>
            <div className="flex justify-between text-[8px] text-app-text-muted uppercase tracking-widest mb-2">
              <span>Sync_Rate</span>
              <span style={{ color: SKILL_COLOR_MAP[skill.color] || skill.color }}>{skill.level}%</span>
            </div>
            <div className="h-1 bg-card-bg rounded-full overflow-hidden">
              <div style={{ width: `${skill.level}%`, backgroundColor: SKILL_COLOR_MAP[skill.color] || skill.color }} />
            </div>
          </div>
        ))}
      </div>

      {skills.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
          totalItems={skills.length}
        />
      )}
    </div>
  );
};

const ReviewsView = () => {
  const { testimonials, deleteTestimonial, approveTestimonial, rejectTestimonial, addTestimonial } = useData();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: '', text: '', avatar: '', rating: 5 });

  const handleAddReview = async () => {
    try {
      await addTestimonial({
        id: crypto.randomUUID(),
        name: newReview.name,
        role: newReview.role,
        text: newReview.text,
        avatar: newReview.avatar,
        rating: newReview.rating,
      });
      setShowAddReview(false);
      setNewReview({ name: '', role: '', text: '', avatar: '', rating: 5 });
    } catch (_) {}
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const pendingCount = testimonials.filter(t => t.status === 'pending').length;
  const approvedCount = testimonials.filter(t => t.status === 'approved').length;
  const rejectedCount = testimonials.filter(t => t.status === 'rejected').length;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'neon-cyan';
      case 'rejected': return 'red-500';
      case 'pending': return 'neon-purple';
      default: return 'app-text-muted';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved': return '✅ APPROVED';
      case 'rejected': return '❌ REJECTED';
      case 'pending': return '⏳ PENDING';
      default: return '📝 REVIEW';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-7xl font-black text-app-text uppercase tracking-tighter font-display">Reviews</h1>
          <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.4em] mt-2 block underline decoration-neon-purple decoration-4 underline-offset-8">Client Feedback Moderation</span>
        </div>
        <button
          onClick={() => setShowAddReview(true)}
          className="px-8 py-4 bg-neon-purple text-app-text font-black uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all"
        >
          + Add Review
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-card-bg border border-app-border rounded-xl">
          <div className="text-3xl font-black text-app-text mb-2">{testimonials.length}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Total Reviews</div>
        </div>
        <div className="p-6 bg-card-bg border-l-4 border-l-neon-purple border-y border-r border-app-border rounded-xl">
          <div className="text-3xl font-black text-neon-purple mb-2">{pendingCount}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Pending</div>
        </div>
        <div className="p-6 bg-card-bg border-l-4 border-l-neon-cyan border-y border-r border-app-border rounded-xl">
          <div className="text-3xl font-black text-neon-cyan mb-2">{approvedCount}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Approved</div>
        </div>
        <div className="p-6 bg-card-bg border-l-4 border-l-red-500 border-y border-r border-app-border rounded-xl">
          <div className="text-3xl font-black text-red-500 mb-2">{rejectedCount}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Rejected</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-app-border">
        {[
          { value: 'all', label: 'All', count: testimonials.length },
          { value: 'pending', label: 'Pending', count: pendingCount },
          { value: 'approved', label: 'Approved', count: approvedCount },
          { value: 'rejected', label: 'Rejected', count: rejectedCount }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value as any)}
            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              filterStatus === tab.value
                ? 'text-neon-cyan'
                : 'text-app-text-muted hover:text-app-text'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[8px] ${
                filterStatus === tab.value
                  ? 'bg-neon-cyan text-black'
                  : 'bg-app-border text-app-text-muted'
              }`}>
                {tab.count}
              </span>
            )}
            {filterStatus === tab.value && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials.map((t) => (
          <motion.div 
            key={t.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-8 bg-card-bg border border-app-border rounded-2xl relative group overflow-hidden"
          >
            <div style={{ background: STATUS_COLOR_MAP[getStatusColor(t.status)] || getStatusColor(t.status), width: '4px', height: '100%', position: 'absolute', top: 0, left: 0 }} />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded"
                style={{ border: `2px solid ${STATUS_COLOR_MAP[getStatusColor(t.status)] || getStatusColor(t.status)}`, color: STATUS_COLOR_MAP[getStatusColor(t.status)] || getStatusColor(t.status), background: `${STATUS_COLOR_MAP[getStatusColor(t.status)] || getStatusColor(t.status)}1A` }}>
                {getStatusBadge(t.status)}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6 mt-8">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-app-border">
                <img src={t.avatar || null} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-black text-app-text uppercase tracking-widest">{t.name}</h3>
                <p className="text-[10px] text-neon-purple uppercase font-bold">{t.role}</p>
              </div>
            </div>

            {/* Star Rating */}
            {t.rating && (
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= t.rating! ? 'text-yellow-400' : 'text-app-text-muted/20'}>
                    ⭐
                  </span>
                ))}
              </div>
            )}

            <div className="relative mb-6">
              <Quote className="absolute -top-2 -left-2 text-app-text/5" size={40} />
              <p className="text-xs text-app-text-muted leading-relaxed relative z-10 italic">
                "{t.text}"
              </p>
            </div>

            {/* Action Buttons */}
            {t.status === 'pending' && (
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => approveTestimonial(t.id)}
                  className="flex-1 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan rounded text-[10px] font-black uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => rejectTestimonial(t.id)}
                  className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500 rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  ❌ Reject
                </button>
              </div>
            )}

            {t.status === 'approved' && (
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => rejectTestimonial(t.id)}
                  className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500 rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  ❌ Reject
                </button>
              </div>
            )}

            {t.status === 'rejected' && (
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => approveTestimonial(t.id)}
                  className="flex-1 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan rounded text-[10px] font-black uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all"
                >
                  ✅ Approve
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-app-border flex justify-between items-center">
              <span className="text-[8px] text-app-text-muted uppercase tracking-[0.3em]">
                {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}
              </span>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this review?')) {
                    deleteTestimonial(t.id);
                  }
                }}
                className="p-2 text-app-text-muted hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="col-span-2 flex flex-col items-center justify-center py-20 border border-dashed border-app-border rounded-2xl">
          <Quote size={48} className="text-app-text/10 mb-4" />
          <p className="text-[10px] text-app-text-muted uppercase tracking-[0.4em]">
            {filterStatus === 'all' ? 'No_Reviews_Detected' : `No_${filterStatus}_Reviews`}
          </p>
        </div>
      )}

      {showAddReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg bg-card-bg border border-app-border rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-6 border-b border-app-border flex items-center justify-between bg-card-bg">
              <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">Add Review</h3>
              <button onClick={() => setShowAddReview(false)} className="text-app-text-muted hover:text-app-text transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Name</label>
                <input 
                  type="text" 
                  value={newReview.name}
                  onChange={e => setNewReview({...newReview, name: e.target.value})}
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                  placeholder="CLIENT NAME"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Role</label>
                <input 
                  type="text" 
                  value={newReview.role}
                  onChange={e => setNewReview({...newReview, role: e.target.value})}
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                  placeholder="CLIENT ROLE / TITLE"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Review Text</label>
                <textarea 
                  value={newReview.text}
                  onChange={e => setNewReview({...newReview, text: e.target.value})}
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                  placeholder="WRITE THE REVIEW..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Avatar URL (optional)</label>
                <input 
                  type="text" 
                  value={newReview.avatar}
                  onChange={e => setNewReview({...newReview, avatar: e.target.value})}
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className={`text-2xl transition-all ${star <= newReview.rating ? 'text-yellow-400' : 'text-app-text-muted/20'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-app-border flex justify-end gap-4">
              <button 
                onClick={() => setShowAddReview(false)} 
                className="px-6 py-3 text-[10px] font-black text-app-text-muted uppercase tracking-widest border border-app-border rounded hover:text-app-text transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddReview}
                disabled={!newReview.name || !newReview.role || !newReview.text}
                className="px-6 py-3 text-[10px] font-black text-app-text uppercase tracking-widest bg-neon-purple rounded hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const MessagesView = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { success, error } = useToast();

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { messagesAPI } = await import('./services/api');
      const result = await messagesAPI.getAll();
      setMessages(Array.isArray(result) ? result : result?.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const { messagesAPI } = await import('./services/api');
      await messagesAPI.markAsRead(id);
      setMessages(prev => prev.map(m => m._id === id || m.id === id ? { ...m, isRead: true } : m));
      success('Message marked as read');
    } catch (err) {
      error('Failed to mark message as read');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const { messagesAPI } = await import('./services/api');
      await messagesAPI.delete(id);
      setMessages(prev => prev.filter(m => m._id !== id && m.id !== id));
      success('Message deleted');
    } catch (err) {
      error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    return true;
  });

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.4em] mb-2 block">Contact Messages</span>
          <h1 className="text-7xl font-black text-app-text uppercase tracking-tighter font-display">Messages</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card-bg border border-app-border rounded-xl">
          <div className="text-3xl font-black text-app-text mb-2">{messages.length}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Total</div>
        </div>
        <div className="p-6 bg-card-bg border-l-4 border-l-neon-cyan border-y border-r border-app-border rounded-xl">
          <div className="text-3xl font-black text-neon-cyan mb-2">{messages.filter(m => !m.isRead).length}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Unread</div>
        </div>
        <div className="p-6 bg-card-bg border-l-4 border-l-neon-purple border-y border-r border-app-border rounded-xl">
          <div className="text-3xl font-black text-neon-purple mb-2">{messages.filter(m => m.isRead).length}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Read</div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-app-border">
        {[
          { value: 'all' as const, label: 'All', count: messages.length },
          { value: 'unread' as const, label: 'Unread', count: messages.filter(m => !m.isRead).length },
          { value: 'read' as const, label: 'Read', count: messages.filter(m => m.isRead).length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              filter === tab.value ? 'text-neon-cyan' : 'text-app-text-muted hover:text-app-text'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-[8px] bg-app-border text-app-text-muted">{tab.count}</span>
            {filter === tab.value && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan" />}
          </button>
        ))}
      </div>

      <div className="bg-card-bg border border-app-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-app-border text-[10px] text-app-text-muted uppercase tracking-[0.2em]">
                <th className="px-8 py-6 font-black w-8"></th>
                <th className="px-8 py-6 font-black">From</th>
                <th className="px-8 py-6 font-black">Subject</th>
                <th className="px-8 py-6 font-black">Date</th>
                <th className="px-8 py-6 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-[10px] text-app-text-muted uppercase tracking-widest">
                    No messages found
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg._id || msg.id} className={`group hover:bg-card-bg/50 transition-colors ${!msg.isRead ? 'bg-neon-cyan/5' : ''}`}>
                    <td className="px-8 py-6">
                      <div className={`w-2 h-2 rounded-full ${!msg.isRead ? 'bg-neon-cyan' : 'bg-transparent'}`} />
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <span className="text-xs font-black text-app-text uppercase tracking-widest">{msg.name}</span>
                        <p className="text-[8px] text-app-text-muted/50 mt-0.5">{msg.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] text-app-text-muted">{msg.subject}</span>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-app-text-muted font-mono">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-4 text-app-text-muted">
                        {!msg.isRead && (
                          <MessageCircle
                            size={16}
                            onClick={() => handleMarkAsRead(msg._id || msg.id)}
                            className="hover:text-neon-cyan cursor-pointer transition-colors"
                          />
                        )}
                        <Trash2
                          size={16}
                          onClick={() => handleDelete(msg._id || msg.id)}
                          className="hover:text-red-500 cursor-pointer transition-colors"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ onSuccess, onError }: { onSuccess: (msg: string) => void; onError: (msg: string) => void }) => {
  const { settings, updateSettings, stats, updateStats, experience, updateExperience } = useData();
  const [localSettings, setLocalSettings] = useState(settings);
  const [localStats, setLocalStats] = useState(stats);
  const [localExperience, setLocalExperience] = useState(experience);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    setLocalSettings(prev => JSON.stringify(prev) !== JSON.stringify(settings) ? settings : prev);
  }, [settings]);

  useEffect(() => {
    setLocalStats(prev => JSON.stringify(prev) !== JSON.stringify(stats) ? stats : prev);
  }, [stats]);

  useEffect(() => {
    setLocalExperience(prev => JSON.stringify(prev) !== JSON.stringify(experience) ? experience : prev);
  }, [experience]);

  const THEME_COLORS = [
    { key: '--neon-cyan', label: 'Primary (Cyan)', default: '#00ffff' },
    { key: '--neon-purple', label: 'Secondary (Purple)', default: '#ff51fa' },
    { key: '--neon-violet', label: 'Tertiary (Violet)', default: '#ac89ff' },
    { key: '--app-bg', label: 'Background', default: '#050505' },
    { key: '--app-text', label: 'Text', default: '#ffffff' },
    { key: '--app-text-muted', label: 'Muted Text', default: '#bfbfbf' },
    { key: '--app-border', label: 'Border', default: '#1a1a1a' },
    { key: '--card-bg', label: 'Card Background', default: '#0d0d0d' },
  ];

  const getThemeVal = (key: string, def: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(key).trim() || def;

  const [themeVals, setThemeVals] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('portfolio_theme') || '{}');
    return Object.fromEntries(THEME_COLORS.map(c => [c.key, saved[c.key] || getThemeVal(c.key, c.default)]));
  });

  const applyTheme = (key: string, val: string) => {
    document.documentElement.style.setProperty(key, val);
    const saved = JSON.parse(localStorage.getItem('portfolio_theme') || '{}');
    saved[key] = val;
    localStorage.setItem('portfolio_theme', JSON.stringify(saved));
    setThemeVals(prev => ({ ...prev, [key]: val }));
  };

  const resetTheme = () => {
    const root = document.documentElement;
    const defaults: Record<string, string> = {
      '--neon-cyan': '#00ffff',
      '--neon-purple': '#ff51fa',
      '--neon-violet': '#ac89ff',
      '--app-bg': '#050505',
      '--app-text': '#ffffff',
      '--app-text-muted': 'rgba(255,255,255,0.75)',
      '--app-border': 'rgba(255,255,255,0.1)',
      '--card-bg': 'rgba(255,255,255,0.03)',
    };
    const newVals: Record<string, string> = {};
    Object.entries(defaults).forEach(([k, v]) => {
      root.style.setProperty(k, v);
      newVals[k] = v;
    });
    localStorage.removeItem('portfolio_theme');
    setThemeVals(newVals);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('portfolio_theme') || '{}');
    if (Object.keys(saved).length > 0) {
      const root = document.documentElement;
      Object.entries(saved).forEach(([k, v]) => root.style.setProperty(k, v as string));
    }
  }, []);

  const handleSave = () => {
    // Validate password if attempting to change
    if (passwordFields.newPassword) {
      if (passwordFields.newPassword.length < 6) {
        onError('Password must be at least 6 characters long.');
        return;
      }
      if (passwordFields.newPassword !== passwordFields.confirmPassword) {
        onError('New passwords do not match.');
        return;
      }
    }

    // Validate experience fields
    const expErrors: string[] = [];
    for (const exp of localExperience) {
      if (!exp.company) expErrors.push('Company/Organization is required.');
      if (!exp.role) expErrors.push('Role is required.');
      if (!exp.description || exp.description.length < 10) expErrors.push(`Experience "${exp.company || exp.role || 'untitled'}" description must be at least 10 characters.`);
    }
    if (expErrors.length > 0) { onError(expErrors.join(' ')); return; }
    
    // Save settings
    const settingsToSave: PortfolioSettings = {
      ...localSettings
    };
    updateSettings(settingsToSave, passwordFields.newPassword || undefined, localStats);
    updateExperience(localExperience);
    
    // Clear password fields
    setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
    
    onSuccess('Settings saved successfully!');
  };

  const addStat = () => {
    setLocalStats([...localStats, { label: 'NEW_STAT', value: '0' }]);
  };

  const removeStat = (index: number) => {
    setLocalStats(localStats.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setLocalExperience([...localExperience, { 
      id: `exp-${Date.now()}`, 
      company: 'NEW_COMPANY', 
      role: 'NEW_ROLE', 
      period: '2024 - Present', 
      description: 'Description here...' 
    }]);
  };

  const removeExperience = (id: string) => {
    setLocalExperience(localExperience.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-7xl font-black text-app-text uppercase tracking-tighter font-display">Settings</h1>
          <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.4em] mt-2 block underline decoration-neon-cyan decoration-4 underline-offset-8">Portfolio Configuration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="px-2 py-1 bg-neon-cyan text-black text-[8px] font-black uppercase">Profile</div>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-full max-w-sm">
                <ImageUpload
                  value={localSettings.profileImage}
                  onChange={(url) => setLocalSettings({...localSettings, profileImage: url})}
                  label="Profile_Image"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
              <User size={16} className="text-neon-cyan" />
              <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">About</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Display Name</label>
                <input 
                  type="text" 
                  value={localSettings.displayName}
                  onChange={e => setLocalSettings({...localSettings, displayName: e.target.value})}
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-neon-cyan uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Technical Bio</label>
                <textarea 
                  rows={2}
                  value={localSettings.technicalBio}
                  onChange={e => setLocalSettings({...localSettings, technicalBio: e.target.value})}
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text-muted uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">About_Me_Detailed</label>
                <textarea 
                  rows={4}
                  value={localSettings.aboutMe}
                  onChange={e => setLocalSettings({...localSettings, aboutMe: e.target.value})}
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text-muted uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Globe size={16} className="text-neon-purple" />
              <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">Social Links</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Github_Uri</label>
                <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                  <Github size={14} className="text-neon-cyan" />
                  <input 
                    type="text" 
                    value={localSettings.githubUri}
                    onChange={e => setLocalSettings({...localSettings, githubUri: e.target.value})}
                    placeholder="https://github.com/" 
                    className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Linkedin_Uri</label>
                <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                  <Linkedin size={14} className="text-neon-cyan" />
                  <input 
                    type="text" 
                    value={localSettings.linkedinUri}
                    onChange={e => setLocalSettings({...localSettings, linkedinUri: e.target.value})}
                    placeholder="https://linkedin.com/" 
                    className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">WhatsApp_Number</label>
                <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                  <WhatsAppIcon size={14} className="text-neon-cyan" />
                  <input 
                    type="text" 
                    value={localSettings.whatsappNumber}
                    onChange={e => setLocalSettings({...localSettings, whatsappNumber: e.target.value})}
                    placeholder="+1234567890" 
                    className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Contact_Email</label>
                <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                  <Mail size={14} className="text-neon-cyan" />
                  <input 
                    type="email" 
                    value={localSettings.contactEmail}
                    onChange={e => setLocalSettings({...localSettings, contactEmail: e.target.value})}
                    placeholder="hello@example.com" 
                    className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">CV_Download_Link</label>
                <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                  <Download size={14} className="text-neon-cyan" />
                  <input 
                    type="text" 
                    value={localSettings.cvDownloadUrl}
                    onChange={e => setLocalSettings({...localSettings, cvDownloadUrl: e.target.value})}
                    placeholder="https://drive.google.com/..." 
                    className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Location</label>
                <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                  <Globe size={14} className="text-neon-cyan" />
                  <input 
                    type="text" 
                    value={localSettings.location}
                    onChange={e => setLocalSettings({...localSettings, location: e.target.value})}
                    placeholder="Remote / Worldwide" 
                    className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Dashboard Password</label>
                <div className="space-y-4">
                  <div>
                    <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-2 block">Current Password</label>
                    <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                      <Shield size={14} className="text-neon-cyan" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={passwordFields.currentPassword}
                        onChange={e => setPasswordFields({...passwordFields, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                        className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-app-text-muted hover:text-app-text transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-2 block">New Password</label>
                    <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                      <Shield size={14} className="text-neon-purple" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={passwordFields.newPassword}
                        onChange={e => setPasswordFields({...passwordFields, newPassword: e.target.value})}
                        placeholder="Enter new password"
                        className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-2 block">Confirm New Password</label>
                    <div className="flex items-center gap-2 bg-card-bg border border-app-border p-4">
                      <Shield size={14} className="text-neon-purple" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={passwordFields.confirmPassword}
                        onChange={e => setPasswordFields({...passwordFields, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        className="bg-transparent border-none p-0 text-[10px] text-app-text focus:ring-0 w-full" 
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[8px] text-app-text-muted/50 uppercase tracking-widest mt-2">
                  ⚠️ Leave blank to keep current password
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Globe size={16} className="text-neon-violet" />
              <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">SEO</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Site Title</label>
                <input 
                  type="text" 
                  value={localSettings.siteTitle || ''}
                  onChange={e => setLocalSettings({...localSettings, siteTitle: e.target.value})}
                  placeholder="Portfolio - Full Stack Developer"
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Meta Description</label>
                <textarea 
                  rows={2}
                  value={localSettings.siteDescription || ''}
                  onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})}
                  placeholder="A full-stack developer portfolio showcasing projects, skills, and experience"
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text-muted tracking-widest focus:border-neon-cyan focus:ring-0 transition-all leading-relaxed"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[8px] font-mono tracking-wider ${(localSettings.siteDescription?.length || 0) > 160 ? 'text-red-500' : (localSettings.siteDescription?.length || 0) > 120 ? 'text-yellow-500' : 'text-app-text-muted/50'}`}>
                    {(localSettings.siteDescription?.length || 0)} / 160
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Keywords</label>
                <input 
                  type="text" 
                  value={localSettings.siteKeywords || ''}
                  onChange={e => setLocalSettings({...localSettings, siteKeywords: e.target.value})}
                  placeholder="developer, portfolio, react, node.js"
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text-muted tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-app-text-muted uppercase tracking-widest mb-2 block">Favicon URL</label>
                <input 
                  type="text" 
                  value={localSettings.favicon || ''}
                  onChange={e => setLocalSettings({...localSettings, favicon: e.target.value})}
                  placeholder="/favicon.ico"
                  className="w-full bg-card-bg border border-app-border p-4 text-xs text-app-text-muted tracking-widest focus:border-neon-cyan focus:ring-0 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Palette size={16} className="text-neon-violet" />
                <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">Theme Colors</h3>
              </div>
              <button 
                onClick={resetTheme}
                className="px-3 py-1 text-[8px] font-black text-app-text-muted uppercase tracking-widest border border-app-border rounded hover:text-app-text hover:border-app-text transition-all"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {THEME_COLORS.map(({ key, label, default: defaultVal }) => (
                <div key={key}>
                  <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-2 block">{label}</label>
                  <div className="flex gap-2 items-center bg-card-bg border border-app-border p-2">
                    <input 
                      type="color" 
                      value={themeVals[key] || defaultVal}
                      onChange={e => applyTheme(key, e.target.value)}
                      className="w-8 h-8 p-0 border-0 cursor-pointer bg-transparent"
                    />
                    <input 
                      type="text" 
                      value={themeVals[key] || defaultVal}
                      onChange={e => applyTheme(key, e.target.value)}
                      className="bg-transparent border-none p-0 text-[9px] text-app-text-muted font-mono w-full focus:ring-0"
                    />
                  </div>
                </div>))}
            </div>
            <p className="text-[8px] text-app-text-muted/50 uppercase tracking-widest mt-4">
              💡 Colors are saved to browser storage and restored on page load.
            </p>
          </div>

          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BarChart2 size={16} className="text-neon-cyan" />
                <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">Stats</h3>
              </div>
              <button onClick={addStat} className="p-2 bg-neon-cyan/10 text-neon-cyan rounded hover:bg-neon-cyan/20 transition-all">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {localStats.map((stat, i) => (
                <div key={i} className="flex gap-4 items-end">
                  <div className="flex-grow grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-1 block">Label</label>
                      <input 
                        type="text" 
                        value={stat.label}
                        onChange={e => {
                          const newStats = [...localStats];
                          newStats[i].label = e.target.value;
                          setLocalStats(newStats);
                        }}
                        className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text focus:border-neon-cyan focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-1 block">Value</label>
                      <input 
                        type="text" 
                        value={stat.value}
                        onChange={e => {
                          const newStats = [...localStats];
                          newStats[i].value = e.target.value;
                          setLocalStats(newStats);
                        }}
                        className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text focus:border-neon-cyan focus:ring-0"
                      />
                    </div>
                  </div>
                  <button onClick={() => removeStat(i)} className="p-2 text-app-text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-card-bg border border-app-border rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Briefcase size={16} className="text-neon-purple" />
                <h3 className="text-sm font-black text-app-text uppercase tracking-[0.2em]">Experience</h3>
              </div>
              <button onClick={addExperience} className="p-2 bg-neon-purple/10 text-neon-purple rounded hover:bg-neon-purple/20 transition-all">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-6">
              {localExperience.map((exp) => (
                <div key={exp.id} className="p-4 bg-card-bg border border-app-border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] text-neon-purple uppercase tracking-widest">Experience_Node</span>
                    <button onClick={() => removeExperience(exp.id)} className="p-1 text-app-text-muted hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-1 block">Company</label>
                      <input 
                        type="text" 
                        value={exp.company}
                        onChange={e => {
                          const newExp = localExperience.map(item => 
                            item.id === exp.id ? { ...item, company: e.target.value } : item
                          );
                          setLocalExperience(newExp);
                        }}
                        className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text focus:border-neon-cyan focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-1 block">Role</label>
                      <input 
                        type="text" 
                        value={exp.role}
                        onChange={e => {
                          const newExp = localExperience.map(item => 
                            item.id === exp.id ? { ...item, role: e.target.value } : item
                          );
                          setLocalExperience(newExp);
                        }}
                        className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text focus:border-neon-cyan focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-1 block">Period</label>
                    <input 
                      type="text" 
                      value={exp.period}
                      onChange={e => {
                        const newExp = localExperience.map(item => 
                          item.id === exp.id ? { ...item, period: e.target.value } : item
                        );
                        setLocalExperience(newExp);
                      }}
                      placeholder="2020 - 2024"
                      className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text focus:border-neon-cyan focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-app-text-muted uppercase tracking-widest mb-1 block">Description</label>
                    <textarea 
                      rows={3}
                      value={exp.description}
                      onChange={e => {
                        const newExp = localExperience.map(item => 
                          item.id === exp.id ? { ...item, description: e.target.value } : item
                        );
                        setLocalExperience(newExp);
                      }}
                      className="w-full bg-card-bg border border-app-border p-2 text-[10px] text-app-text focus:border-neon-cyan focus:ring-0 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-6">
            <button 
              onClick={() => {
                setLocalSettings(settings);
                setLocalStats(stats);
                setLocalExperience(experience);
                setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="text-[10px] font-black text-app-text-muted uppercase tracking-widest hover:text-app-text transition-all"
            >
              Discard_Changes
            </button>
            <button 
              onClick={handleSave}
              className="px-12 py-4 bg-neon-purple text-app-text font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(188,19,254,0.6)] transition-all shadow-[0_0_15px_rgba(188,19,254,0.3)]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilesView = ({ onSuccess, onError }: { onSuccess: (msg: string) => void; onError: (msg: string) => void }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyUrl = async (url: string, id: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const { uploadsAPI } = await import('./services/api');
      await uploadsAPI.sync();
      const res = await uploadsAPI.list();
      setFiles(res);
    } catch (err) {
      onError('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try {
      const { uploadsAPI } = await import('./services/api');
      await uploadsAPI.delete(filename);
      setFiles(prev => prev.filter(f => f.filename !== filename));
      onSuccess('File deleted');
    } catch (err) {
      onError('Failed to delete file');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { uploadsAPI } = await import('./services/api');
      await uploadsAPI.upload(file);
      onSuccess('File uploaded');
      loadFiles();
    } catch (err) {
      onError('Failed to upload file');
    }
    e.target.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-[0.4em] mb-2 block">File Manager</span>
          <h1 className="text-7xl font-black text-app-text uppercase tracking-tighter font-display">Files</h1>
        </div>
        <label className="px-6 py-3 bg-neon-cyan text-black font-black uppercase tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] cursor-pointer transition-all flex items-center gap-2">
          <Plus size={14} />
          Upload
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card-bg border border-app-border rounded-xl">
          <div className="text-3xl font-black text-app-text mb-2">{files.length}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Total Files</div>
        </div>
        <div className="p-6 bg-card-bg border-l-4 border-l-neon-cyan border-y border-r border-app-border rounded-xl">
          <div className="text-3xl font-black text-neon-cyan mb-2">{formatSize(files.reduce((acc, f) => acc + (f.size || 0), 0))}</div>
          <div className="text-[10px] text-app-text-muted uppercase tracking-widest">Total Size</div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="p-12 bg-card-bg border border-app-border rounded-2xl text-center">
          <p className="text-xs uppercase tracking-widest text-app-text-muted">No files uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.filename} className="group relative bg-card-bg border border-app-border rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-all">
              <div className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-app-bg/50 flex items-center justify-center">
                  {/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(file.filename) && file.url ? (
                    <img src={file.url || null} alt={file.filename} className="w-full h-full object-contain" />
                  ) : (
                    <FileText size={28} className="text-app-text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-app-text-muted truncate" title={file.filename}>{file.filename}</p>
                  <span className="text-[8px] text-app-text-muted/50">{formatSize(file.size)}</span>
                </div>
              </div>
              <div className="px-4 pb-3 space-y-2">
                <div className="flex items-center gap-2 bg-app-bg/30 rounded-lg px-3 py-2">
                  <code className="text-[8px] font-mono text-neon-cyan flex-1 truncate" title={file.url}>
                    {file.url}
                  </code>
                  <button
                    onClick={() => copyUrl(file.url, file._id || file.filename)}
                    className="flex-shrink-0 p-1 rounded hover:bg-app-border/50 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === (file._id || file.filename) ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <Link size={12} className="text-app-text-muted" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(file.filename)}
                  className="w-full py-1.5 text-[8px] text-app-text-muted/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all uppercase tracking-widest font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardInner = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'skills' | 'reviews' | 'messages' | 'files' | 'settings'>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const { success, error } = useToast();
  const viewCache = React.useRef<Record<string, React.ReactNode>>({
    dashboard: <AnalyticsView />,
    projects: <ProjectsView onSuccess={success} onError={error} />,
    skills: <SkillsView onSuccess={success} onError={error} />,
    reviews: <ReviewsView />,
    messages: <MessagesView />,
    files: <FilesView onSuccess={success} onError={error} />,
    settings: <SettingsView onSuccess={success} onError={error} />,
  });
  const { operationLoading, notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans selection:bg-neon-cyan selection:text-black" style={{
      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
      backgroundSize: '40px 40px'
    }}>
      
      {/* Global Loading Overlay */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Processing..." />
        </div>
      )}
      
      {/* Top Bar */}
      <header className="h-20 border-b border-app-border flex items-center justify-between px-8 sticky top-0 bg-app-bg/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-app-text-muted hover:text-neon-cyan uppercase tracking-widest transition-all group"
            aria-label="Back to Portfolio"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </button>
          <div className="h-8 w-px bg-app-border" />
          <h1 className="text-xl font-black text-neon-cyan tracking-[0.2em] uppercase font-display">Portfolio Admin</h1>
        </div>
        <nav className="flex items-center gap-12">
          {['DASHBOARD', 'PROJECTS', 'SKILLS', 'REVIEWS', 'MESSAGES', 'SETTINGS'].map((item) => (
            <span 
              key={item}
              onClick={() => setActiveTab(item.toLowerCase() as any)}
              className={`text-xs font-black tracking-[0.2em] cursor-pointer transition-all ${
                activeTab === item.toLowerCase() ? 'text-neon-cyan' : 'text-app-text-muted hover:text-app-text'
              }`}
            >
              {item}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative cursor-pointer text-app-text-muted hover:text-neon-cyan transition-all"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-purple rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(188,19,254,1)]">
                    <span className="text-[8px] font-black text-black">{unreadCount}</span>
                  </div>
                </>
              )}
            </button>
            
            {showNotifications && (
              <NotificationsPanel
                notifications={notifications}
                onMarkAsRead={markNotificationAsRead}
                onMarkAllAsRead={markAllNotificationsAsRead}
                onDelete={deleteNotification}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-card-bg border border-app-border flex items-center justify-center text-neon-cyan hover:border-neon-cyan transition-all cursor-pointer">
            <User size={20} />
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-app-text-muted hover:text-red-500 transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-app-border bg-card-bg flex flex-col">
          <div className="p-8 border-b border-app-border flex-shrink-0">
            <h2 className="text-xs font-black text-neon-cyan uppercase tracking-[0.4em] mb-1">Admin</h2>
            <p className="text-[10px] text-app-text-muted uppercase tracking-widest">Dashboard</p>
          </div>
          <div className="py-8 flex-grow overflow-y-auto">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Briefcase} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
            <SidebarItem icon={Zap} label="Skills" active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} />
            <SidebarItem icon={Quote} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
            <SidebarItem icon={MessageCircle} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
            <SidebarItem icon={Folder} label="Files" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
            <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
          <div className="p-8 flex items-center gap-3 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[10px] text-app-text-muted uppercase tracking-widest">Connected</span>
          </div>
        </aside>

        {/* Main Content */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto">
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {viewCache.current[activeTab]}
              </motion.div>
            </AnimatePresence>

            <footer className="mt-24 pt-8 border-t border-app-border flex justify-between items-center">
              <div className="flex gap-8 text-[8px] text-app-text-muted uppercase tracking-widest">
                <span>Dashboard // <span className="text-neon-cyan">Admin Panel</span></span>
              </div>
              <div className="text-[8px] text-app-text-muted uppercase tracking-widest">
                © 2024 Portfolio Admin
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <ToastProvider>
      <DashboardInner onLogout={onLogout} />
    </ToastProvider>
  );
}
