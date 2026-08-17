const express = require('express');
const router = express.Router();
const announcementController = require('./announcement.controller');
const { authenticateJWT, authorizeRoles } = require('../../config/jwt');

// GET /api/v1/announcements
router.get('/', authenticateJWT, announcementController.getAnnouncements);

// POST /api/v1/announcements
router.post('/', authenticateJWT, authorizeRoles('ADMIN', 'TEACHER'), announcementController.createAnnouncement);

module.exports = router;
