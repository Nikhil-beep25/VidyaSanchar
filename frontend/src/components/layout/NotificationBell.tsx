import React, { useEffect, useState, useRef } from 'react';
import { apiRequest } from '../../lib/api';
import { Bell, Check, Trash2, Calendar, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const NotificationBell: React.FC = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const data = await apiRequest('/notifications');
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll every 30 seconds for live notification updates
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success('Notification marked as read.');
    } catch (err) {
      toast.error('Failed to mark notification as read.');
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;

    try {
      await Promise.all(
        unread.map(n => apiRequest(`/notifications/${n.id}/read`, { method: 'PATCH' }))
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to clear notifications.');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-accent relative transition-colors focus-visible:outline-none"
        aria-label="Open Notifications Center"
      >
        <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary text-[9px] font-extrabold text-primary-foreground flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2.5 w-80 bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted/20">
            <div>
              <h3 className="font-bold text-sm text-foreground">Notifications</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {unreadCount} unread messages
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-semibold text-primary hover:underline flex items-center"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-border">
            {notifications.map(item => (
              <div
                key={item.id}
                className={`p-4 transition-colors hover:bg-muted/10 flex items-start space-x-3 text-xs relative ${
                  !item.isRead ? 'bg-primary/5' : ''
                }`}
              >
                {!item.isRead && (
                  <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                )}
                <div className="flex-grow space-y-1 pr-4">
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{item.message}</p>
                  <span className="text-[9px] text-muted-foreground block font-medium">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {!item.isRead && (
                  <button
                    onClick={(e) => handleMarkAsRead(item.id, e)}
                    className="p-1 rounded-lg border hover:bg-emerald-50 hover:text-emerald-600 transition-colors self-center text-muted-foreground"
                    title="Mark Read"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
                <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                <p>No new notifications registered.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
