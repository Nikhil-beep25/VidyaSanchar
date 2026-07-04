import { PrismaClient, RoleType, AttendanceStatus, PaymentStatus, IssueStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Indian context...');

  // 1. Hash passwords
  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // 2. Clear existing records to ensure idempotent seed
  await prisma.contactSubmission.deleteMany({});
  await prisma.bookIssue.deleteMany({});
  await prisma.libraryBook.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.timetable.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.fee.deleteMany({});
  await prisma.mark.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.parent.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.user.deleteMany({});

  // 3. Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@sms.edu.in',
      passwordHash: defaultPasswordHash,
      name: 'Rajesh Kumar Iyer',
      role: RoleType.SUPER_ADMIN,
      phone: '+919876543210',
      address: 'Flat 402, Sai Balaji Residency, Indiranagar, Bengaluru, Karnataka - 560038',
      profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
      isActive: true,
    },
  });
  console.log('Created Super Admin:', superAdmin.email);

  // 4. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sms.edu.in',
      passwordHash: defaultPasswordHash,
      name: 'Nikhil Bhadauriya',
      role: RoleType.ADMIN,
      phone: '+919876543211',
      address: 'B-12, Sector 4, Dwarka, New Delhi - 110075',
      profileImage: '/assets/avatars/admin-male.png',
      isActive: true,
    },
  });
  console.log('Created Admin:', admin.email);

  // 5. Create Teachers
  const teacherData = [
    {
      email: 'ramesh.verma@sms.edu.in',
      name: 'Ramesh Verma',
      employeeId: 'T-2026-101',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      specialization: 'Algebra & Calculus',
      phone: '+919876543212',
      address: '23, Anand Nagar, Chitawad, Indore, Madhya Pradesh - 452001',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    },
    {
      email: 'p Priya.nair@sms.edu.in', // Fix spacing if any
      name: 'Priya Nair',
      employeeId: 'T-2026-102',
      qualification: 'Ph.D. in English Literature',
      specialization: 'Communicative English',
      phone: '+919876543213',
      address: 'TC 12/45, Kowdiar, Thiruvananthapuram, Kerala - 695003',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    },
    {
      email: 'amit.patel@sms.edu.in',
      name: 'Amit Patel',
      employeeId: 'T-2026-103',
      qualification: 'M.Tech in Computer Science',
      specialization: 'Data Structures & Python',
      phone: '+919876543214',
      address: 'A-404, Shanti Nagar, SG Highway, Ahmedabad, Gujarat - 380015',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    }
  ];

  const teachers: any[] = [];
  for (const t of teacherData) {
    const user = await prisma.user.create({
      data: {
        email: t.email.replace(/\s+/g, ''),
        passwordHash: defaultPasswordHash,
        name: t.name,
        role: RoleType.TEACHER,
        phone: t.phone,
        address: t.address,
        profileImage: t.profileImage,
      }
    });

    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId: t.employeeId,
        qualification: t.qualification,
        specialization: t.specialization,
        joiningDate: new Date('2022-06-15'),
      }
    });
    teachers.push(teacher);
  }
  console.log(`Created ${teachers.length} Teachers.`);

  // 6. Create Classes
  const classA = await prisma.class.create({
    data: {
      name: 'Class 10',
      section: 'A',
      roomNumber: 'Room 101',
      classTeacherId: teachers[0].id, // Ramesh Verma
    }
  });

  const classB = await prisma.class.create({
    data: {
      name: 'Class 11',
      section: 'B',
      roomNumber: 'Room 203',
      classTeacherId: teachers[2].id, // Amit Patel
    }
  });

  const classC = await prisma.class.create({
    data: {
      name: 'B.Tech CSE',
      section: 'Semester 1',
      roomNumber: 'Lab 3',
      classTeacherId: teachers[2].id, // Amit Patel
    }
  });
  console.log('Created Classes: 10-A, 11-B, B.Tech CSE S-1');

  // 7. Create Parents
  const parentData = [
    {
      email: 'anil.sharma@parent.sms.edu.in',
      name: 'Anil Sharma',
      occupation: 'Chartered Accountant',
      relation: 'Father',
      phone: '+919988776655',
      address: 'D-56, Mansarovar, Jaipur, Rajasthan - 302020',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120',
    },
    {
      email: 'meena.das@parent.sms.edu.in',
      name: 'Meena Das',
      occupation: 'Government School Teacher',
      relation: 'Mother',
      phone: '+919988776644',
      address: 'Quarter No. 45, Sector-3, Rourkela, Odisha - 769002',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    }
  ];

  const parents: any[] = [];
  for (const p of parentData) {
    const user = await prisma.user.create({
      data: {
        email: p.email,
        passwordHash: defaultPasswordHash,
        name: p.name,
        role: RoleType.PARENT,
        phone: p.phone,
        address: p.address,
        profileImage: p.profileImage,
      }
    });

    const parent = await prisma.parent.create({
      data: {
        userId: user.id,
        occupation: p.occupation,
        relation: p.relation,
      }
    });
    parents.push(parent);
  }
  console.log(`Created ${parents.length} Parents.`);

  // 8. Create Students
  const studentData = [
    {
      email: 'aarav.sharma@student.sms.edu.in',
      name: 'Aarav Sharma',
      rollNumber: '10A01',
      admissionNumber: 'ADM-2026-0001',
      dateOfBirth: new Date('2011-04-12'),
      gender: 'Male',
      bloodGroup: 'O+',
      classId: classA.id,
      parentId: parents[0].id, // Anil Sharma
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    },
    {
      email: 'snigdha.das@student.sms.edu.in',
      name: 'Snigdha Das',
      rollNumber: '10A02',
      admissionNumber: 'ADM-2026-0002',
      dateOfBirth: new Date('2011-09-22'),
      gender: 'Female',
      bloodGroup: 'B+',
      classId: classA.id,
      parentId: parents[1].id, // Meena Das
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    },
    {
      email: 'vikram.singh@student.sms.edu.in',
      name: 'Vikram Singh Shekhawat',
      rollNumber: '11B01',
      admissionNumber: 'ADM-2026-0003',
      dateOfBirth: new Date('2010-01-05'),
      gender: 'Male',
      bloodGroup: 'A+',
      classId: classB.id,
      parentId: parents[0].id, // Also linked to Anil Gupta (siblings)
      profileImage: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=120',
    }
  ];

  const students: any[] = [];
  for (const s of studentData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: defaultPasswordHash,
        name: s.name,
        role: RoleType.STUDENT,
        phone: '+919999988888',
        address: 'Same as parent address',
        profileImage: s.profileImage,
      }
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        rollNumber: s.rollNumber,
        admissionNumber: s.admissionNumber,
        dateOfBirth: s.dateOfBirth,
        gender: s.gender,
        bloodGroup: s.bloodGroup,
        classId: s.classId,
        parentId: s.parentId,
      }
    });
    students.push(student);
  }
  console.log(`Created ${students.length} Students.`);

  // 9. Create Subjects
  const subMath = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      code: 'MATH101',
      classId: classA.id,
      teacherId: teachers[0].id, // Ramesh Verma
    }
  });

  const subEnglish = await prisma.subject.create({
    data: {
      name: 'Communicative English',
      code: 'ENG101',
      classId: classA.id,
      teacherId: teachers[1].id, // Priya Nair
    }
  });

  const subCS = await prisma.subject.create({
    data: {
      name: 'Computer Applications',
      code: 'COMP201',
      classId: classB.id,
      teacherId: teachers[2].id, // Amit Patel
    }
  });
  console.log('Created Subjects: Math (10-A), English (10-A), Computer Apps (11-B)');

  // 10. Create Attendance
  const dates = [
    new Date('2026-07-01'),
    new Date('2026-07-02'),
    new Date('2026-07-03'),
    new Date('2026-07-04')
  ];

  for (const date of dates) {
    await prisma.attendance.create({
      data: {
        date,
        status: AttendanceStatus.PRESENT,
        studentId: students[0].id, // Rahul Gupta
        classId: classA.id,
        remarks: 'Punctual'
      }
    });

    await prisma.attendance.create({
      data: {
        date,
        status: date.getDay() === 3 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
        studentId: students[1].id, // Snigdha Das
        classId: classA.id,
        remarks: date.getDay() === 3 ? 'Unwell' : 'Active participation'
      }
    });
  }
  console.log('Seed Attendance entries recorded.');

  // 11. Create Exams & Marks
  const examTerm1 = await prisma.exam.create({
    data: {
      name: 'Term 1 Mid-Term Examination',
      type: 'Written Test',
      date: new Date('2026-07-15'),
      maxMarks: 100,
      passingMarks: 33,
      subjectId: subMath.id,
    }
  });

  const examEngClass = await prisma.exam.create({
    data: {
      name: 'English Language assessment',
      type: 'Practical / Speaking',
      date: new Date('2026-07-10'),
      maxMarks: 50,
      passingMarks: 17,
      subjectId: subEnglish.id,
    }
  });

  // Enter marks
  await prisma.mark.createMany({
    data: [
      {
        studentId: students[0].id, // Rahul
        examId: examTerm1.id,
        marksObtained: 88,
        remarks: 'Excellent in algebra, needs minor improvement in geometry'
      },
      {
        studentId: students[1].id, // Snigdha
        examId: examTerm1.id,
        marksObtained: 94,
        remarks: 'Outstanding performance, top of the class'
      },
      {
        studentId: students[0].id, // Rahul
        examId: examEngClass.id,
        marksObtained: 42,
        remarks: 'Fluent speaking style'
      },
      {
        studentId: students[1].id, // Snigdha
        examId: examEngClass.id,
        marksObtained: 46,
        remarks: 'Excellent vocabulary'
      }
    ]
  });
  console.log('Created Exams & Marks.');

  // 12. Fees & Payments
  const feeTerm1 = await prisma.fee.create({
    data: {
      title: 'First Quarter Tuition Fee (2026-27)',
      amount: 32000,
      dueDate: new Date('2026-07-31'),
      classId: classA.id,
    }
  });

  const feeSports = await prisma.fee.create({
    data: {
      title: 'Annual Sports & Gymkhana Fee',
      amount: 4500,
      dueDate: new Date('2026-08-15'),
      classId: classA.id,
    }
  });

  // Payments
  await prisma.payment.create({
    data: {
      feeId: feeTerm1.id,
      studentId: students[0].id, // Rahul
      amountPaid: 32000,
      paymentMethod: 'UPI',
      status: PaymentStatus.PAID,
      receiptNumber: 'REC-2026-0941',
    }
  });

  await prisma.payment.create({
    data: {
      feeId: feeTerm1.id,
      studentId: students[1].id, // Snigdha
      amountPaid: 15000,
      paymentMethod: 'NetBanking',
      status: PaymentStatus.PARTIAL,
      receiptNumber: 'REC-2026-0942',
    }
  });
  console.log('Seeded Fee structures and payments.');

  // 13. Timetables
  const timetableSlots = [
    { day: 'MONDAY', start: '08:30', end: '09:15', room: 'Room 101', class: classA.id, subject: subMath.id, teacher: teachers[0].id },
    { day: 'MONDAY', start: '09:15', end: '10:00', room: 'Room 101', class: classA.id, subject: subEnglish.id, teacher: teachers[1].id },
    { day: 'TUESDAY', start: '08:30', end: '09:15', room: 'Room 101', class: classA.id, subject: subMath.id, teacher: teachers[0].id },
    { day: 'WEDNESDAY', start: '10:30', end: '11:15', room: 'Room 203', class: classB.id, subject: subCS.id, teacher: teachers[2].id }
  ];

  for (const slot of timetableSlots) {
    await prisma.timetable.create({
      data: {
        dayOfWeek: slot.day,
        startTime: slot.start,
        endTime: slot.end,
        roomNumber: slot.room,
        classId: slot.class,
        subjectId: slot.subject,
        teacherId: slot.teacher,
      }
    });
  }
  console.log('Seeded Timetable schedules.');

  // 14. Assignments
  await prisma.assignment.create({
    data: {
      title: 'Polynomial Exercise 2.4',
      description: 'Solve all questions from Exercise 2.4 in the NCERT Class 10 Textbook and upload the scanned PDF.',
      dueDate: new Date('2026-07-10'),
      classId: classA.id,
      subjectId: subMath.id,
    }
  });

  await prisma.assignment.create({
    data: {
      title: 'Vowel Sounds Speaking Assignment',
      description: 'Record an audio file reading the passage on page 40 and upload.',
      dueDate: new Date('2026-07-12'),
      classId: classA.id,
      subjectId: subEnglish.id,
    }
  });
  console.log('Seeded Class Assignments.');

  // 15. Library Books & Book Issues
  const books = [
    { title: 'NCERT Mathematics Class 10', author: 'NCERT board', isbn: '978-8174505081', qty: 10 },
    { title: 'Concepts of Physics - Vol 1', author: 'H.C. Verma', isbn: '978-8177091878', qty: 5 },
    { title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', isbn: '978-0262033848', qty: 3 }
  ];

  const dbBooks: any[] = [];
  for (const b of books) {
    const book = await prisma.libraryBook.create({
      data: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        quantity: b.qty,
        availableQuantity: b.qty - 1,
        location: 'Rack A, Shelf 2',
      }
    });
    dbBooks.push(book);
  }

  // Issue books
  await prisma.bookIssue.create({
    data: {
      bookId: dbBooks[0].id,
      studentId: students[0].id, // Rahul
      dueDate: new Date('2026-07-20'),
      status: IssueStatus.ISSUED,
    }
  });

  await prisma.bookIssue.create({
    data: {
      bookId: dbBooks[1].id,
      studentId: students[1].id, // Snigdha
      dueDate: new Date('2026-06-30'), // Already past
      status: IssueStatus.OVERDUE,
      fineAmount: 50.0,
    }
  });
  console.log('Seeded Library books and issue records.');

  // 16. Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: 'Independence Day Celebration',
        message: 'All students are requested to assemble in the school ground in proper school uniform at 7:30 AM on 15th August for Flag Hoisting.',
        recipientRole: RoleType.STUDENT,
        isAnnouncement: true,
      },
      {
        title: 'Parent-Teacher Meeting (PTM) Scheduled',
        message: 'Dear Parents, the first PTM for this academic year is scheduled on Saturday, July 18, 2026, from 9:00 AM to 1:00 PM.',
        recipientRole: RoleType.PARENT,
        isAnnouncement: true,
      },
      {
        title: 'New Syllabus Guidelines - CBSE',
        message: 'Attention Teachers, please download the updated curriculum documentation for 2026-27 and align your lesson plans.',
        recipientRole: RoleType.TEACHER,
        isAnnouncement: true,
      }
    ]
  });

  // Contact submission
  await prisma.contactSubmission.create({
    data: {
      name: 'Delhi Public School Dwarka',
      email: 'info@dpsdwarka.in',
      phone: '+911125074600',
      subject: 'Inquiry about Enterprise Pricing',
      message: 'Hello, we are interested in deploying this student management system across our 3 Delhi branches. Please arrange a live demonstration and custom quote.'
    }
  });

  console.log('Database Seeding Completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
