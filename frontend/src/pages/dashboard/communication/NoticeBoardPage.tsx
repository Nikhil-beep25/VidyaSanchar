import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import {
  Bell,
  Pin,
  Megaphone,
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Paperclip,
  X,
  Search
} from 'lucide-react';

export const NoticeBoardPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [notices, setNotices] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Notice Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('SCHOOL');
  const [classId, setClassId] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [attachment, setAttachment] = useState('');

  const loadNotices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/notices');
      if (Array.isArray(data)) {
        setNotices(data);
      }
    } catch (err) {
      toast.error('Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'TEACHER') {
      try {
        const data = await apiRequest('/classes');
        if (Array.isArray(data)) {
          setClasses(data);
        }
      } catch (err) {
        console.error('Failed to load classes', err);
      }
    }
  };

  useEffect(() => {
    loadNotices();
    loadClasses();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Please enter all required fields.');
      return;
    }
    try {
      await apiRequest('/notices', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          type,
          classId: classId || undefined,
          isPinned,
          attachment: attachment || undefined
        })
      });
      toast.success('Notice published successfully.');
      setModalOpen(false);
      // Reset form
      setTitle('');
      setContent('');
      setType('SCHOOL');
      setClassId('');
      setIsPinned(false);
      setAttachment('');
      loadNotices();
    } catch (err) {
      toast.error('Failed to publish notice.');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await apiRequest(`/notices/${id}`, { method: 'DELETE' });
      toast.success('Notice deleted.');
      loadNotices();
    } catch (err) {
      toast.error('Failed to delete notice.');
    }
  };

  const noticeTypeStyles: Record<string, { bg: string; text: string; icon: any }> = {
    SCHOOL: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', icon: Megaphone },
    CLASS: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', icon: Info },
    EXAM: { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', icon: Calendar },
    FEE: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: DollarSign },
    EMERGENCY: { bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-600 dark:text-rose-400', icon: AlertTriangle },
  };

  const filteredNotices = notices.filter(notice => {
    const matchesType = filterType === 'ALL' || notice.type === filterType;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const canPublish = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'TEACHER';

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Digital Notice Board
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Official announcements, homework instructions, exam schedules, and circulars.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Publish Notice
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-card border p-3 rounded-2xl shadow-sm">
        <div className="flex-grow relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-10 rounded-xl border bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'SCHOOL', 'CLASS', 'EXAM', 'FEE', 'EMERGENCY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterType === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotices.map((notice) => {
            const style = noticeTypeStyles[notice.type] || noticeTypeStyles.SCHOOL;
            const Icon = style.icon;

            return (
              <div
                key={notice.id}
                className={`p-6 border rounded-2xl bg-card shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden ${
                  notice.isPinned ? 'border-primary/40 ring-1 ring-primary/10' : ''
                }`}
              >
                {/* Pinned Banner */}
                {notice.isPinned && (
                  <div className="absolute top-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-bl-xl">
                    <Pin className="h-3.5 w-3.5" />
                  </div>
                )}

                <div className="space-y-3">
                  {/* Category Pill */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${style.bg} ${style.text}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {notice.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-snug">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>

                <div className="border-t pt-4 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>Author: {notice.author?.name || 'School ERP'}</span>
                  <div className="flex items-center gap-3">
                    {notice.attachment && (
                      <a
                        href={notice.attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <Paperclip className="h-3.5 w-3.5 mr-1" />
                        Attachment
                      </a>
                    )}
                    {canPublish && (
                      <button
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="text-rose-500 hover:text-rose-600 transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotices.length === 0 && (
            <div className="md:col-span-2 text-center p-12 border rounded-2xl bg-card space-y-3">
              <Bell className="h-10 w-10 text-muted-foreground/20 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Announcements Mapped</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                No active announcements fit the current search term or filter rules.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <h3 className="font-bold text-sm text-foreground">Publish New Bulletin Notice</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Notice Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. Final Exams Postponement"
                  className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Notice Content</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter notice announcement details here..."
                  className="w-full p-3 border rounded-lg bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Notice Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="SCHOOL">School Circular</option>
                    <option value="CLASS">Class Alert</option>
                    <option value="EXAM">Exam Notice</option>
                    <option value="FEE">Fee Reminder</option>
                    <option value="EMERGENCY">Emergency Notice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Target Class (Optional)</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="">All Classes (School-wide)</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}-{cls.section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Attachment URL (Optional)</label>
                <input
                  type="text"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  placeholder="https://example.com/file.pdf"
                  className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="pinNotice" className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                  Pin this notice to the top of the board
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 h-10 border rounded-xl hover:bg-accent text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold transition-colors shadow-sm"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default NoticeBoardPage;
