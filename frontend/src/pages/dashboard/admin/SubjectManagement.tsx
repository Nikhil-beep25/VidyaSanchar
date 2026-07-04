import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export const SubjectManagement: React.FC = () => {
  const toast = useToast();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [classId, setClassId] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const subjectData = await apiRequest('/subjects');
      setSubjects(subjectData);

      const classData = await apiRequest('/classes');
      setClasses(classData);

      const teacherData = await apiRequest('/teachers');
      setTeachers(teacherData);
    } catch (err: any) {
      toast.error('Failed to load subjects, classes, or teachers data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setClassId('');
    setTeacherId('');
    setModalOpen(true);
  };

  const handleOpenEdit = (sub: any) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setClassId(sub.classId);
    setTeacherId(sub.teacherId || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !classId) {
      toast.warning('Subject name, code, and class assignment are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        code,
        classId,
        teacherId: teacherId || null
      };

      if (editingSubject) {
        await apiRequest(`/subjects/${editingSubject.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast.success('Subject updated successfully.');
      } else {
        await apiRequest('/subjects', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success('Subject created successfully.');
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subject? This will impact exams and timetables.')) return;
    
    try {
      await apiRequest(`/subjects/${id}`, { method: 'DELETE' });
      toast.success('Subject deleted successfully.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete subject.');
    }
  };

  const filteredSubjects = subjects.filter((s) =>
    `${s.name} ${s.code} ${s.subjectClass?.name || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight">Subjects & Courses</h1>
          <p className="text-sm text-muted-foreground">Manage syllabus subjects, course codes, and assign subject faculty.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Subject
        </button>
      </div>

      <div className="flex border p-4 rounded-xl bg-card items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Search subjects..."
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Subject Code</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Subject Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Assigned Class</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Teaching Faculty</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-mono text-xs font-semibold text-primary">{sub.code}</td>
                  <td className="p-4 font-bold">{sub.name}</td>
                  <td className="p-4">
                    {sub.subjectClass ? `${sub.subjectClass.name} - ${sub.subjectClass.section}` : 'N/A'}
                  </td>
                  <td className="p-4 font-medium">{sub.teacher?.user?.name || 'Unassigned'}</td>
                  <td className="p-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 rounded hover:bg-destructive/15 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No subject profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md border rounded-2xl bg-card p-6 shadow-xl space-y-4 relative text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold tracking-tight">
              {editingSubject ? 'Edit Subject details' : 'Create New Subject'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Mathematics"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Subject Code (Unique) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. MATH101"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Assign to Class *
                </label>
                <select
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Select Target Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Assign Teaching Faculty
                </label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">No Faculty Assigned</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.user?.name} ({t.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : editingSubject ? 'Save Changes' : 'Create Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
