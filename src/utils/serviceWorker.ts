// Service Worker Registration Utility

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered with scope:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              if (window.confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      // Check for service worker updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.unregister();
  }
};

// Check if app is installed (PWA)
export const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (registration: ServiceWorkerRegistration) => {
  if ('PushManager' in window) {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
      });
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }
  return null;
};

// Show offline indicator
export const showOfflineIndicator = () => {
  const indicator = document.createElement('div');
  indicator.id = 'offline-indicator';
  indicator.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 z-50';
  indicator.textContent = 'You are currently offline';
  document.body.appendChild(indicator);

  // Remove when online
  window.addEventListener('online', () => {
    indicator.remove();
  });
};

// Monitor connection status
export const monitorConnectionStatus = () => {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    if (!isOnline) {
      showOfflineIndicator();
    } else {
      const indicator = document.getElementById('offline-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Initial check
  updateOnlineStatus();
};
