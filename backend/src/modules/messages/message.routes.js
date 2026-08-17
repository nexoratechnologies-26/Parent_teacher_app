const express = require('express');
const router = express.Router();
const messageController = require('./message.controller');
const { authenticateJWT, authorizeRoles } = require('../../config/jwt');

// GET /api/v1/communications/teachers
router.get('/teachers', authenticateJWT, authorizeRoles('PARENT', 'ADMIN'), messageController.getTeachers);

// GET /api/v1/communications/messages/:teacherId
router.get('/messages/:teacherId', authenticateJWT, authorizeRoles('PARENT', 'TEACHER', 'ADMIN'), messageController.getMessageHistory);

// POST /api/v1/communications/messages
router.post('/messages', authenticateJWT, authorizeRoles('PARENT', 'TEACHER'), messageController.sendMessage);

module.exports = router;
