import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Search, UserPlus, Edit2, Trash2, X } from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const toast = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [classId, setClassId] = useState('');
  const [parentId, setParentId] = useState('');

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const clsData = await apiRequest('/classes');
      setClasses(clsData);
      
      const parentData = await apiRequest('/parents');
      setParents(parentData);
      
      const stdData = await apiRequest(`/students?search=${searchQuery}&classId=${selectedClassId}`);
      setStudents(stdData);
    } catch (err: any) {
      toast.error('Failed to load catalog data.');
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedClassId, searchQuery]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setAddress('');
    setRollNumber('');
    setAdmissionNumber('');
    setDateOfBirth('');
    setGender('Male');
    setBloodGroup('O+');
    setClassId('');
    setParentId('');
    setModalOpen(true);
  };

  const handleOpenEdit = (student: any) => {
    setEditingStudent(student);
    setName(student.user?.name || '');
    setEmail(student.user?.email || '');
    setPassword('');
    setPhone(student.user?.phone || '');
    setAddress(student.user?.address || '');
    setRollNumber(student.rollNumber || '');
    setAdmissionNumber(student.admissionNumber || '');
    
    if (student.dateOfBirth) {
      const dateOnly = new Date(student.dateOfBirth).toISOString().split('T')[0];
      setDateOfBirth(dateOnly);
    } else {
      setDateOfBirth('');
    }
    
    setGender(student.gender || 'Male');
    setBloodGroup(student.bloodGroup || 'O+');
    setClassId(student.classId || '');
    setParentId(student.parentId || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !rollNumber || !admissionNumber || !dateOfBirth || !classId) {
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
        rollNumber,
        admissionNumber,
        dateOfBirth,
        gender,
        bloodGroup,
        classId,
        parentId: parentId || ''
      };

      if (editingStudent) {
        if (password) payload.password = password;
        await apiRequest(`/students/${editingStudent.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('Student profile updated successfully.');
      } else {
        payload.password = password || 'Student@123';
        await apiRequest('/students', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Student registered successfully.');
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
    if (!window.confirm('Are you sure you want to delete this student profile?')) return;
    try {
      await apiRequest(`/students/${id}`, { method: 'DELETE' });
      toast.success('Student deleted successfully.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete student.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight">Student Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage enrolled students, parent mappings, and class branches.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border p-4 rounded-xl bg-card">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Search by Name, Roll, Admission..."
          />
        </div>

        {/* Class selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Filter Class:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="h-10 px-3 w-full sm:w-48 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Roll No.</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Class</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Admission ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Linked Parent</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-primary">{student.rollNumber}</td>
                  <td className="p-4">
                    <div className="font-bold">{student.user?.name}</div>
                    <div className="text-xs text-muted-foreground">{student.user?.email}</div>
                  </td>
                  <td className="p-4">
                    {student.studentClass ? `${student.studentClass.name} - ${student.studentClass.section}` : 'N/A'}
                  </td>
                  <td className="p-4 text-xs font-mono">{student.admissionNumber}</td>
                  <td className="p-4 text-xs font-medium text-muted-foreground">
                    {student.parent?.user?.name ? `${student.parent.user.name} (${student.parent.relation})` : 'Unlinked'}
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(student)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="p-1.5 rounded hover:bg-destructive/15 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
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
              {editingStudent ? `Edit details: ${editingStudent.user?.name}` : 'Register New Student'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. Aarav Sharma"
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
                    placeholder="e.g. aarav@student.sms.edu.in"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Password {editingStudent ? '(leave blank to keep current)' : '(default: Student@123)'}
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
                    Class & Section Assignment *
                  </label>
                  <select
                    required
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="">Choose Class</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. 10A01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Admission Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. ADM-2026-0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Assign Parent / Guardian
                  </label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="">No Parent Linked</option>
                    {parents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.user?.name} ({p.relation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. O+"
                  />
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
                    placeholder="e.g. +91 9999988888"
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
                    placeholder="e.g. D-56, Jaipur"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : editingStudent ? 'Save Changes' : 'Register Student'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
