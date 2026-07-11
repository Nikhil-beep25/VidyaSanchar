import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { Search, Plus, Edit2, Trash2, X, Check, Eye, EyeOff } from 'lucide-react';

export const ExamManagement: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState('Written');
  const [date, setDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [passingMarks, setPassingMarks] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const examData = await apiRequest('/exams');
      setExams(examData);

      const subjectData = await apiRequest('/subjects');
      setSubjects(subjectData);

      const classData = await apiRequest('/classes');
      setClasses(classData);
    } catch (err: any) {
      toast.error('Failed to load exam data catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingExam(null);
    setName('');
    setType('Written');
    setDate('');
    setMaxMarks('100');
    setPassingMarks('33');
    setSubjectId(subjects.length > 0 ? subjects[0].id : '');
    setModalOpen(true);
  };

  const handleOpenEdit = (exam: any) => {
    setEditingExam(exam);
    setName(exam.name);
    setType(exam.type);
    setDate(new Date(exam.date).toISOString().split('T')[0]);
    setMaxMarks(exam.maxMarks.toString());
    setPassingMarks(exam.passingMarks.toString());
    setSubjectId(exam.subjectId);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !date || !maxMarks || !passingMarks || !subjectId) {
      toast.warning('Please enter all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        type,
        date,
        maxMarks: parseFloat(maxMarks),
        passingMarks: parseFloat(passingMarks),
        subjectId
      };

      if (editingExam) {
        await apiRequest(`/exams/${editingExam.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast.success('Exam structure updated successfully.');
      } else {
        await apiRequest('/exams', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success('New exam scheduled successfully.');
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this exam? All student marks registered under it will be permanently deleted.')) {
      return;
    }

    try {
      await apiRequest(`/exams/${id}`, { method: 'DELETE' });
      toast.success('Exam deleted successfully.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete exam.');
    }
  };

  const handleTogglePublish = async (exam: any) => {
    try {
      const newStatus = !exam.isPublished;
      await apiRequest(`/exams/${exam.id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: newStatus })
      });
      toast.success(`Exam results ${newStatus ? 'published' : 'saved to drafts'} successfully.`);
      loadData();
    } catch (err: any) {
      toast.error('Failed to change results publication status.');
    }
  };

  // Filters
  const filteredExams = exams.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.subject?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = selectedClassId ? e.subject?.classId === selectedClassId : true;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Examinations & Assessments</h1>
          <p className="text-sm text-muted-foreground">Manage exam cycles, schedule subjects, and publish student results.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Assessment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border p-4 rounded-xl bg-card">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by exam or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto text-left">
          <span className="text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Classroom Filter:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="h-10 px-3 border rounded-lg bg-background text-sm w-full md:w-48"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Exams Table */}
      {loading ? (
        <div className="p-12 text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
          Loading examination ledger...
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Exam Name</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Subject</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Classroom</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Max Marks</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Passing</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Exam Date</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="border-b hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold text-primary">{exam.name}</td>
                    <td className="p-4 font-semibold">{exam.subject?.name}</td>
                    <td className="p-4 text-xs font-medium text-muted-foreground">{exam.type}</td>
                    <td className="p-4 font-medium">{exam.subject?.subjectClass?.name} - {exam.subject?.subjectClass?.section}</td>
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">{exam.maxMarks}</td>
                    <td className="p-4 font-mono text-rose-500 font-semibold">{exam.passingMarks}</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        exam.isPublished 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
                          : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                      }`}>
                        {exam.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleTogglePublish(exam)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            exam.isPublished 
                              ? 'hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700' 
                              : 'hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700'
                          }`}
                          title={exam.isPublished ? "Revert to Draft" : "Publish Results"}
                        >
                          {exam.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(exam)}
                          className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Exam"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="p-1.5 rounded-lg border hover:bg-destructive/10 text-destructive transition-colors"
                          title="Delete Exam"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredExams.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      No examinations scheduled matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern Dialog Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground">
                {editingExam ? 'Edit Exam Details' : 'Schedule New Exam'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Exam Assessment Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                  placeholder="e.g. Term 1 Mid-Term Examination"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Assessment Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                  >
                    <option value="Written">Written</option>
                    <option value="Practical">Practical</option>
                    <option value="Oral">Oral</option>
                    <option value="Project">Project Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                    placeholder="e.g. 100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Passing Marks *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(e.target.value)}
                    className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                    placeholder="e.g. 33"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Assign Classroom Subject *
                </label>
                <select
                  required
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                >
                  <option value="">Select Classroom Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}) - {s.subjectClass?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-10 px-4 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold transition-colors disabled:opacity-50 inline-flex items-center justify-center"
                >
                  {submitting ? 'Saving...' : editingExam ? 'Update Exam' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
