import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect, useRef } from 'react';

import { 

  PROJECTS as INITIAL_PROJECTS, 

  SKILLS as INITIAL_SKILLS,

  STATS as INITIAL_STATS,

  TESTIMONIALS as INITIAL_TESTIMONIALS,

  EXPERIENCE as INITIAL_EXPERIENCE

} from './constants';

import { projectsAPI, skillsAPI, settingsAPI, reviewsAPI, experiencesAPI, notificationsAPI } from './services/api';

import * as LucideIcons from 'lucide-react';
import * as SIIcons from 'react-icons/si';

import type { ComponentType } from 'react';



// Helper to map icon string names to actual icon components
const getIconComponent = (iconName: string): ComponentType => {
  const luMap: Record<string, ComponentType> = LucideIcons as unknown as Record<string, ComponentType>;
  const siMap: Record<string, ComponentType> = SIIcons as unknown as Record<string, ComponentType>;
  return luMap[iconName] || siMap[iconName] || luMap.Code2 || (() => null);
};

// Map skill color names to hex values (must match Dashboard.tsx SKILL_COLOR_MAP)
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

// Cache helpers — persist API data to localStorage so it survives page reloads
const CACHE_KEY = 'portfolio_data_cache';

function saveToCache(data: any) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data cache:', e);
  }
}

function loadFromCache(): any | null {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}



// Types

export interface Stat {

  label: string;

  value: string;

}



export interface Experience {

  id: string;

  company: string;

  role: string;

  period: string;

  description: string;

}



export interface Testimonial {

  id: string;

  name: string;

  role: string;

  text: string;

  avatar: string;

  rating?: number;

  status?: 'pending' | 'approved' | 'rejected';

  createdAt?: string;

}



export interface Notification {

  id: string;

  type: 'review' | 'project' | 'skill' | 'system';

  title: string;

  message: string;

  timestamp: string;

  read: boolean;

  data?: any;

}



export interface Project {

  id: string;

  title: string;

  subtitle: string;

  description: string;

  image: string;

  images?: string[];

  overview: string;

  features: { text: string; icon: string }[];

  stack: { name: string; icon: any; color: string }[];

  highlight?: boolean;

  showOnHome?: boolean;

  demoVideo?: string;

  liveUrl?: string;

  githubUrl?: string;

  createdAt?: string;

  updatedAt?: string;

}



export interface Skill {

  icon: any;

  label: string;

  sublabel: string;

  color: string;

  level: number;

  iconName?: string;

}



export interface Settings {

  displayName: string;

  technicalBio: string;

  aboutMe: string;

  githubUri: string;

  linkedinUri: string;

  whatsappNumber: string;

  contactEmail: string;

  cvDownloadUrl: string;

  profileImage: string;

  location: string;

  siteTitle: string;

  siteDescription: string;

  siteKeywords: string;

  favicon: string;

}



interface DataContextType {

  projects: Project[];

  skills: Skill[];

  stats: Stat[];

  experience: Experience[];

  testimonials: Testimonial[];

  notifications: Notification[];

  settings: Settings;

  loading: boolean;
  loadingProgress: number;

  error: string | null;

  operationLoading: boolean;

  addProject: (project: Project) => Promise<void>;

  deleteProject: (id: string) => Promise<void>;

  updateProject: (id: string, project: Project) => Promise<void>;

  addSkill: (skill: Skill) => Promise<void>;

  deleteSkill: (label: string) => Promise<void>;

  updateSkill: (label: string, skill: Skill) => Promise<void>;

  updateStats: (stats: Stat[]) => void;

  updateExperience: (experience: Experience[]) => void;

  addTestimonial: (testimonial: Testimonial) => void;

  deleteTestimonial: (id: string) => void;

  updateTestimonials: (testimonials: Testimonial[]) => void;

  approveTestimonial: (id: string) => void;

  rejectTestimonial: (id: string) => void;

  markNotificationAsRead: (id: string) => void;

  markAllNotificationsAsRead: () => void;

  deleteNotification: (id: string) => void;

  isLoggedIn: boolean;

  setIsLoggedIn: (val: boolean) => void;

  logout: () => void;

  updateSettings: (settings: Settings, password?: string, stats?: Stat[]) => void;

  refreshData: () => Promise<void>;

}



const DataContext = createContext<DataContextType | undefined>(undefined);



export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Try loading cached data first so the UI shows something immediately
  const cachedData = loadFromCache();

  const [projects, setProjects] = useState<Project[]>(() => {
    if (cachedData?.projects?.length) {
      return cachedData.projects.map((p: any) => ({
        ...p,
        id: p._id || p.id,
        stack: Array.isArray(p.stack) ? p.stack.map((t: any) => ({
          ...t,
          icon: typeof t.icon === 'string' ? getIconComponent(t.icon) : t.icon
        })) : [],
        features: Array.isArray(p.features) ? p.features : [],
        showOnHome: p.highlight || p.showOnHome || false
      }));
    }
    return INITIAL_PROJECTS;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    if (cachedData?.skills?.length) {
      return cachedData.skills.map((s: any) => ({
        ...s,
        id: s._id || s.id,
        colorHex: SKILL_COLOR_MAP[s.color] || s.color,
        icon: typeof s.icon === 'string' ? getIconComponent(s.icon) : s.icon
      }));
    }
    return INITIAL_SKILLS;
  });

  const [stats, setStats] = useState<Stat[]>(INITIAL_STATS);

  const [experience, setExperience] = useState<Experience[]>(() => {
    if (cachedData?.experience?.length) {
      return cachedData.experience.map((e: any, i: number) => ({
        id: e._id || e.id || `exp-${i}`,
        company: e.company || '',
        role: e.role || '',
        period: e.period || '',
        description: e.description || ''
      }));
    }
    return INITIAL_EXPERIENCE.map((exp, i) => ({ ...exp, id: `exp-${i}` }));
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    if (cachedData?.testimonials?.length) {
      return cachedData.testimonials.map((r: any) => ({
        id: r.uuid || r._id || r.id,
        name: r.name,
        role: r.role || '',
        text: r.text,
        avatar: r.avatar || '',
        rating: r.rating || 5,
        status: r.status || (r.isApproved ? 'approved' : 'pending'),
        createdAt: r.createdAt
      }));
    }
    return INITIAL_TESTIMONIALS;
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const backendNotifIds = useRef(new Set<string>());

  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [operationLoading, setOperationLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  

  // Load settings from localStorage or use defaults

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));

  const [settings, setSettings] = useState<Settings>(() => {

    const saved = localStorage.getItem('portfolio_settings');

    if (saved) {

      try {

        return JSON.parse(saved);

      } catch (e) {

        console.error('Failed to parse settings:', e);

      }

    }

    return {

      displayName: 'Khoder Hammoud',

      technicalBio: 'SYSTEM ARCHITECT AND UI SPECIALIST SPECIALIZING IN INDUSTRIAL CYBER-BRUTALISM. PUSHING THE BOUNDARIES OF DIGITAL INTERFACES THROUGH GEOMETRIC AGGRESSION AND HIGH-CONTRAST PHOSPHORUS AESTHETICS.',

      aboutMe: 'I am a passionate Full Stack Developer dedicated to crafting high-performance, modular, and data-driven web experiences. With a focus on precision and modern architecture, I bridge the gap between complex backend logic and seamless frontend interactions.',

      githubUri: 'https://github.com/',

      linkedinUri: 'https://linkedin.com/',

      whatsappNumber: '+1234567890',

      contactEmail: 'hello@example.com',

      cvDownloadUrl: '',

      profileImage: '/me.png.jpg',

      location: 'Remote / Worldwide',

      dashboardPassword: '' // Password only verified server-side

    };

  });

  // Fetch data from backend on mount

  const refreshData = useCallback(async () => {
    const token = localStorage.getItem('auth_token');

    setLoading(true);
    setLoadingProgress(0);

    setError(null);

    try {

      // Track real progress as each API call completes
      const totalCalls = 6;
      let completed = 0;
      const track = () => {
        completed++;
        setLoadingProgress(Math.round((completed / totalCalls) * 100));
      };

      const p1 = projectsAPI.getAll().catch(() => null).finally(track);
      const p2 = skillsAPI.getAll().catch(() => null).finally(track);
      const p3 = settingsAPI.get().catch(() => null).finally(track);
      const p4 = reviewsAPI.getAll().catch(() => null).finally(track);
      const p5 = experiencesAPI.getAll().catch(() => null).finally(track);
      const p6 = (token ? notificationsAPI.getAll().catch(() => null) : Promise.resolve(null)).finally(track);

      const [projectsData, skillsData, settingsData, reviewsData, experiencesData, notificationsData] = await Promise.all([p1, p2, p3, p4, p5, p6]);



      // If backend has data, use it; otherwise keep initial data

      // Map _id to id for frontend compatibility

      if (projectsData && projectsData.length > 0) {

        const mappedProjects = projectsData.map((p: any) => ({

          ...p,

          id: p._id || p.id,

          // Map icon strings to components

          stack: Array.isArray(p.stack) ? p.stack.map((tech: any) => ({

            ...tech,

            icon: typeof tech.icon === 'string' ? getIconComponent(tech.icon) : tech.icon

          })) : [],

          // Ensure features array exists

          features: Array.isArray(p.features) ? p.features : [],

          // Map highlight to showOnHome

          showOnHome: p.highlight || p.showOnHome || false

        }));

        setProjects(mappedProjects);

      }

      if (skillsData && skillsData.length > 0) {

        const mappedSkills = skillsData.map((s: any) => ({

          ...s,

          id: s._id || s.id,

          colorHex: SKILL_COLOR_MAP[s.color] || s.color,

          // Map icon string to component

          icon: typeof s.icon === 'string' ? getIconComponent(s.icon) : s.icon

        }));

        setSkills(mappedSkills);

      }

      if (settingsData) {

        // Map backend settings to frontend format

        const mappedSettings = {

          displayName: settingsData.displayName,

          technicalBio: settingsData.technicalBio,

          aboutMe: settingsData.aboutMe,

          githubUri: settingsData.socialLinks?.github || '',

          linkedinUri: settingsData.socialLinks?.linkedin || '',

          whatsappNumber: settingsData.whatsappNumber || '',

          contactEmail: settingsData.contactEmail,

          cvDownloadUrl: settingsData.cvDownloadUrl || '',

          profileImage: settingsData.profileImage,

          location: settingsData.location,

          siteTitle: settingsData.siteTitle || '',
          siteDescription: settingsData.siteDescription || '',
          siteKeywords: settingsData.siteKeywords || '',
          favicon: settingsData.favicon || '',

        };

        setSettings(mappedSettings);

        localStorage.setItem('portfolio_settings', JSON.stringify(mappedSettings));

        // Parse stats from backend settings
        if (settingsData.stats && typeof settingsData.stats === 'object') {
          const parsedStats: Stat[] = Object.entries(settingsData.stats).map(([key, val]) => ({
            label: key.replace(/([A-Z])/g, '_$1').toUpperCase(),
            value: String(val)
          }));
          setStats(parsedStats);
        }

      }

      if (reviewsData && reviewsData.length > 0) {
        const mappedReviews = reviewsData.map((r: any) => ({
          id: r.uuid || r._id || r.id,
          name: r.name,
          role: r.role || '',
          text: r.text,
          avatar: r.avatar || '',
          rating: r.rating || 5,
          status: r.status || (r.isApproved ? 'approved' : 'pending'),
          createdAt: r.createdAt
        }));
        setTestimonials(mappedReviews);
      }

      if (experiencesData && experiencesData.length > 0) {
        const mappedExperiences = experiencesData.map((e: any, i: number) => ({
          id: e._id || e.id || `exp-${i}`,
          company: e.company || '',
          role: e.role || '',
          period: e.period || '',
          description: e.description || ''
        }));
        setExperience(mappedExperiences);
      }

      if (notificationsData && notificationsData.length > 0) {
        const ids = new Set<string>();
        const mappedNotifications = notificationsData.map((n: any) => {
          const id = n.uuid || n._id || n.id;
          ids.add(id);
          return {
            id,
            type: n.type || 'system',
            title: n.title || '',
            message: n.content || n.message || '',
            timestamp: n.createdAt || n.timestamp,
            read: n.isRead || false,
            data: n.link ? { link: n.link } : undefined
          };
        });
        backendNotifIds.current = ids;
        setNotifications(mappedNotifications);
      }

      // Save raw API data to cache for next page load
      const cachePayload: any = {};
      if (projectsData?.length) cachePayload.projects = projectsData;
      if (skillsData?.length) cachePayload.skills = skillsData;
      if (experiencesData?.length) cachePayload.experience = experiencesData;
      if (reviewsData?.length) cachePayload.testimonials = reviewsData;
      if (settingsData) cachePayload.settings = settingsData;
      if (Object.keys(cachePayload).length > 0) saveToCache(cachePayload);

    } catch (err) {

      console.warn('Backend not available, using local data:', err);

      setError('Backend not connected - using local data');

    } finally {

      setLoading(false);
      setLoadingProgress(100);

    }

  }, []);



  // Load data on mount

  useEffect(() => {

    refreshData();

  }, [refreshData]);



  // Projects CRUD with API

  const addProject = useCallback(async (project: Project) => {

    try {

      setOperationLoading(true);

      const newProject = await projectsAPI.create(project);

      // Backend returns project with _id, map it to id for frontend

      const mappedProject = { ...newProject, id: newProject._id || newProject.id };

      setProjects(prev => [mappedProject, ...prev]);

    } catch (err) {

      console.error('Failed to add project:', err);

      // Fallback to local state

      setProjects(prev => [project, ...prev]);

      throw err;

    } finally {

      setOperationLoading(false);

    }

  }, []);



  const deleteProject = useCallback(async (id: string) => {

    try {

      setOperationLoading(true);

      await projectsAPI.delete(id);

      setProjects(prev => prev.filter(p => p.id !== id));

    } catch (err) {

      console.error('Failed to delete project:', err);

      // Fallback to local state

      setProjects(prev => prev.filter(p => p.id !== id));

      throw err;

    } finally {

      setOperationLoading(false);

    }

  }, []);



  const updateProject = useCallback(async (id: string, updatedProject: Project) => {

    try {

      setOperationLoading(true);

      const updated = await projectsAPI.update(id, updatedProject);

      setProjects(prev => prev.map(p => p.id === id ? updated : p));

    } catch (err) {

      console.error('Failed to update project:', err);

      // Fallback to local state

      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));

      throw err;

    } finally {

      setOperationLoading(false);

    }

  }, []);



  // Skills CRUD with API

  const addSkill = useCallback(async (skill: Skill) => {

    try {

      setOperationLoading(true);

      const result = await skillsAPI.create(skill);

      const newSkill = {
        ...result,
        id: result._id || result.id,
        colorHex: SKILL_COLOR_MAP[result.color] || result.color,
        icon: typeof result.icon === 'string' ? getIconComponent(result.icon) : result.icon,
      };

      setSkills(prev => [...prev, newSkill]);

    } catch (err) {

      console.error('Failed to add skill:', err);

      // Fallback to local state

      const fallback = {
        ...skill,
        colorHex: SKILL_COLOR_MAP[skill.color] || skill.color,
      };

      setSkills(prev => [...prev, fallback]);

      throw err;

    } finally {

      setOperationLoading(false);

    }

  }, []);



  const deleteSkill = useCallback(async (label: string) => {

    try {

      setOperationLoading(true);

      const skillToDelete = skills.find(s => s.label === label);

      if (skillToDelete) {

        await skillsAPI.deleteByLabel(skillToDelete.label);

      }

      setSkills(prev => prev.filter(s => s.label !== label));

    } catch (err) {

      console.error('Failed to delete skill:', err);

      setSkills(prev => prev.filter(s => s.label !== label));

      throw err;

    } finally {

      setOperationLoading(false);

    }

  }, [skills]);



  const updateSkill = useCallback(async (label: string, updatedSkill: Skill) => {

    try {

      setOperationLoading(true);

      const result = await skillsAPI.updateByLabel(label, updatedSkill);

      const mapped = {
        ...result,
        id: result._id || result.id,
        colorHex: SKILL_COLOR_MAP[result.color] || result.color,
        icon: typeof result.icon === 'string' ? getIconComponent(result.icon) : result.icon,
      };

      setSkills(prev => prev.map(s => s.label === label ? mapped : s));

    } catch (err) {

      console.error('Failed to update skill:', err);

      const fallback = {
        ...updatedSkill,
        colorHex: SKILL_COLOR_MAP[updatedSkill.color] || updatedSkill.color,
      };

      setSkills(prev => prev.map(s => s.label === label ? fallback : s));

      throw err;

    } finally {

      setOperationLoading(false);

    }

  }, []);



  // Local-only operations (not synced with backend yet)

  const updateSettings = useCallback(async (newSettings: Settings, password?: string, newStats?: Stat[]) => {

    try {

      setOperationLoading(true);

      const backendSettings: any = {

        displayName: newSettings.displayName,

        technicalBio: newSettings.technicalBio,

        aboutMe: newSettings.aboutMe,

        socialLinks: {

          github: newSettings.githubUri,

          linkedin: newSettings.linkedinUri,

          whatsapp: newSettings.whatsappNumber

        },

        whatsappNumber: newSettings.whatsappNumber,

        contactEmail: newSettings.contactEmail,

        cvDownloadUrl: newSettings.cvDownloadUrl,

        profileImage: newSettings.profileImage,

        location: newSettings.location,

        siteTitle: newSettings.siteTitle,

        siteDescription: newSettings.siteDescription,

        siteKeywords: newSettings.siteKeywords,

        favicon: newSettings.favicon,

        ...(password ? { dashboardPassword: password } : {})

      };

      if (newStats) {
        const statsObj: any = {};
        newStats.forEach(s => {
          const key = s.label.toLowerCase().replace(/\s+/g, '');
          statsObj[key] = s.value;
        });
        backendSettings.stats = statsObj;
        setStats(newStats);
      }

      await settingsAPI.update(backendSettings);

      setSettings(newSettings);

      localStorage.setItem('portfolio_settings', JSON.stringify(newSettings));

    } catch (err) {

      console.error('Failed to update settings:', err);

      setSettings(newSettings);

      localStorage.setItem('portfolio_settings', JSON.stringify(newSettings));

      throw err;

    } finally {

      setOperationLoading(false);

    }

  }, []);



  const updateStats = useCallback((newStats: Stat[]) => {

    setStats(newStats);

  }, []);



  const updateExperience = useCallback(async (newExperience: Experience[]) => {

    setExperience(newExperience);

    try {
      const existing = await experiencesAPI.getAll().catch(() => []);
      for (const exp of newExperience) {
        const isNew = !exp.id || exp.id.startsWith('exp-') || !existing.find((e: any) => (e._id || e.id) === exp.id);
        if (isNew) {
          await experiencesAPI.create({
            company: exp.company,
            role: exp.role,
            period: exp.period,
            description: exp.description
          });
        } else {
          await experiencesAPI.update(exp.id, {
            company: exp.company,
            role: exp.role,
            period: exp.period,
            description: exp.description
          });
        }
      }
    } catch (err) {
      console.error('Failed to sync experiences:', err);
    }

  }, []);



  const addTestimonial = useCallback(async (newTestimonial: Testimonial) => {

    const testimonialWithStatus = {

      ...newTestimonial,

      status: 'pending' as const,

      createdAt: new Date().toISOString()

    };

    setTestimonials(prev => [testimonialWithStatus, ...prev]);

    try {
      const result = await reviewsAPI.create({
        name: newTestimonial.name,
        role: newTestimonial.role,
        text: newTestimonial.text,
        avatar: newTestimonial.avatar,
        rating: newTestimonial.rating || 5
      });
      if (result?._id || result?.id || result?.uuid) {
        setTestimonials(prev => prev.map(t =>
          t.id === newTestimonial.id ? { ...t, id: result.uuid || result._id || result.id } : t
        ));
      }
    } catch (err) {
      console.error('Failed to submit review to server:', err);
      setTestimonials(prev => prev.filter(t => t.id !== newTestimonial.id));
      return;
    }

    const notification: Notification = {

      id: crypto.randomUUID(),

      type: 'review',

      title: 'New Review Pending',

      message: `${newTestimonial.name} submitted a new review`,

      timestamp: new Date().toISOString(),

      read: false,

      data: { testimonialId: newTestimonial.id }

    };

    setNotifications(prev => [notification, ...prev]);

  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {

    setTestimonials(prev => prev.filter(t => t.id !== id));

    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await reviewsAPI.delete(id);
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
    }

  }, []);

  const updateTestimonials = useCallback((newTestimonials: Testimonial[]) => {

    setTestimonials(newTestimonials);

  }, []);

  const approveTestimonial = useCallback(async (id: string) => {

    setTestimonials(prev => prev.map(t => 

      t.id === id ? { ...t, status: 'approved' as const } : t

    ));

    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await reviewsAPI.approve(id);
      } catch (err) {
        console.error('Failed to approve review:', err);
      }
    }

  }, []);

  const rejectTestimonial = useCallback(async (id: string) => {

    setTestimonials(prev => prev.map(t => 

      t.id === id ? { ...t, status: 'rejected' as const } : t

    ));

    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await reviewsAPI.reject(id);
      } catch (err) {
        console.error('Failed to reject review:', err);
      }
    }

  }, []);



  const markNotificationAsRead = useCallback(async (id: string) => {

    setNotifications(prev => prev.map(n => 

      n.id === id ? { ...n, read: true } : n

    ));

    if (backendNotifIds.current.has(id)) {
      try {
        await notificationsAPI.markAsRead(id);
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }

  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      await notificationsAPI.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }

  }, []);

  const deleteNotification = useCallback(async (id: string) => {

    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      await notificationsAPI.delete(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }

  }, []);



  const logout = useCallback(() => {

    localStorage.removeItem('auth_token');

    setIsLoggedIn(false);

  }, []);



  const contextValue = useMemo(() => ({

    projects, 

    skills, 

    stats,

    experience,

    testimonials,

    notifications,

    settings,

    loading,
    loadingProgress,

    operationLoading,

    isLoggedIn,

    setIsLoggedIn,

    logout,

    error,

    addProject, 

    deleteProject, 

    updateProject,

    addSkill,

    deleteSkill,

    updateSkill,

    updateStats,

    updateExperience,

    addTestimonial,

    deleteTestimonial,

    updateTestimonials,

    approveTestimonial,

    rejectTestimonial,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification,

    updateSettings,

    refreshData

  }), [projects, skills, stats, experience, testimonials, notifications, settings, loading, loadingProgress, operationLoading, error, addProject, deleteProject, updateProject, addSkill, deleteSkill, updateSkill, updateStats, updateExperience, addTestimonial, deleteTestimonial, updateTestimonials, approveTestimonial, rejectTestimonial, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, updateSettings, refreshData]);



  return (

    <DataContext.Provider value={contextValue}>

      {children}

    </DataContext.Provider>

  );

};



export const useData = () => {

  const context = useContext(DataContext);

  if (context === undefined) {

    throw new Error('useData must be used within a DataProvider');

  }

  return context;

};

