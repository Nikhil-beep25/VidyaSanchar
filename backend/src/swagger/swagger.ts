import { env } from '../config/env';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'VidyaSanchar ERP API',
    description: 'Complete API Documentation for the enterprise-grade Student Management System (SMS) for Indian educational institutes.',
    version: '1.0.0',
  },
  servers: [
    {
      url: env.NODE_ENV === 'production' ? 'https://vidyasanchar.onrender.com' : `http://localhost:${env.PORT}`,
      description: env.NODE_ENV === 'production' ? 'Production server' : 'Local development server',
    },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register User',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name', 'role'],
                properties: {
                  email: { type: 'string', example: 'newadmin@sms.edu.in' },
                  password: { type: 'string', example: 'Password@123' },
                  name: { type: 'string', example: 'Amit Gupta' },
                  role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], example: 'ADMIN' },
                  phone: { type: 'string', example: '+919876543222' },
                  address: { type: 'string', example: 'Dwarka, Delhi' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful' },
          400: { description: 'Bad Request' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'User Login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@sms.edu.in' },
                  password: { type: 'string', example: 'Password@123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    accessToken: { type: 'string' },
                    user: { type: 'object' },
                  },
                },
              },
            },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        summary: 'Refresh Access Token',
        tags: ['Authentication'],
        responses: {
          200: { description: 'Token refreshed' },
          401: { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'User Logout',
        tags: ['Authentication'],
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        summary: 'Forgot Password Request',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', example: 'admin@sms.edu.in' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Reset instructions generated' },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        summary: 'Reset Password',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string' },
                  newPassword: { type: 'string', example: 'NewPassword@123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password reset successful' },
          400: { description: 'Invalid token' },
        },
      },
    },
    '/api/users/profile': {
      get: {
        summary: 'Get Profile details',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Profile details retrieved' },
          401: { description: 'Unauthorized' },
        },
      },
      put: {
        summary: 'Update Profile details',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
        },
      },
    },
    '/api/students': {
      get: {
        summary: 'List Students',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'classId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of student records' },
        },
      },
      post: {
        summary: 'Create Student Profile',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'name', 'rollNumber', 'admissionNumber', 'dateOfBirth', 'gender', 'classId'],
                properties: {
                  email: { type: 'string', example: 'student@sms.edu.in' },
                  name: { type: 'string', example: 'Aarav Sharma' },
                  rollNumber: { type: 'string', example: '10A01' },
                  admissionNumber: { type: 'string', example: 'ADM-2026-0001' },
                  dateOfBirth: { type: 'string', format: 'date', example: '2011-04-12' },
                  gender: { type: 'string', example: 'Male' },
                  bloodGroup: { type: 'string', example: 'O+' },
                  classId: { type: 'string' },
                  parentId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Student created successfully' },
        },
      },
    },
    '/api/students/{id}': {
      get: {
        summary: 'Get Student by ID',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Student details' },
          404: { description: 'Student not found' },
        },
      },
      put: {
        summary: 'Update Student Profile',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  rollNumber: { type: 'string' },
                  classId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Student updated successfully' },
        },
      },
      delete: {
        summary: 'Delete Student Profile',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Student deleted' },
        },
      },
    },
    '/api/teachers': {
      get: {
        summary: 'List Teachers',
        tags: ['Teachers'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of teachers' },
        },
      },
      post: {
        summary: 'Create Teacher Profile',
        tags: ['Teachers'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'name', 'employeeId', 'qualification', 'specialization'],
                properties: {
                  email: { type: 'string', example: 'teacher@sms.edu.in' },
                  name: { type: 'string', example: 'Ramesh Verma' },
                  employeeId: { type: 'string', example: 'T-2026-101' },
                  qualification: { type: 'string', example: 'M.Sc. Mathematics' },
                  specialization: { type: 'string', example: 'Calculus' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Teacher created successfully' },
        },
      },
    },
    '/api/teachers/{id}': {
      get: {
        summary: 'Get Teacher by ID',
        tags: ['Teachers'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Teacher details' },
        },
      },
      put: {
        summary: 'Update Teacher Profile',
        tags: ['Teachers'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  qualification: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Teacher updated' },
        },
      },
      delete: {
        summary: 'Delete Teacher Profile',
        tags: ['Teachers'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Teacher deleted' },
        },
      },
    },
    '/api/classes': {
      get: {
        summary: 'List Classes',
        tags: ['Classes'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of classes' },
        },
      },
      post: {
        summary: 'Create Class',
        tags: ['Classes'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'section'],
                properties: {
                  name: { type: 'string', example: 'Class 10' },
                  section: { type: 'string', example: 'A' },
                  roomNumber: { type: 'string', example: 'Room 101' },
                  classTeacherId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Class created' },
        },
      },
    },
    '/api/classes/{id}': {
      put: {
        summary: 'Update Class',
        tags: ['Classes'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  section: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Class updated' },
        },
      },
      delete: {
        summary: 'Delete Class',
        tags: ['Classes'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Class deleted' },
        },
      },
    },
    '/api/attendance': {
      post: {
        summary: 'Record Attendance',
        tags: ['Attendance'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['classId', 'date', 'records'],
                properties: {
                  classId: { type: 'string' },
                  date: { type: 'string', format: 'date', example: '2026-07-04' },
                  records: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        studentId: { type: 'string' },
                        status: { type: 'string', enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], example: 'PRESENT' },
                        remarks: { type: 'string', example: 'Punctual' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Attendance recorded' },
        },
      },
    },
    '/api/attendance/class/{classId}': {
      get: {
        summary: 'Get Class Attendance history',
        tags: ['Attendance'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'classId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Class attendance list' },
        },
      },
    },
    '/api/attendance/student/{studentId}': {
      get: {
        summary: 'Get Student Attendance history',
        tags: ['Attendance'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Student attendance list' },
        },
      },
    },
    '/api/exams': {
      get: {
        summary: 'List Exams',
        tags: ['Reports & Exams'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of exams' },
        },
      },
      post: {
        summary: 'Create Exam',
        tags: ['Reports & Exams'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type', 'date', 'maxMarks', 'passingMarks', 'subjectId'],
                properties: {
                  name: { type: 'string', example: 'Term 1 Mid-Term' },
                  type: { type: 'string', example: 'Written' },
                  date: { type: 'string', format: 'date' },
                  maxMarks: { type: 'number', example: 100 },
                  passingMarks: { type: 'number', example: 33 },
                  subjectId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Exam created' },
        },
      },
    },
    '/api/exams/marks': {
      post: {
        summary: 'Enter Marks for Students',
        tags: ['Reports & Exams'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['examId', 'marks'],
                properties: {
                  examId: { type: 'string' },
                  marks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        studentId: { type: 'string' },
                        marksObtained: { type: 'number', example: 88 },
                        remarks: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Marks entered' },
        },
      },
    },
    '/api/exams/report/student/{studentId}': {
      get: {
        summary: 'Get Student Report Card details',
        tags: ['Reports & Exams'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Student report card' },
        },
      },
    },
    '/api/exams/{examId}/performance': {
      get: {
        summary: 'Get Exam Performance stats',
        tags: ['Reports & Exams'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'examId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Performance report' },
        },
      },
    },
    '/api/analytics/summary': {
      get: {
        summary: 'Get Dashboard Summary Analytics',
        tags: ['Analytics'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard stats summary' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
