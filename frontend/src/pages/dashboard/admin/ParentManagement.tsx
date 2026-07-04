import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export const ParentManagement: React.FC = () => {
  const toast = useToast();
  const [parents, setParents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [relation, setRelation] = useState('Father');

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const data = await apiRequest('/parents');
      setParents(data);
    } catch (err: any) {
      toast.error('Failed to load parents data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingParent(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setAddress('');
    setOccupation('');
    setRelation('Father');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingParent(p);
    setName(p.user?.name);
    setEmail(p.user?.email);
    setPassword('');
    setPhone(p.user?.phone || '');
    setAddress(p.user?.address || '');
    setOccupation(p.occupation || '');
    setRelation(p.relation || 'Father');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !relation) {
      toast.warning('Name, email, and relation are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        phone,
        address,
        occupation,
        relation,
        password: password || undefined
      };

      if (editingParent) {
        await apiRequest(`/parents/${editingParent.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast.success('Parent profile updated successfully.');
      } else {
        await apiRequest('/parents', {
          method: 'POST',
          body: JSON.stringify({ ...payload, password: password || 'Parent@123' })
        });
        toast.success('Parent registered successfully.');
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
    if (!window.confirm('Are you sure you want to delete this parent profile? Sibling student accounts will remain.')) return;
    
    try {
      await apiRequest(`/parents/${id}`, { method: 'DELETE' });
      toast.success('Parent deleted successfully.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete parent.');
    }
  };

  const filteredParents = parents.filter((p) =>
    `${p.user?.name} ${p.user?.email} ${p.occupation || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight">Parent Directory</h1>
          <p className="text-sm text-muted-foreground">Manage parents profiles, contact info, and linkings to students.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Parent
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
            placeholder="Search parents..."
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Relation</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Occupation</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">WhatsApp Phone</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Linked Children</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParents.map((p) => (
                <tr key={p.id} className="border-b hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <div className="font-bold">{p.user?.name}</div>
                    <div className="text-xs text-muted-foreground">{p.user?.email}</div>
                  </td>
                  <td className="p-4 font-semibold">{p.relation}</td>
                  <td className="p-4">{p.occupation || 'N/A'}</td>
                  <td className="p-4 font-mono text-xs">{p.user?.phone || 'N/A'}</td>
                  <td className="p-4 text-xs font-semibold text-primary">
                    {p.students?.map((s: any) => s.user?.name).join(', ') || 'No linked students'}
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded hover:bg-destructive/15 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredParents.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No parents profiles found.
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
              {editingParent ? 'Edit Parent Profile' : 'Add New Parent'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Parent Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Anil Sharma"
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
                  placeholder="e.g. anil.sharma@parent.sms.edu.in"
                />
              </div>

              {!editingParent && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Password (default: Parent@123)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Relation *
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="e.g. CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. +91 9988776655"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Dwarka, New Delhi"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : editingParent ? 'Save Changes' : 'Register Parent'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
