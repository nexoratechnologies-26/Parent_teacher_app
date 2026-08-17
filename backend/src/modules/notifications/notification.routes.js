const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const { authenticateJWT } = require('../../config/jwt');

// GET /api/v1/notifications
router.get('/', authenticateJWT, notificationController.getNotifications);

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', authenticateJWT, notificationController.markAsRead);

module.exports = router;
