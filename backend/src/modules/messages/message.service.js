const messageRepository = require('./message.repository');
const notificationService = require('../notifications/notification.service');

class MessageService {
  async sendMessage(data, sender) {
    const { receiverId, studentId, message: messageText, attachmentUrl } = data;

    // Validate inputs
    if (!receiverId) {
      throw new Error('Receiver ID is required');
    }
    if (!studentId) {
      throw new Error('Student ID is required');
    }
    if (!messageText || messageText.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    // Role-based security validation
    if (sender.role === 'PARENT') {
      const isLinked = await messageRepository.isStudentLinkedToParent(studentId, sender.userId);
      if (!isLinked) {
        throw new Error('Unauthorized: This student is not linked to your parent profile');
      }
    }

    // Prepare message data
    const messageData = {
      senderId: sender.userId,
      receiverId,
      studentId,
      message: messageText,
      attachmentUrl,
      readStatus: 'SENT',
    };

    const message = await messageRepository.createMessage(messageData);

    // Create a message notification for the receiver
    try {
      await notificationService.createNotification({
        userId: receiverId,
        type: 'MESSAGE',
        title: `New Message from ${sender.name || 'Parent'}`,
        message: messageText.length > 50 ? `${messageText.substring(0, 50)}...` : messageText,
        referenceId: message._id,
        referenceType: 'Message',
      });
    } catch (err) {
      console.error('Failed to create message notification:', err.message);
    }

    return message;
  }

  async getMessageHistory(partnerId, user, query = {}) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    
    // Determine conversation ID deterministically
    const ids = [user.userId.toString(), partnerId.toString()].sort();
    const conversationId = ids.join('_');

    const filter = { conversationId };
    
    // Retrieve messages
    const result = await messageRepository.findMessages(filter, {
      page,
      limit,
      sort: { createdAt: 1 }, // chronological order for chat history
    });

    // Mark unread messages in this conversation received by this user as READ
    try {
      await messageRepository.markMessagesAsRead(conversationId, user.userId);
    } catch (err) {
      console.error('Failed to mark messages as read:', err.message);
    }

    return result;
  }

  async getTeachersForParent(parentId) {
    return await messageRepository.findTeachersForParent(parentId);
  }
}

module.exports = new MessageService();
