const express = require('express');
const router = express.Router();
const attendanceController = require('./attendance.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');
const { ROLES } = require('../../utils/constants');

router.use(authMiddleware);

// Mark attendance (Teacher only)
router.post(
  '/mark',
  roleMiddleware(ROLES.TEACHER, ROLES.ADMIN),
  attendanceController.markAttendance
);

// Get student attendance (Parent, Teacher, Admin)
router.get(
  '/student/:studentId',
  roleMiddleware(ROLES.PARENT, ROLES.TEACHER, ROLES.ADMIN),
  attendanceController.getStudentAttendance
);

// Get class attendance (Teacher, Admin)
router.get(
  '/class',
  roleMiddleware(ROLES.TEACHER, ROLES.ADMIN),
  attendanceController.getClassAttendance
);

module.exports = router;
