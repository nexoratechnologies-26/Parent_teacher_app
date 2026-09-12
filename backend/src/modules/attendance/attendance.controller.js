const attendanceService = require('./attendance.service');
const { successResponse } = require('../../utils/responseHandler');
const { HTTP_STATUS } = require('../../utils/constants');

class AttendanceController {
  async markAttendance(req, res, next) {
    try {
      const { records } = req.body; // Array of { studentId, date, status, remarks }
      const teacherId = req.user.id;
      
      const result = await attendanceService.markBulkAttendance(records, teacherId);
      return successResponse(res, HTTP_STATUS.OK, 'Attendance marked successfully', result);
    } catch (err) {
      next(err);
    }
  }

  async getStudentAttendance(req, res, next) {
    try {
      const { studentId } = req.params;
      const attendance = await attendanceService.getStudentAttendance(studentId, req.user.id, req.user.role);
      return successResponse(res, HTTP_STATUS.OK, 'Student attendance fetched successfully', attendance);
    } catch (err) {
      next(err);
    }
  }

  async getClassAttendance(req, res, next) {
    try {
      const { gradeClass, section, date } = req.query;
      const attendance = await attendanceService.getClassAttendance(gradeClass, section, date);
      return successResponse(res, HTTP_STATUS.OK, 'Class attendance fetched successfully', attendance);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AttendanceController();
