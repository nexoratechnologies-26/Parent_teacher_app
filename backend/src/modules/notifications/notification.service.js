const Notification = require('./notification.model');

class NotificationService {
  async createNotification(data) {
    const notification = new Notification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      readStatus: false,
    });
    return await notification.save();
  }

  async createBulkNotifications(userIds, data) {
    if (!userIds || userIds.length === 0) return [];
    
    const notifications = userIds.map((userId) => ({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      readStatus: false,
    }));

    return await Notification.insertMany(notifications);
  }

  async getUserNotifications(userId, queryOptions = {}) {
    const page = parseInt(queryOptions.page || '1', 10);
    const limit = parseInt(queryOptions.limit || '20', 10);
    const unreadOnly = queryOptions.unreadOnly === true || queryOptions.unreadOnly === 'true';

    const skip = (page - 1) * limit;

    const filter = { userId };
    if (unreadOnly) {
      filter.readStatus = false;
    }

    const data = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Notification.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markNotificationAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized: You can only modify your own notifications');
    }

    notification.readStatus = true;
    return await notification.save();
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { userId, readStatus: false },
      { $set: { readStatus: true } }
    ).exec();
  }
}

module.exports = new NotificationService();
