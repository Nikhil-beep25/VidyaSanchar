import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

import {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/authController';

import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass
} from '../controllers/classController';

import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController';

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController';

import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacherController';

import {
  getAllParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent
} from '../controllers/parentController';

import {
  getUserProfile,
  updateUserProfile
} from '../controllers/userController';

import {
  recordAttendance,
  getClassAttendance,
  getStudentAttendance
} from '../controllers/attendanceController';

import {
  createExam,
  getAllExams,
  enterMarks,
  getStudentReportCard,
  getExamPerformanceReport
} from '../controllers/examController';

import {
  createFee,
  getAllFees,
  getStudentFeeLedger,
  recordPayment
} from '../controllers/feeController';

import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  downloadReceipt
} from '../controllers/paymentController';

import {
  createTimetableSlot,
  getClassTimetable,
  getTeacherTimetable,
  deleteTimetableSlot
} from '../controllers/timetableController';

import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getLibraryIssues,
  issueBook,
  returnBook
} from '../controllers/libraryController';

import {
  createNotification,
  getNotifications,
  submitContactForm,
  getContactSubmissions
} from '../controllers/notificationController';

import {
  getDashboardSummary,
  getAdvancedAnalytics
} from '../controllers/analyticsController';

import {
  sendMessage,
  getMessages,
  getChatParticipants,
  createNotice,
  getNotices
} from '../controllers/communicationController';

import {
  createAssignment,
  submitAssignment,
  gradeAssignment,
  getStudentSubmissions,
  getAssignmentSubmissions
} from '../controllers/academicController';

import {
  createRoute,
  getAllRoutes,
  createVehicle,
  getAllVehicles,
  assignStudentTransport,
  getStudentTransport
} from '../controllers/transportController';

import {
  downloadReportCardPDF,
  downloadCertificatePDF,
  downloadAdmitCardPDF,
  downloadAttendanceReportPDF
} from '../controllers/documentController';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// API Info Route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'VidyaSanchar API',
    version: '1.0.0',
    status: 'running'
  });
});

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Landing page contact submission
router.post('/contact', submitContactForm);

// ==========================================
// PROTECTED ROUTES (Requires JWT)
// ==========================================

// Conditional middleware for route authentication scope and method validation
router.use((req, res, next) => {
  const publicPaths = [
    '/auth/register',
    '/auth/login',
    '/auth/refresh',
    '/auth/logout',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/contact',
    ''
  ];
  
  const normalizedPath = req.path.replace(/\/$/, '');
  
  if (publicPaths.includes(normalizedPath)) {
    return next();
  }
  
  // Valid API resource prefixes
  const validPrefixes = [
    '/analytics',
    '/users',
    '/classes',
    '/subjects',
    '/students',
    '/teachers',
    '/parents',
    '/attendance',
    '/exams',
    '/fees',
    '/timetables',
    '/library',
    '/notifications'
  ];
  
  const hasValidPrefix = validPrefixes.some(prefix => normalizedPath.startsWith(prefix));
  if (!hasValidPrefix) {
    return res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
  }

  authMiddleware(req, res, next);
});

// Analytics
  router.get('/analytics/summary', getDashboardSummary);
  router.get('/analytics/trends', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getAdvancedAnalytics);

  // Users profile
  router.get('/users/profile', getUserProfile);
  router.put('/users/profile', updateUserProfile);

// Classes (Admin and Super Admin only)
router.get('/classes', getAllClasses);
router.post('/classes', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createClass);
router.put('/classes/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), updateClass);
router.delete('/classes/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deleteClass);

// Subjects (Admin and Super Admin only)
router.get('/subjects', getAllSubjects);
router.post('/subjects', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createSubject);
router.put('/subjects/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), updateSubject);
router.delete('/subjects/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deleteSubject);

// Students (Admin, Super Admin, Teacher can view; Admin/Super Admin can modify)
router.get('/students', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getAllStudents);
router.get('/students/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getStudentById);
router.post('/students', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createStudent);
router.put('/students/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), updateStudent);
router.delete('/students/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deleteStudent);

// Teachers (Admin, Super Admin, and Teachers themselves)
router.get('/teachers', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getAllTeachers);
router.get('/teachers/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getTeacherById);
router.post('/teachers', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createTeacher);
router.put('/teachers/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), updateTeacher);
router.delete('/teachers/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deleteTeacher);

// Parents (Admin, Super Admin, and Parents themselves)
router.get('/parents', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getAllParents);
router.get('/parents/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'PARENT']), getParentById);
router.post('/parents', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createParent);
router.put('/parents/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), updateParent);
router.delete('/parents/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deleteParent);

// Attendance (Teachers and Admins can record; Students and Parents can view their own)
router.post('/attendance', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), recordAttendance);
router.get('/attendance/class/:classId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getClassAttendance);
router.get('/attendance/student/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getStudentAttendance);

// Exams
router.post('/exams', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), createExam);
router.get('/exams', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getAllExams);
router.post('/exams/marks', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), enterMarks);
router.get('/exams/report/student/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getStudentReportCard);
router.get('/exams/:examId/performance', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getExamPerformanceReport);

// Fees
router.post('/fees', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createFee);
router.get('/fees', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), getAllFees);
router.get('/fees/student/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getStudentFeeLedger);
router.post('/fees/payment', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), recordPayment);

// Online Fees Checkout via Razorpay
router.post('/fees/checkout/create-order', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'PARENT']), createOrder);
router.post('/fees/checkout/verify', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'PARENT']), verifyPayment);
router.get('/fees/history', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'PARENT', 'STUDENT']), getPaymentHistory);
router.get('/fees/receipt/:paymentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'PARENT', 'STUDENT']), downloadReceipt);

// PDF Document Reports & Certificates
router.get('/reports/report-card/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), downloadReportCardPDF);
router.get('/reports/certificate/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), downloadCertificatePDF);
router.get('/reports/admit-card/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'STUDENT', 'PARENT']), downloadAdmitCardPDF);
router.get('/reports/attendance/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), downloadAttendanceReportPDF);

// Homework & Assignments
router.post('/assignments', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), createAssignment);
router.post('/assignments/:assignmentId/submit', roleMiddleware(['STUDENT']), submitAssignment);
router.post('/assignments/submissions/:submissionId/grade', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), gradeAssignment);
router.get('/assignments/submissions/student/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getStudentSubmissions);
router.get('/assignments/:assignmentId/submissions', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getAssignmentSubmissions);

// Transport Management
router.post('/transport/routes', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createRoute);
router.get('/transport/routes', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'STUDENT', 'PARENT']), getAllRoutes);
router.post('/transport/vehicles', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createVehicle);
router.get('/transport/vehicles', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'STUDENT', 'PARENT']), getAllVehicles);
router.post('/transport/assign', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), assignStudentTransport);
router.get('/transport/student/:studentId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getStudentTransport);

// Timetable
router.post('/timetables', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createTimetableSlot);
router.get('/timetables/class/:classId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']), getClassTimetable);
router.get('/timetables/teacher/:teacherId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getTeacherTimetable);
router.delete('/timetables/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deleteTimetableSlot);

// Library
router.get('/library/books', getAllBooks);
router.post('/library/books', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), createBook);
router.put('/library/books/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), updateBook);
router.delete('/library/books/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), deleteBook);
router.get('/library/issues', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getLibraryIssues);
router.post('/library/issues', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), issueBook);
router.put('/library/issues/:id/return', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), returnBook);

// Notifications & Contact Inquiries
router.post('/notifications', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), createNotification);
router.get('/notifications', getNotifications);
router.get('/contact/submissions', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), getContactSubmissions);

// Communication Messaging & School Notices
router.post('/messages', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT']), sendMessage);
router.get('/messages/participants', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT']), getChatParticipants);
router.get('/messages/:otherUserId', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT']), getMessages);
router.post('/notices', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), createNotice);
router.get('/notices', roleMiddleware(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT']), getNotices);

export default router;
