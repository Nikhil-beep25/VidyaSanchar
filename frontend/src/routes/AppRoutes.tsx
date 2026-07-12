import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { LandingLayout } from '../components/layout/LandingLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Public Pages
import { Home } from '../pages/landing/Home';
import { About } from '../pages/landing/About';
import { Features } from '../pages/landing/Features';
import { Projects } from '../pages/landing/Projects';
import { Journey } from '../pages/landing/Journey';
import { Pricing } from '../pages/landing/Pricing';
import { Testimonials } from '../pages/landing/Testimonials';
import { FAQ } from '../pages/landing/FAQ';
import { Contact } from '../pages/landing/Contact';
import { Login } from '../pages/landing/Login';
import { SignUp } from '../pages/landing/SignUp';

// Lazy Loaded Dashboard Views
const SuperAdminDashboard = lazy(() => import('../pages/dashboard/SuperAdminDashboard').then(module => ({ default: module.SuperAdminDashboard })));
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const TeacherDashboard = lazy(() => import('../pages/dashboard/TeacherDashboard').then(module => ({ default: module.TeacherDashboard })));
const StudentDashboard = lazy(() => import('../pages/dashboard/StudentDashboard').then(module => ({ default: module.StudentDashboard })));
const ParentDashboard = lazy(() => import('../pages/dashboard/ParentDashboard').then(module => ({ default: module.ParentDashboard })));

// Phase 3 Lazy Loaded Pages
const NoticeBoardPage = lazy(() => import('../pages/dashboard/communication/NoticeBoardPage').then(module => ({ default: module.NoticeBoardPage })));
const CommunicationCenter = lazy(() => import('../pages/dashboard/communication/CommunicationCenter').then(module => ({ default: module.CommunicationCenter })));
const HomeworkHub = lazy(() => import('../pages/dashboard/homework/HomeworkHub').then(module => ({ default: module.HomeworkHub })));
const TimetableGrid = lazy(() => import('../pages/dashboard/timetable/TimetableGrid').then(module => ({ default: module.TimetableGrid })));

// Lazy Loaded Admin Views
const StudentManagement = lazy(() => import('../pages/dashboard/admin/StudentManagement').then(module => ({ default: module.StudentManagement })));
const TeacherManagement = lazy(() => import('../pages/dashboard/admin/TeacherManagement').then(module => ({ default: module.TeacherManagement })));
const ParentManagement = lazy(() => import('../pages/dashboard/admin/ParentManagement').then(module => ({ default: module.ParentManagement })));
const ClassManagement = lazy(() => import('../pages/dashboard/admin/ClassManagement').then(module => ({ default: module.ClassManagement })));
const SubjectManagement = lazy(() => import('../pages/dashboard/admin/SubjectManagement').then(module => ({ default: module.SubjectManagement })));
const AttendanceManagement = lazy(() => import('../pages/dashboard/admin/AttendanceManagement').then(module => ({ default: module.AttendanceManagement })));
const TimetableManagement = lazy(() => import('../pages/dashboard/admin/TimetableManagement').then(module => ({ default: module.TimetableManagement })));
const FeeManagement = lazy(() => import('../pages/dashboard/admin/FeeManagement').then(module => ({ default: module.FeeManagement })));
const LibraryManagement = lazy(() => import('../pages/dashboard/admin/LibraryManagement').then(module => ({ default: module.LibraryManagement })));
const AnnouncementManagement = lazy(() => import('../pages/dashboard/admin/AnnouncementManagement').then(module => ({ default: module.AnnouncementManagement })));
const SettingsManagement = lazy(() => import('../pages/dashboard/admin/SettingsManagement').then(module => ({ default: module.SettingsManagement })));
const ExamManagement = lazy(() => import('../pages/dashboard/admin/ExamManagement').then(module => ({ default: module.ExamManagement })));

// Lazy Loaded Teacher Views
const TeacherAttendance = lazy(() => import('../pages/dashboard/teacher/TeacherAttendance').then(module => ({ default: module.TeacherAttendance })));
const TeacherMarks = lazy(() => import('../pages/dashboard/teacher/TeacherMarks').then(module => ({ default: module.TeacherMarks })));
const TeacherSchedule = lazy(() => import('../pages/dashboard/teacher/TeacherSchedule').then(module => ({ default: module.TeacherSchedule })));

// Lazy Loaded Student Views
const StudentAttendance = lazy(() => import('../pages/dashboard/student/StudentAttendance').then(module => ({ default: module.StudentAttendance })));
const StudentGrades = lazy(() => import('../pages/dashboard/student/StudentGrades').then(module => ({ default: module.StudentGrades })));
const StudentFees = lazy(() => import('../pages/dashboard/student/StudentFees').then(module => ({ default: module.StudentFees })));
const StudentSchedule = lazy(() => import('../pages/dashboard/student/StudentSchedule').then(module => ({ default: module.StudentSchedule })));

// Lazy Loaded Parent Views
const ParentAttendance = lazy(() => import('../pages/dashboard/parent/ParentAttendance').then(module => ({ default: module.ParentAttendance })));
const ParentGrades = lazy(() => import('../pages/dashboard/parent/ParentGrades').then(module => ({ default: module.ParentGrades })));
const ParentFees = lazy(() => import('../pages/dashboard/parent/ParentFees').then(module => ({ default: module.ParentFees })));

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

const AppRoutesInternal: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Site */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Route>

      {/* Role-based Dashboards */}
      <Route element={<DashboardLayout />}>
        {/* Phase 3 Shared Routes */}
        <Route
          path="/dashboard/notices"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
              <NoticeBoardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
              <CommunicationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/homework"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
              <HomeworkHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/timetable"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <TimetableGrid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/timetable"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <TimetableGrid />
            </ProtectedRoute>
          }
        />

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
          path="/dashboard/admin/exams"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <ExamManagement />
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
        <Route
          path="/dashboard/teacher/exams"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <ExamManagement />
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

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppRoutesInternal />
    </Suspense>
  );
};
