import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Search, Plus, Edit2, Trash2, X, School } from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const toast = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);
  
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [classTeacherId, setClassTeacherId] = useState('');

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const classData = await apiRequest('/classes');
      setClasses(classData);
      
      const teacherData = await apiRequest('/teachers');
      setTeachers(teacherData);
    } catch (err: any) {
      toast.error('Failed to load classes or teachers data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setName('');
    setSection('');
    setRoomNumber('');
    setClassTeacherId('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cls: any) => {
    setEditingClass(cls);
    setName(cls.name);
    setSection(cls.section);
    setRoomNumber(cls.roomNumber || '');
    setClassTeacherId(cls.classTeacherId || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !section) {
      toast.warning('Class name and section are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        section,
        roomNumber,
        classTeacherId: classTeacherId || null
      };

      if (editingClass) {
        await apiRequest(`/classes/${editingClass.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast.success('Class updated successfully.');
      } else {
        await apiRequest('/classes', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success('Class created successfully.');
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
    if (!window.confirm('Are you sure you want to delete this class? This may impact mapped students.')) return;
    
    try {
      await apiRequest(`/classes/${id}`, { method: 'DELETE' });
      toast.success('Class deleted successfully.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete class.');
    }
  };

  const filteredClasses = classes.filter((c) =>
    `${c.name} ${c.section} ${c.roomNumber || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight">Classes & Sections</h1>
          <p className="text-sm text-muted-foreground">Manage classrooms, branch sections, and assign class teachers.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Class
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
            placeholder="Search classes..."
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Class Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Section</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Room Number</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Class Teacher</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Active Students</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls) => (
                <tr key={cls.id} className="border-b hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-primary">{cls.name}</td>
                  <td className="p-4 font-semibold">{cls.section}</td>
                  <td className="p-4 font-mono text-xs">{cls.roomNumber || 'N/A'}</td>
                  <td className="p-4 font-medium">{cls.classTeacher?.user?.name || 'Unassigned'}</td>
                  <td className="p-4 text-xs font-semibold text-muted-foreground">{cls._count?.students || 0} Students</td>
                  <td className="p-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="p-1.5 rounded hover:bg-destructive/15 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No class profiles found.
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
              {editingClass ? 'Edit Class details' : 'Create New Class'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Class 10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Section *
                </label>
                <input
                  type="text"
                  required
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Section A"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Room 102"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Assign Class Teacher
                </label>
                <select
                  value={classTeacherId}
                  onChange={(e) => setClassTeacherId(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">No Class Teacher Assigned</option>
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
                {loading ? 'Processing...' : editingClass ? 'Save Changes' : 'Create Class'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
