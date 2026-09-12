const express = require('express');
const router = express.Router();
const studentController = require('./student.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');
const upload = require('../../middleware/upload.middleware');
const { ROLES } = require('../../utils/constants');

router.use(authMiddleware);

// Create student
router.post(
  '/',
  roleMiddleware(ROLES.ADMIN, ROLES.TEACHER),
  upload.single('profileImage'),
  studentController.createStudent
);

// Get students (class/section for admin/teacher, or parent's own students)
router.get(
  '/',
  roleMiddleware(ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT),
  studentController.getStudents
);

// Get student by ID
router.get(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT),
  studentController.getStudentById
);

// Update student
router.put(
  '/:id',
  roleMiddleware(ROLES.ADMIN),
  upload.single('profileImage'),
  studentController.updateStudent
);

// Delete student
router.delete(
  '/:id',
  roleMiddleware(ROLES.ADMIN),
  studentController.deleteStudent
);

module.exports = router;
