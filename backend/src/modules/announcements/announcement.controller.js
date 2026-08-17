const announcementService = require('./announcement.service');

const createAnnouncement = async (req, res) => {
  try {
    const announcement = await announcementService.createAnnouncement(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'BAD_REQUEST',
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const { category, targetAudience, page, limit } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (targetAudience) filters.targetAudience = targetAudience;

    const result = await announcementService.getAnnouncements(filters, req.user, { page, limit });
    return res.status(200).json({
      success: true,
      message: 'Announcements retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve announcements: ' + error.message,
      error: 'SERVER_ERROR',
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
};
