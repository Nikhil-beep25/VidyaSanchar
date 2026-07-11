import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import PDFDocument from 'pdfkit';
import * as XLSX from 'xlsx';

/**
 * Helper to generate certificate metadata audit records
 */
async function recordCertificateIssue(studentId: string, type: string, remarks?: string): Promise<string> {
  const certificateNumber = `CERT-${type}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  await prisma.certificateIssue.create({
    data: {
      studentId,
      certificateType: type,
      certificateNumber,
      remarks,
    }
  });
  return certificateNumber;
}

/**
 * 1. Download Student Report Card PDF
 */
export async function downloadReportCardPDF(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true } },
        studentClass: {
          include: {
            school: true
          }
        },
        marks: {
          include: {
            exam: {
              include: {
                subject: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ReportCard_${student.rollNumber}.pdf`);
    doc.pipe(res);

    const schoolName = student.studentClass.school?.name || 'VidyaSanchar Academy';
    const themeColor = student.studentClass.school?.themeColor || '#7C3AED';

    // Header & Branding
    doc.fillColor(themeColor).font('Helvetica-Bold').fontSize(22).text(schoolName, { align: 'center' });
    doc.fillColor('#4B5563').font('Helvetica').fontSize(10).text('ANNUAL ACADEMIC PROGRESS REPORT CARD', { align: 'center' });
    doc.moveDown(2);

    // Metadata grid
    doc.moveTo(50, 110).lineTo(550, 110).stroke('#E5E7EB');
    doc.fillColor('#1F2937').fontSize(10);
    doc.text(`Student Name: ${student.user.name}`, 50, 125);
    doc.text(`Roll Number: ${student.rollNumber}`, 50, 140);
    doc.text(`Admission No: ${student.admissionNumber}`, 50, 155);

    doc.text(`Classroom: ${student.studentClass.name}-${student.studentClass.section}`, 300, 125);
    doc.text(`Academic Year: 2026-2027`, 300, 140);
    doc.text(`Status: Promoted`, 300, 155);
    doc.moveDown(2);

    doc.moveTo(50, 175).lineTo(550, 175).stroke('#E5E7EB');

    // Marks Table
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(12).text('Subject Grading Report:', 50, 195, { underline: true });
    
    // Table Header
    doc.rect(50, 220, 500, 25).fill('#F3F4F6');
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(9);
    doc.text('Subject', 65, 228);
    doc.text('Exam Name', 200, 228);
    doc.text('Max Marks', 320, 228);
    doc.text('Passing Marks', 400, 228);
    doc.text('Marks Obtained', 480, 228);

    doc.font('Helvetica').fillColor('#4B5563');
    let y = 255;
    let totalMax = 0;
    let totalObtained = 0;

    if (student.marks.length === 0) {
      doc.text('No examination grades logged for this term.', 65, y);
      y += 20;
    } else {
      student.marks.forEach(m => {
        doc.text(m.exam.subject.name, 65, y);
        doc.text(m.exam.name, 200, y);
        doc.text(m.exam.maxMarks.toString(), 320, y);
        doc.text(m.exam.passingMarks.toString(), 400, y);
        
        const isPass = m.marksObtained >= m.exam.passingMarks;
        doc.fillColor(isPass ? '#10B981' : '#EF4444').font('Helvetica-Bold');
        doc.text(m.marksObtained.toString(), 480, y);
        doc.font('Helvetica').fillColor('#4B5563');

        totalMax += m.exam.maxMarks;
        totalObtained += m.marksObtained;
        y += 20;
      });
    }

    doc.moveTo(50, y).lineTo(550, y).stroke('#E5E7EB');
    y += 15;

    // Summary calculation
    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

    // Find all classmates to compute rank
    const classmates = await prisma.student.findMany({
      where: { classId: student.classId },
      include: {
        marks: {
          include: { exam: true }
        }
      }
    });

    const classPerformances = classmates.map(c => {
      let subMax = 0;
      let subObtained = 0;
      c.marks.forEach(m => {
        subMax += m.exam.maxMarks;
        subObtained += m.marksObtained;
      });
      const avgPercent = subMax > 0 ? (subObtained / subMax) * 100 : 0;
      return { studentId: c.id, avgPercent };
    });

    classPerformances.sort((a, b) => b.avgPercent - a.avgPercent);
    const rankIndex = classPerformances.findIndex(cp => cp.studentId === student.id);
    const rankSuffix = (r: number) => {
      const j = r % 10, k = r % 100;
      if (j == 1 && k != 11) return r + "st";
      if (j == 2 && k != 12) return r + "nd";
      if (j == 3 && k != 13) return r + "rd";
      return r + "th";
    };
    const classRankStr = rankIndex !== -1 ? rankSuffix(rankIndex + 1) : '1st';

    doc.font('Helvetica-Bold').fillColor('#1F2937');
    doc.text(`Aggregate Percentage: ${percentage}%`, 50, y);
    doc.text(`Class Rank: ${classRankStr}`, 300, y);

    // Signatures footer
    doc.font('Helvetica').fillColor('#9CA3AF').fontSize(9);
    doc.text('Class Teacher Signature', 50, 480, { align: 'left' });
    doc.text('Principal Authority Stamp', 400, 480, { align: 'right' });

    doc.end();
  } catch (error) {
    next(error);
  }
}

/**
 * 2. Download Bonafide / Character / Transfer Certificate (TC) PDF
 */
export async function downloadCertificatePDF(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;
    const { type } = req.query; // TC, BONAFIDE, CHARACTER

    if (!type || !['TC', 'BONAFIDE', 'CHARACTER'].includes(type as string)) {
      return res.status(400).json({ message: 'Invalid or missing certificate type parameter.' });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true, phone: true } },
        studentClass: {
          include: { school: true }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const certNumber = await recordCertificateIssue(studentId, type as string);

    const doc = new PDFDocument({ margin: 60 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${type}_${student.rollNumber}.pdf`);
    doc.pipe(res);

    const schoolName = student.studentClass.school?.name || 'VidyaSanchar Academy';
    const themeColor = student.studentClass.school?.themeColor || '#7C3AED';

    // Outer border decoration
    doc.rect(40, 40, 532, 712).stroke('#CCCCCC');
    doc.rect(45, 45, 522, 702).stroke(themeColor);

    // Letterhead
    doc.fillColor(themeColor).font('Helvetica-Bold').fontSize(24).text(schoolName, { align: 'center' });
    doc.fillColor('#4B5563').font('Helvetica').fontSize(10).text('Affiliated CBSE Secondary Education Branch Delhi NCR', { align: 'center' });
    doc.moveDown(2);

    // Title Card
    const titles: Record<string, string> = {
      BONAFIDE: 'BONAFIDE CERTIFICATE',
      TC: 'TRANSFER CERTIFICATE / SCHOOL LEAVING CERTIFICATE',
      CHARACTER: 'CHARACTER CERTIFICATE'
    };

    doc.rect(100, 150, 412, 35).fill('#F5F3FF');
    doc.fillColor(themeColor).font('Helvetica-Bold').fontSize(14).text(titles[type as string], 100, 160, { align: 'center' });
    doc.moveDown(3);

    // Text formatting
    doc.fillColor('#1F2937').font('Helvetica').fontSize(12).text(`Certificate Number: ${certNumber}`, 60, 220);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString('en-IN')}`, 350, 220);
    doc.moveDown(2);

    let mainParagraph = '';
    if (type === 'BONAFIDE') {
      mainParagraph = `This is to certify that Master/Miss ${student.user.name}, admission number ${student.admissionNumber}, is a bonafide student of ${schoolName}, studying in ${student.studentClass.name}-${student.studentClass.section} during the academic year 2026-2027. According to our office ledger records, their date of birth is logged as ${student.dateOfBirth.toLocaleDateString('en-IN')}.`;
    } else if (type === 'TC') {
      mainParagraph = `This is to certify that Master/Miss ${student.user.name}, roll number ${student.rollNumber}, student of class ${student.studentClass.name}, left the school on ${new Date().toLocaleDateString('en-IN')} having cleared all outstanding fee dues. Their conduct and diligence during their tenure at our academy has been Excellent. We wish them success in all future academic endeavors.`;
    } else {
      mainParagraph = `This is to certify that Master/Miss ${student.user.name}, student of classroom ${student.studentClass.name}, is personally known to us. During their education at ${schoolName}, they have displayed excellent behavior, a high standard of moral character, and participated active-diligently in curricular and co-curricular programs.`;
    }

    doc.fontSize(12).fillColor('#1F2937').text(mainParagraph, 60, 270, {
      align: 'justify',
      lineGap: 6,
      width: 490
    });

    // Verification QR simulation stamp
    doc.moveDown(4);
    doc.fillColor('#7C3AED').fontSize(10).text('Scan QR Code on Official Portal to Verify Credential Authenticity', 60, 450);
    doc.rect(60, 470, 70, 70).stroke('#CCCCCC');
    doc.fillColor('#9CA3AF').fontSize(8).text('QR Verified', 70, 500);

    // Signature stamps
    doc.fillColor('#4B5563').fontSize(11).text('Authorized Registrar', 60, 600);
    doc.text('Principal / Managing Director', 350, 600);

    doc.end();
  } catch (error) {
    next(error);
  }
}

/**
 * 3. Download Examination Admit Card PDF
 */
export async function downloadAdmitCardPDF(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;
    const { examId } = req.query; // optional specific exam ID

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true } },
        studentClass: {
          include: { school: true }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const exams = await prisma.exam.findMany({
      where: examId ? { id: examId as string } : {
        subject: { classId: student.classId }
      },
      include: {
        subject: true
      },
      orderBy: { date: 'asc' }
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=AdmitCard_${student.rollNumber}.pdf`);
    doc.pipe(res);

    const schoolName = student.studentClass.school?.name || 'VidyaSanchar Academy';
    const themeColor = student.studentClass.school?.themeColor || '#7C3AED';

    // Header banner
    doc.fillColor(themeColor).font('Helvetica-Bold').fontSize(20).text(schoolName, { align: 'center' });
    doc.fillColor('#1F2937').fontSize(11).text('OFFICIAL EXAMINATION HALL ENTRY PASS (ADMIT CARD)', { align: 'center' });
    doc.moveDown();

    // Table divider
    doc.moveTo(50, 110).lineTo(550, 110).stroke('#E5E7EB');

    // Student Info Card
    doc.fontSize(10).fillColor('#4B5563');
    doc.text(`Candidate Name: ${student.user.name}`, 50, 125);
    doc.text(`Roll Number: ${student.rollNumber}`, 50, 140);
    doc.text(`Admission No: ${student.admissionNumber}`, 50, 155);

    doc.text(`Exam Term: Final Examinations`, 300, 125);
    doc.text(`Room Allotment: Hall Room 4B`, 300, 140);
    doc.text(`Authorized Status: PAID / ACTIVE`, 300, 155);
    doc.moveDown(2);

    doc.moveTo(50, 175).lineTo(550, 175).stroke('#E5E7EB');

    // Exam dates grid
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(12).text('Subject schedules & dates:', 50, 195);
    
    // Header
    doc.rect(50, 220, 500, 25).fill('#F3F4F6');
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(9);
    doc.text('Date & Time', 65, 228);
    doc.text('Subject Name', 200, 228);
    doc.text('Subject Code', 350, 228);
    doc.text('Invigilator Sign', 450, 228);

    doc.font('Helvetica').fillColor('#4B5563');
    let y = 255;
    if (exams.length === 0) {
      doc.text('No scheduled exams registered for this classroom.', 65, y);
      y += 20;
    } else {
      exams.forEach(ex => {
        doc.text(new Date(ex.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }), 65, y);
        doc.text(ex.subject.name, 200, y);
        doc.text(ex.subject.code, 350, y);
        doc.text('______________', 450, y);
        y += 25;
      });
    }

    doc.moveTo(50, y).lineTo(550, y).stroke('#E5E7EB');
    y += 25;

    // Rules
    doc.fillColor('#EF4444').font('Helvetica-Bold').fontSize(10).text('Important Candidate Guidelines:', 50, y);
    y += 15;
    doc.fillColor('#4B5563').font('Helvetica').fontSize(8);
    doc.text('1. Candidates must arrive at the examination hall 15 minutes before the start time.', 50, y);
    doc.text('2. Calculators, smartwatches, or mobile devices are strictly forbidden inside the hall.', 50, y + 10);
    doc.text('3. Any candidate found communicating with others will be immediately debarred.', 50, y + 20);

    doc.end();
  } catch (error) {
    next(error);
  }
}

/**
 * 4. Download Student Attendance Summary Report PDF
 */
export async function downloadAttendanceReportPDF(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true } },
        studentClass: {
          include: { school: true }
        },
        attendance: {
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=AttendanceReport_${student.rollNumber}.pdf`);
    doc.pipe(res);

    const schoolName = student.studentClass.school?.name || 'VidyaSanchar Academy';
    const themeColor = student.studentClass.school?.themeColor || '#7C3AED';

    // Header banner
    doc.fillColor(themeColor).font('Helvetica-Bold').fontSize(20).text(schoolName, { align: 'center' });
    doc.fillColor('#1F2937').fontSize(11).text('OFFICIAL STUDENT ATTENDANCE ANALYSIS REPORT', { align: 'center' });
    doc.moveDown();

    doc.moveTo(50, 110).lineTo(550, 110).stroke('#E5E7EB');

    // Summary metadata
    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter(a => a.status === 'PRESENT').length;
    const absentDays = student.attendance.filter(a => a.status === 'ABSENT').length;
    const excusedDays = student.attendance.filter(a => a.status === 'EXCUSED').length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    doc.fontSize(10).fillColor('#4B5563');
    doc.text(`Student Name: ${student.user.name}`, 50, 125);
    doc.text(`Roll Number: ${student.rollNumber}`, 50, 140);
    doc.text(`Classroom: ${student.studentClass.name}-${student.studentClass.section}`, 50, 155);

    doc.text(`Total Teaching Days: ${totalDays}`, 300, 125);
    doc.text(`Present Days logged: ${presentDays}`, 300, 140);
    doc.text(`Absent Days logged: ${absentDays}`, 300, 155);
    doc.moveDown(2);

    doc.moveTo(50, 175).lineTo(550, 175).stroke('#E5E7EB');

    // Aggregate Analysis Box
    doc.rect(50, 195, 500, 50).fill('#F5F3FF');
    doc.fillColor(themeColor).font('Helvetica-Bold').fontSize(14).text(`Aggregate Attendance Score: ${attendancePercentage}%`, 65, 210);
    
    // Attendance Ledger List
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(12).text('Detailed Daily History Log:', 50, 265);
    
    // Header
    doc.rect(50, 290, 500, 25).fill('#F3F4F6');
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(9);
    doc.text('Date', 65, 298);
    doc.text('Attendance Status', 250, 298);
    doc.text('Remarks / Excuses', 400, 298);

    doc.font('Helvetica').fillColor('#4B5563');
    let y = 325;
    if (student.attendance.length === 0) {
      doc.text('No attendance logs registered in database.', 65, y);
      y += 20;
    } else {
      student.attendance.forEach(a => {
        doc.text(new Date(a.date).toLocaleDateString('en-IN'), 65, y);
        
        const isPresent = a.status === 'PRESENT';
        doc.fillColor(isPresent ? '#10B981' : '#EF4444').font('Helvetica-Bold');
        doc.text(a.status, 250, y);
        doc.font('Helvetica').fillColor('#4B5563');
        
        doc.text(a.remarks || 'Standard day Log', 400, y);
        y += 20;
      });
    }

    doc.end();
  } catch (error) {
    next(error);
  }
}

/**
 * 5. Download Attendance Report Excel
 */
export async function downloadAttendanceReportExcel(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true } },
        studentClass: true,
        attendance: { orderBy: { date: 'desc' } }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const data = student.attendance.map(a => ({
      'Student Name': student.user.name,
      'Class': `${student.studentClass.name}-${student.studentClass.section}`,
      'Date': new Date(a.date).toLocaleDateString('en-IN'),
      'Status': a.status,
      'Remarks': a.remarks || 'Standard entry'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance History');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Attendance_${student.rollNumber}.xlsx`);
    return res.send(buf);
  } catch (error) {
    next(error);
  }
}

/**
 * 6. Download Fee Collections Report Excel
 */
export async function downloadFeesCollectionExcel(req: Request, res: Response, next: NextFunction) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        fee: true,
        student: {
          include: {
            user: { select: { name: true } },
            studentClass: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const data = payments.map(p => ({
      'Receipt Number': p.receiptNumber,
      'Student Name': p.student.user.name,
      'Class': `${p.student.studentClass.name}-${p.student.studentClass.section}`,
      'Fee Component': p.fee.title,
      'Amount Paid (INR)': p.amountPaid,
      'Payment Date': new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN'),
      'Payment Method': p.paymentMethod
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Fee Collection Log');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=FeeCollections_${Date.now()}.xlsx`);
    return res.send(buf);
  } catch (error) {
    next(error);
  }
}

/**
 * 7. Download Exam Results Sheets Excel
 */
export async function downloadExamsResultExcel(req: Request, res: Response, next: NextFunction) {
  try {
    const marks = await prisma.mark.findMany({
      include: {
        student: {
          include: {
            user: { select: { name: true } },
            studentClass: true
          }
        },
        exam: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { exam: { date: 'desc' } }
    });

    const data = marks.map(m => {
      const percentage = (m.marksObtained / m.exam.maxMarks) * 100;
      const passed = m.marksObtained >= m.exam.passingMarks;
      
      // Dynamic CBSE Letter Grade assignment
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';
      else if (percentage >= 33) grade = 'E';

      return {
        'Exam Title': m.exam.name,
        'Subject': m.exam.subject.name,
        'Class': `${m.student.studentClass.name}-${m.student.studentClass.section}`,
        'Student Name': m.student.user.name,
        'Roll Number': m.student.rollNumber,
        'Marks Obtained': m.marksObtained,
        'Max Marks': m.exam.maxMarks,
        'Percentage (%)': Math.round(percentage * 100) / 100,
        'Grade': grade,
        'Result': passed ? 'PASSED' : 'FAILED',
        'Teacher Remarks': m.remarks || ''
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Academic Results Ledgers');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=ExamResults_${Date.now()}.xlsx`);
    return res.send(buf);
  } catch (error) {
    next(error);
  }
}
