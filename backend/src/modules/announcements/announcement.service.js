const mongoose = require('mongoose');
const announcementRepository = require('./announcement.repository');

class AnnouncementService {
  async createAnnouncement(data, creator) {
    // Basic service-level validation
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Announcement title cannot be empty');
    }
    if (!data.body || data.body.trim().length === 0) {
      throw new Error('Announcement body cannot be empty');
    }
    if (!data.category) {
      data.category = 'GENERAL';
    }

    // Set defaults and creator info
    const newAnnouncementData = {
      title: data.title,
      body: data.body,
      category: data.category,
      targetAudience: data.targetAudience || ['ALL'],
      eventDate: data.eventDate,
      createdBy: creator.userId,
    };

    const announcement = await announcementRepository.createAnnouncement(newAnnouncementData);

    // Integrate with Notifications Module asynchronously
    // We defer importing NotificationService to prevent potential circular dependency
    try {
      const notificationService = require('../notifications/notification.service');
      
      // Determine user roles to notify based on targetAudience
      let targetRoles = [];
      if (newAnnouncementData.targetAudience.includes('ALL')) {
        targetRoles = ['PARENT', 'TEACHER', 'ADMIN'];
      } else {
        if (newAnnouncementData.targetAudience.includes('PARENTS')) targetRoles.push('PARENT');
        if (newAnnouncementData.targetAudience.includes('TEACHERS')) targetRoles.push('TEACHER');
        if (newAnnouncementData.targetAudience.includes('ADMINS')) targetRoles.push('ADMIN');
      }

      // Dynamically fetch users from the database using connection to avoid importing User model
      const db = mongoose.connection.db;
      if (db && targetRoles.length > 0) {
        const users = await db.collection('users')
          .find({ role: { $in: targetRoles } })
          .project({ _id: 1 })
          .toArray();

        const userIds = users.map(u => u._id);

        if (userIds.length > 0) {
          await notificationService.createBulkNotifications(userIds, {
            type: 'ANNOUNCEMENT',
            title: `New ${announcement.category} Announcement`,
            message: announcement.title,
            referenceId: announcement._id,
            referenceType: 'Announcement',
          });
        }
      }
    } catch (err) {
      // Log notification error but don't fail announcement creation
      console.error('Failed to dispatch notifications for announcement:', err.message);
    }

    return announcement;
  }

  async getAnnouncements(filters = {}, user, query = {}) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const options = { page, limit };

    // Compute audience filter based on user role
    const allowedAudiences = ['ALL'];
    if (user.role === 'PARENT') {
      allowedAudiences.push('PARENTS');
    } else if (user.role === 'TEACHER') {
      allowedAudiences.push('TEACHERS');
    } else if (user.role === 'ADMIN') {
      // Admin has access to all audience targeted items
      allowedAudiences.push('ADMINS', 'PARENTS', 'TEACHERS');
    }

    const finalFilter = {};

    // Apply category filter if specified
    if (filters.category) {
      finalFilter.category = filters.category;
    }

    // Apply targetAudience filter if specified, intersected with allowed audiences
    if (filters.targetAudience) {
      if (allowedAudiences.includes(filters.targetAudience)) {
        finalFilter.targetAudience = filters.targetAudience;
      } else {
        // Requested an audience they don't have access to
        return {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
    } else {
      // Default: show anything matching allowed audiences
      finalFilter.targetAudience = { $in: allowedAudiences };
    }

    return await announcementRepository.findAnnouncements(finalFilter, options);
  }
}

module.exports = new AnnouncementService();
