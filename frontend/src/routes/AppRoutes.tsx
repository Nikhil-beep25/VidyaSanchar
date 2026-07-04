import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { LandingLayout } from '../components/layout/LandingLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Public Pages
import { Home } from '../pages/landing/Home';
import { About } from '../pages/landing/About';
import { Features } from '../pages/landing/Features';
import { Pricing } from '../pages/landing/Pricing';
import { Testimonials } from '../pages/landing/Testimonials';
import { FAQ } from '../pages/landing/FAQ';
import { Contact } from '../pages/landing/Contact';
import { Login } from '../pages/landing/Login';
import { SignUp } from '../pages/landing/SignUp';

// Dashboard Views
import { SuperAdminDashboard } from '../pages/dashboard/SuperAdminDashboard';
import { AdminDashboard } from '../pages/dashboard/AdminDashboard';
import { TeacherDashboard } from '../pages/dashboard/TeacherDashboard';
import { StudentDashboard } from '../pages/dashboard/StudentDashboard';
import { ParentDashboard } from '../pages/dashboard/ParentDashboard';

// Sub Views (Mocked and Interactive components)
import { StudentManagement } from '../pages/dashboard/admin/StudentManagement';
import { TeacherManagement } from '../pages/dashboard/admin/TeacherManagement';
import { ParentManagement } from '../pages/dashboard/admin/ParentManagement';
import { ClassManagement } from '../pages/dashboard/admin/ClassManagement';
import { SubjectManagement } from '../pages/dashboard/admin/SubjectManagement';
import { AttendanceManagement } from '../pages/dashboard/admin/AttendanceManagement';
import { TimetableManagement } from '../pages/dashboard/admin/TimetableManagement';
import { FeeManagement } from '../pages/dashboard/admin/FeeManagement';
import { LibraryManagement } from '../pages/dashboard/admin/LibraryManagement';
import { AnnouncementManagement } from '../pages/dashboard/admin/AnnouncementManagement';
import { SettingsManagement } from '../pages/dashboard/admin/SettingsManagement';

import { TeacherAttendance } from '../pages/dashboard/teacher/TeacherAttendance';
import { TeacherMarks } from '../pages/dashboard/teacher/TeacherMarks';
import { TeacherSchedule } from '../pages/dashboard/teacher/TeacherSchedule';

import { StudentAttendance } from '../pages/dashboard/student/StudentAttendance';
import { StudentGrades } from '../pages/dashboard/student/StudentGrades';
import { StudentFees } from '../pages/dashboard/student/StudentFees';
import { StudentSchedule } from '../pages/dashboard/student/StudentSchedule';

import { ParentAttendance } from '../pages/dashboard/parent/ParentAttendance';
import { ParentGrades } from '../pages/dashboard/parent/ParentGrades';
import { ParentFees } from '../pages/dashboard/parent/ParentFees';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to home if user tries to access a role-dashboard they don't belong to
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Site */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Route>

      {/* Role-based Dashboards */}
      <Route element={<DashboardLayout />}>
        {/* Super Admin Dashboard */}
        <Route
          path="/dashboard/super-admin"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/super-admin/users"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <div className="border rounded-xl p-8 bg-card shadow-sm text-center">
                <h3 className="font-bold text-xl mb-2">User Access Control</h3>
                <p className="text-sm text-muted-foreground">Manage system logins, roles, and global credentials.</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/super-admin/schools"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <div className="border rounded-xl p-8 bg-card shadow-sm text-center">
                <h3 className="font-bold text-xl mb-2">School Branches</h3>
                <p className="text-sm text-muted-foreground">Manage multi-school setups across Indian cities.</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/super-admin/settings"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <div className="border rounded-xl p-8 bg-card shadow-sm text-center">
                <h3 className="font-bold text-xl mb-2">System Config Settings</h3>
                <p className="text-sm text-muted-foreground">Global SMS system flags and database configurations.</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/students"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/teachers"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <TeacherManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/timetables"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <TimetableManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/fees"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <FeeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/library"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <LibraryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/announcements"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AnnouncementManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/parents"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <ParentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/classes"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <ClassManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <SubjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/attendance"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AttendanceManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <SettingsManagement />
            </ProtectedRoute>
          }
        />

        {/* Teacher Dashboard */}
        <Route
          path="/dashboard/teacher"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/attendance"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/marks"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherMarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/timetable"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherSchedule />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/grades"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentGrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/fees"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentFees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/timetable"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentSchedule />
            </ProtectedRoute>
          }
        />

        {/* Parent Dashboard */}
        <Route
          path="/dashboard/parent"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/attendance"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/grades"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentGrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/fees"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentFees />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
