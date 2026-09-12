const attendanceRepository = require('./attendance.repository');
const studentService = require('../students/student.service');

class AttendanceService {
  async markBulkAttendance(records, teacherId) {
    // Normalize date to start of day for comparison
    const preparedRecords = records.map(r => {
      const date = new Date(r.date);
      date.setUTCHours(0, 0, 0, 0);
      return {
        ...r,
        date,
        markedBy: teacherId
      };
    });

    await attendanceRepository.bulkUpsert(preparedRecords);
    return { success: true, count: preparedRecords.length };
  }

  async getStudentAttendance(studentId, parentId = null, role = null) {
    const student = await studentService.getStudentById(studentId);
    
    // Auth check if it's a PARENT
    if (role === 'PARENT' && String(student.parent?._id) !== String(parentId)) {
      const error = new Error('Not authorized to view this student\'s attendance');
      error.statusCode = 403;
      throw error;
    }

    return await attendanceRepository.findByStudent(studentId);
  }

  async getClassAttendance(gradeClass, section, date) {
    return await attendanceRepository.findByClass(gradeClass, section, date);
  }
}

module.exports = new AttendanceService();
