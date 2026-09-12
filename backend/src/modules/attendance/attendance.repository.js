const Attendance = require('./attendance.model');
const Student = require('../students/student.model');
const mongoose = require('mongoose');

class AttendanceRepository {
  async bulkUpsert(attendanceRecords) {
    const ops = attendanceRecords.map(record => ({
      updateOne: {
        filter: { student: record.student, date: record.date },
        update: { $set: record },
        upsert: true
      }
    }));
    return await Attendance.bulkWrite(ops);
  }

  async findByStudent(studentId, startDate, endDate) {
    const query = { student: studentId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    return await Attendance.find(query).sort({ date: -1 });
  }

  async findByClass(gradeClass, section, date) {
    // We need to find all students in the class, then fetch their attendance for the date
    const students = await Student.find({ gradeClass, section }, '_id');
    const studentIds = students.map(s => s._id);

    const query = { student: { $in: studentIds } };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    return await Attendance.find(query).populate('student', 'firstName lastName rollNumber');
  }
}

module.exports = new AttendanceRepository();
