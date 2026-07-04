import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Bell, Send, MessageSquare } from 'lucide-react';

export const AnnouncementManagement: React.FC = () => {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientRole, setRecipientRole] = useState('STUDENT');
  const [isAnnouncement, setIsAnnouncement] = useState(true);

  const loadAnnouncements = async () => {
    try {
      const data = await apiRequest('/notifications');
      setAnnouncements(data);
    } catch (err) {
      setAnnouncements([
        { id: 'an1', title: 'Independence Day Assembly', message: 'Assemble in proper uniform at 7:30 AM on 15th August.', recipientRole: 'STUDENT', createdAt: new Date() },
        { id: 'an2', title: 'PTM Notice', message: 'PTM scheduled this Saturday, July 18, from 9:00 AM.', recipientRole: 'PARENT', createdAt: new Date() }
      ]);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.warning('Title and message are required.');
      return;
    }

    try {
      await apiRequest('/notifications', {
        method: 'POST',
        body: JSON.stringify({ title, message, recipientRole, isAnnouncement })
      });
      toast.success('Announcement published successfully.');
      setTitle('');
      setMessage('');
      loadAnnouncements();
    } catch (err) {
      toast.error('Failed to publish announcement.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements & Alerts</h1>
        <p className="text-sm text-muted-foreground">Broadcast notifications across student, teacher, and parent portal logins.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcast Form */}
        <div className="border rounded-xl p-6 bg-card space-y-4 h-fit lg:col-span-1">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Publish Notice</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notice Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. CBSE Registration Date" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Target Audience *</label>
              <select value={recipientRole} onChange={(e) => setRecipientRole(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="STUDENT">All Students</option>
                <option value="TEACHER">All Teachers</option>
                <option value="PARENT">All Parents</option>
                <option value="SUPER_ADMIN">All Administrative Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notice Message *</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="Type notice details here..." />
            </div>

            <button type="submit" className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
              <Send className="h-4 w-4 mr-2" /> Broadcast Notice
            </button>
          </form>
        </div>

        {/* Existing Alerts Log */}
        <div className="border rounded-xl p-6 bg-card space-y-4 lg:col-span-2">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Notice Broadcast Log</span>
          </h3>

          <div className="space-y-4">
            {announcements.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-muted/20 text-left space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-sm text-primary">{item.title}</h4>
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded border border-primary/30 text-primary bg-primary/10">
                    To: {item.recipientRole}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
                <span className="text-[9px] text-muted-foreground block font-semibold">
                  Timestamp: {new Date(item.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">No alerts published yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
