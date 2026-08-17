const messageService = require('./message.service');

const getTeachers = async (req, res) => {
  try {
    if (req.user.role !== 'PARENT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only parents can retrieve student teachers list',
        error: 'FORBIDDEN',
      });
    }

    const teachers = await messageService.getTeachersForParent(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Teachers retrieved successfully',
      data: teachers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve teachers: ' + error.message,
      error: 'SERVER_ERROR',
    });
  }
};

const getMessageHistory = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { page, limit } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID is required in URL parameters',
        error: 'BAD_REQUEST',
      });
    }

    const history = await messageService.getMessageHistory(teacherId, req.user, { page, limit });
    return res.status(200).json({
      success: true,
      message: 'Message history retrieved successfully',
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve message history: ' + error.message,
      error: 'SERVER_ERROR',
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const message = await messageService.sendMessage(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    const isValidationError = error.message.includes('validation') || error.message.includes('required') || error.message.includes('empty');
    const status = isValidationError ? 400 : (error.message.includes('Unauthorized') ? 403 : 500);
    const errCode = isValidationError ? 'BAD_REQUEST' : (status === 403 ? 'FORBIDDEN' : 'SERVER_ERROR');
    
    return res.status(status).json({
      success: false,
      message: error.message,
      error: errCode,
    });
  }
};

module.exports = {
  getTeachers,
  getMessageHistory,
  sendMessage,
};
