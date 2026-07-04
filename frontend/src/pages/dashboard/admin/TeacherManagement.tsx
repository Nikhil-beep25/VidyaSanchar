import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Search, UserPlus, Trash2, Edit2, X } from 'lucide-react';

export const TeacherManagement: React.FC = () => {
  const toast = useToast();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  
  // Mappings
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const data = await apiRequest(`/teachers?search=${searchQuery}`);
      setTeachers(data);

      const classData = await apiRequest('/classes');
      setClasses(classData);

      const subjectData = await apiRequest('/subjects');
      setSubjects(subjectData);
    } catch (err: any) {
      toast.error('Failed to load directories data.');
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setAddress('');
    setEmployeeId('');
    setQualification('');
    setSpecialization('');
    setJoiningDate('');
    setClassId('');
    setSubjectId('');
    setModalOpen(true);
  };

  const handleOpenEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setName(teacher.user?.name || '');
    setEmail(teacher.user?.email || '');
    setPassword('');
    setPhone(teacher.user?.phone || '');
    setAddress(teacher.user?.address || '');
    setEmployeeId(teacher.employeeId || '');
    setQualification(teacher.qualification || '');
    setSpecialization(teacher.specialization || '');
    
    if (teacher.joiningDate) {
      const dateOnly = new Date(teacher.joiningDate).toISOString().split('T')[0];
      setJoiningDate(dateOnly);
    } else {
      setJoiningDate('');
    }

    // Try to find the leading class (where classTeacherId matches this teacher)
    const ledClass = classes.find((c) => c.classTeacherId === teacher.id);
    setClassId(ledClass ? ledClass.id : '');

    // Try to find the subject taught by this teacher
    const taughtSubject = subjects.find((s) => s.teacherId === teacher.id);
    setSubjectId(taughtSubject ? taughtSubject.id : '');

    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !employeeId || !qualification || !specialization || !joiningDate) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name,
        email,
        phone,
        address,
        employeeId,
        qualification,
        specialization,
        joiningDate,
        classId: classId || '',
        subjectId: subjectId || ''
      };

      if (editingTeacher) {
        if (password) payload.password = password;
        await apiRequest(`/teachers/${editingTeacher.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('Teacher profile updated successfully.');
      } else {
        payload.password = password || 'Teacher@123';
        await apiRequest('/teachers', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Teacher registered successfully.');
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
    if (!window.confirm('Are you sure you want to delete this teacher profile?')) return;
    try {
      await apiRequest(`/teachers/${id}`, { method: 'DELETE' });
      toast.success('Teacher deleted successfully.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete teacher.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight">Teachers Directory</h1>
          <p className="text-sm text-muted-foreground">Manage school faculties, qualifications, and specialization branches.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Teacher
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex border p-4 rounded-xl bg-card items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Search by name, employee ID..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Emp ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Specialization</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Qualification</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Assigned Course</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-mono text-xs font-semibold text-primary">{teacher.employeeId}</td>
                  <td className="p-4">
                    <div className="font-bold">{teacher.user?.name}</div>
                    <div className="text-xs text-muted-foreground">{teacher.user?.email}</div>
                  </td>
                  <td className="p-4">{teacher.specialization}</td>
                  <td className="p-4 text-xs">{teacher.qualification}</td>
                  <td className="p-4 text-xs font-semibold text-muted-foreground">
                    {teacher.subjects?.map((s: any) => `${s.name} (${s.code})`).join(', ') || 'None'}
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(teacher)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="p-1.5 rounded hover:bg-destructive/15 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No teacher records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl border rounded-2xl bg-card p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto relative text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold tracking-tight">
              {editingTeacher ? `Edit details: ${editingTeacher.user?.name}` : 'Register New Faculty Teacher'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Faculty Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. Ramesh Verma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. ramesh.verma@sms.edu.in"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Password {editingTeacher ? '(leave blank to keep current)' : '(default: Teacher@123)'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Employee ID Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. T-2026-101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Highest Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. M.Sc. Mathematics, B.Ed."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Specialization Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. Calculus"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Assign Lead Class (Class Teacher)
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="">No Lead Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Assign Main Subject Faculty
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="">No Subject Assigned</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}) - {s.subjectClass?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. +91 9876543212"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Home Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. Anand Nagar, Indore"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : editingTeacher ? 'Save Changes' : 'Register Teacher'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
