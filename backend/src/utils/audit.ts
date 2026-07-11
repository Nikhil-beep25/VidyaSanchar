import prisma from '../config/db';

/**
 * Creates an audit log record in the database.
 * @param userId ID of the user performing the action
 * @param action Type of action (e.g. STUDENT_CREATED, ATTENDANCE_RECORDED, etc.)
 * @param details Short description or context about the action
 * @param schoolId School context (if available)
 */
export async function createAuditLog(
  userId: string | undefined,
  action: string,
  details: string,
  schoolId?: string | null
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        details,
        schoolId: schoolId || null,
      },
    });
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
}
