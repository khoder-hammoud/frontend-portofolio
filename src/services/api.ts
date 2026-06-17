// API Service for Backend Communication

export const API_URL = "https://backend-portofolio-production-ad17.up.railway.app";
const API_TIMEOUT = 30000; // 30 seconds (Atlas M0 can be slow)

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit & { timeout?: number }): Promise<T> {
  try {
    const token = localStorage.getItem('auth_token');
    const controller = new AbortController();
    const { timeout: timeoutMs, ...fetchOptions } = options || {};
    const timeout = setTimeout(() => controller.abort(), timeoutMs || API_TIMEOUT);
    const isFormData = fetchOptions?.body instanceof FormData;
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...fetchOptions?.headers,
      },
      signal: controller.signal,
      ...fetchOptions,
    });
    clearTimeout(timeout);

    let result: any;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { message: text };
    }

    if (!response.ok) {
      console.error('API Error:', result);
      throw new Error(`API Error: ${result.message || response.statusText}`);
    }
    
    // Backend returns { success: true, data: ... } format
    // Extract the data property if it exists
    return result.data !== undefined ? result.data : result;
  } catch (error) {
    // console.error('Fetch error:', error);
    throw error;
  }
}

// Helper to convert icon component to string name
function serializeIcon(icon: any): string {
  if (typeof icon === 'string') return icon;
  if (icon?.displayName) return icon.displayName;
  if (icon?.name) return icon.name;
  return 'Code2'; // default
}

// Helper to prepare project for API
function serializeProject(project: any) {
  const { id, ...rest } = project;
  return {
    ...rest,
    // Don't send id - let MongoDB generate _id
    stack: project.stack?.map((s: any) => ({
      name: s.name,
      icon: serializeIcon(s.icon),
      color: s.color
    })) || []
  };
}

// Helper to prepare skill for API
function serializeSkill(skill: any) {
  return {
    ...skill,
    icon: serializeIcon(skill.icon)
  };
}

// Projects API
export const projectsAPI = {
  getAll: () => apiCall<any[]>('/api/projects', { timeout: 120000 }),
  getById: (id: string) => apiCall<any>(`/api/projects/${id}`),
  create: (project: any) => apiCall<any>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(serializeProject(project)),
  }),
  update: (id: string, project: any) => apiCall<any>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serializeProject(project)),
  }),
  delete: (id: string) => apiCall<void>(`/api/projects/${id}`, {
    method: 'DELETE',
  }),
  reorder: (orders: { id: string; priority: number }[]) => apiCall<void>('/api/projects/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orders }),
  }),
};

// Skills API
export const skillsAPI = {
  getAll: () => apiCall<any[]>('/api/skills'),
  getById: (id: string) => apiCall<any>(`/api/skills/${id}`),
  create: (skill: any) => apiCall<any>('/api/skills', {
    method: 'POST',
    body: JSON.stringify(serializeSkill(skill)),
  }),
  update: (id: string, skill: any) => apiCall<any>(`/api/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serializeSkill(skill)),
  }),
  delete: (id: string) => apiCall<void>(`/api/skills/${id}`, {
    method: 'DELETE',
  }),
  // Label-based operations (frontend uses label as identifier)
  getByLabel: (label: string) => apiCall<any>(`/api/skills/label/${encodeURIComponent(label)}`),
  updateByLabel: (label: string, skill: any) => apiCall<any>(`/api/skills/label/${encodeURIComponent(label)}`, {
    method: 'PUT',
    body: JSON.stringify(serializeSkill(skill)),
  }),
  deleteByLabel: (label: string) => apiCall<void>(`/api/skills/label/${encodeURIComponent(label)}`, {
    method: 'DELETE',
  }),
};

// Health Check
export const healthCheck = () => apiCall<{ status: string; message: string }>('/api/health');

// Auth API
export const authAPI = {
  login: (email: string, password: string) => apiCall<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
};

// Settings API
export const settingsAPI = {
  get: () => apiCall<any>('/api/settings'),
  update: (settings: any) => apiCall<any>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  verifyPassword: (password: string) => apiCall<any>('/api/settings/verify-password', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
};

// Upload API
export const uploadAPI = {
  single: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/upload/single`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Upload failed');
    }
    
    return result.data;
  },
  multiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Upload failed');
    }
    
    return result.data;
  },
  delete: (filename: string) => apiCall<void>(`/api/upload/${filename}`, {
    method: 'DELETE',
  }),
};

// Messages API
export const messagesAPI = {
  create: (data: { name: string; email: string; subject: string; message: string }) => apiCall<any>('/api/messages', {
    method: 'POST',
    body: JSON.stringify(data),
    timeout: 30000,
  }),
  getAll: (params?: { isRead?: boolean; page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.isRead !== undefined) query.set('isRead', String(params.isRead));
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    return apiCall<any>(`/api/messages?${query}`);
  },
  getById: (id: string) => apiCall<any>(`/api/messages/${id}`),
  markAsRead: (id: string) => apiCall<any>(`/api/messages/${id}/read`, {
    method: 'PATCH',
  }),
  delete: (id: string) => apiCall<void>(`/api/messages/${id}`, {
    method: 'DELETE',
  }),
};

// Reviews API
export const reviewsAPI = {
  getAll: (isApproved?: boolean) => {
    const query = isApproved !== undefined ? `?isApproved=${isApproved}` : '';
    return apiCall<any[]>(`/api/reviews${query}`);
  },
  create: (review: any) => apiCall<any>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  }),
  approve: (id: string) => apiCall<any>(`/api/reviews/${id}/approve`, {
    method: 'PATCH',
  }),
  reject: (id: string) => apiCall<any>(`/api/reviews/${id}/reject`, {
    method: 'PATCH',
  }),
  delete: (id: string) => apiCall<void>(`/api/reviews/${id}`, {
    method: 'DELETE',
  }),
};

// Experiences API
export const experiencesAPI = {
  getAll: () => apiCall<any[]>('/api/experiences'),
  create: (experience: any) => apiCall<any>('/api/experiences', {
    method: 'POST',
    body: JSON.stringify(experience),
  }),
  update: (id: string, experience: any) => apiCall<any>(`/api/experiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(experience),
  }),
  delete: (id: string) => apiCall<void>(`/api/experiences/${id}`, {
    method: 'DELETE',
  }),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params?: { isRead?: boolean; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.isRead !== undefined) query.set('isRead', String(params.isRead));
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return apiCall<any>(`/api/notifications?${query}`);
  },
  markAsRead: (id: string) => apiCall<any>(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  }),
  markAllAsRead: () => apiCall<any>('/api/notifications/read-all', {
    method: 'PATCH',
  }),
  delete: (id: string) => apiCall<void>(`/api/notifications/${id}`, {
    method: 'DELETE',
  }),
  clearRead: () => apiCall<any>('/api/notifications/clear-read', {
    method: 'DELETE',
  }),
};

// Analytics API
export const analyticsAPI = {
  getSummary: (days = 30) => apiCall<any>(`/api/analytics/summary?days=${days}`),
  getTimeline: (days = 30) => apiCall<any[]>(`/api/analytics/timeline?days=${days}`),
  getDeviceStats: (days = 30) => apiCall<any>(`/api/analytics/devices?days=${days}`),
  getTopProjects: (days = 30, limit = 5) => apiCall<any[]>(`/api/analytics/top-projects?days=${days}&limit=${limit}`),
  trackPageView: (data: any) => apiCall<void>('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  seedData: () => apiCall<any>('/api/analytics/seed', {
    method: 'POST',
  }),
};

// Media API (compressed uploads for projects)
export const mediaAPI = {
  upload: async (file: File | Blob, fileName?: string) => {
    const formData = new FormData();
    const fileToUpload = file instanceof File
      ? file
      : new File([file], fileName || 'upload', { type: file.type });
    formData.append('file', fileToUpload);
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/media/upload`, {
      method: 'POST',
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Upload failed');
    return result.data as { url: string; size: number; type: string };
  },
};

// Uploads / Files API
export const uploadsAPI = {
  upload: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return apiCall<any>('/api/upload/single', {
      method: 'POST',
      body: formData,
    });
  },
  list: () => apiCall<any[]>('/api/upload/files'),
  sync: () => apiCall<any>('/api/upload/sync', { method: 'POST' }),
  delete: (filename: string) => apiCall<void>(`/api/upload/filename/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  }),
};
