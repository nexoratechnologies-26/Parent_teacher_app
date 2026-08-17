const notificationService = require('./notification.service');

const getNotifications = async (req, res) => {
  try {
    const { page, limit, unreadOnly } = req.query;
    const result = await notificationService.getUserNotifications(req.user.userId, { page, limit, unreadOnly });
    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications: ' + error.message,
      error: 'SERVER_ERROR',
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.markNotificationAsRead(id, req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read successfully',
      data: result,
    });
  } catch (error) {
    const isNotFound = error.message.includes('not found');
    const isUnauthorized = error.message.includes('Unauthorized');
    const status = isNotFound ? 404 : (isUnauthorized ? 403 : 400);
    const errCode = isNotFound ? 'NOT_FOUND' : (status === 403 ? 'FORBIDDEN' : 'BAD_REQUEST');

    return res.status(status).json({
      success: false,
      message: error.message,
      error: errCode,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
