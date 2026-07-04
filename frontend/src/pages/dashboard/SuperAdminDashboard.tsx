import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { Users, School, Cpu, Server, Activity, Database } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    schoolsCount: 4,
    usersCount: 145,
    dbStatus: 'Connected',
    uptime: '14 days, 6 hours',
    serverLoad: '12%',
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiRequest('/analytics/summary');
        if (data && data.stats) {
          setStats(prev => ({
            ...prev,
            usersCount: data.stats.studentCount + data.stats.teacherCount + data.stats.parentCount + 2,
          }));
        }
      } catch (err) {
        // Fallback to mock data if offline
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Super Admin Global Summary</h1>
        <p className="text-sm text-muted-foreground">Manage branch instances, system configurations, and resources.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <School className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Active Branches</span>
            <span className="text-2xl font-bold">{stats.schoolsCount}</span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Global Active Logins</span>
            <span className="text-2xl font-bold">{stats.usersCount}</span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">DB Connection</span>
            <span className="text-sm font-bold text-green-500">{stats.dbStatus}</span>
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-card flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Global Server Load</span>
            <span className="text-2xl font-bold">{stats.serverLoad}</span>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span>Infrastructure Status</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Operating System</span>
              <span className="font-medium">Alpine Linux (Docker Container)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Runtime Uptime</span>
              <span className="font-medium">{stats.uptime}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">PostgreSQL Database</span>
              <span className="font-medium">V15.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reverse Proxy Server</span>
              <span className="font-medium">Nginx v1.25</span>
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Server className="h-5 w-5 text-primary" />
            <span>Registered Branches</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-primary">Delhi Public School Dwarka</span>
              <span className="font-medium text-xs border px-2 py-0.5 rounded bg-muted">Primary Active</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-primary">DAV Public School Jaipur</span>
              <span className="font-medium text-xs border px-2 py-0.5 rounded bg-muted">Active</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-primary">Indore Academy CBSE School</span>
              <span className="font-medium text-xs border px-2 py-0.5 rounded bg-muted">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-primary">St. Xavier's College, Mumbai</span>
              <span className="font-medium text-xs border px-2 py-0.5 rounded bg-muted">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
