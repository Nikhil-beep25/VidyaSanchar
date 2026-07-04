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
  getDashboardSummary
} from '../controllers/analyticsController';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
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
router.use(authMiddleware);

// Analytics
  router.get('/analytics/summary', getDashboardSummary);

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

export default router;
