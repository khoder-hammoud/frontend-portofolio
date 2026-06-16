import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Clock } from 'lucide-react';
import { Notification } from '../DataContext';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const NotificationsPanel = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClose
}: NotificationsPanelProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'review': return '📝';
      case 'project': return '📊';
      case 'skill': return '🎯';
      default: return '⚠️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-16 right-0 w-96 bg-card-bg border-2 border-neon-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,255,0.3)] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-app-border bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-neon-cyan" />
            <h3 className="text-sm font-black text-app-text uppercase tracking-widest">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-neon-purple text-black text-[8px] font-black rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-app-text-muted hover:text-neon-cyan transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-[8px] text-neon-cyan uppercase tracking-widest hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="text-app-text/10 mx-auto mb-4" />
            <p className="text-[10px] text-app-text-muted uppercase tracking-widest">
              No notifications
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 border-b border-app-border hover:bg-card-bg/50 transition-colors ${
                  !notification.read ? 'bg-neon-cyan/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold text-app-text uppercase tracking-tight">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-neon-cyan rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[10px] text-app-text-muted mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[8px] text-app-text-muted uppercase tracking-widest">
                        <Clock size={10} />
                        {getTimeAgo(notification.timestamp)}
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-neon-cyan hover:text-white transition-colors"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(notification.id)}
                          className="text-app-text-muted hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};
