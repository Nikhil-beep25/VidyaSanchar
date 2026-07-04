import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Save, School, ShieldAlert, Award } from 'lucide-react';

export const SettingsManagement: React.FC = () => {
  const toast = useToast();
  const [schoolName, setSchoolName] = useState('Delhi Public School');
  const [branchName, setBranchName] = useState('Dwarka Branch, New Delhi');
  const [email, setEmail] = useState('info@dpsdwarka.in');
  const [phone, setPhone] = useState('+911125074600');
  const [address, setAddress] = useState('Sector 3, Dwarka, New Delhi - 110078');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [board, setBoard] = useState('CBSE');

  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate updating settings (in production this would save to a system-config DB model)
    setTimeout(() => {
      setLoading(false);
      toast.success('System settings updated successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-left">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure school ERP configurations, branch branding, and academic cycles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Summary */}
        <div className="border rounded-xl p-6 bg-card space-y-4 h-fit">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <School className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">ERP Instance</h3>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active Node</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ERP Version:</span>
              <span className="font-semibold">v1.2.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment:</span>
              <span className="font-semibold text-green-600">Production Mode</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Port:</span>
              <span className="font-mono font-semibold">5432 (Postgres)</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-2 border rounded-xl p-6 bg-card">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-bold text-lg border-b pb-2">Institutional Branding</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  School / College Name *
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Branch Name / Location *
                </label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Affiliation Board / Body *
                </label>
                <input
                  type="text"
                  required
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. CBSE, ICSE, State Board"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Current Academic Cycle *
                </label>
                <input
                  type="text"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <h3 className="font-bold text-lg border-b pb-2 pt-2">Contact Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Administrative Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Office Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Full Mailing Address *
              </label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving Settings...' : 'Save Configuration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
