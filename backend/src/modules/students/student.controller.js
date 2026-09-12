const studentService = require('./student.service');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const { HTTP_STATUS } = require('../../utils/constants');

class StudentController {
  async createStudent(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.profileImage = `/uploads/${req.file.filename}`;
      }
      const student = await studentService.createStudent(data);
      return successResponse(res, HTTP_STATUS.CREATED, 'Student created successfully', student);
    } catch (err) {
      next(err);
    }
  }

  async getStudents(req, res, next) {
    try {
      const { gradeClass, section } = req.query;
      let students = [];
      if (req.user.role === 'PARENT') {
        students = await studentService.getStudentsByParent(req.user.id);
      } else {
        students = await studentService.getStudentsByClass(gradeClass, section);
      }
      return successResponse(res, HTTP_STATUS.OK, 'Students fetched successfully', students);
    } catch (err) {
      next(err);
    }
  }

  async getStudentById(req, res, next) {
    try {
      const student = await studentService.getStudentById(req.params.id);
      
      // Access control: PARENT can only see their own children
      if (req.user.role === 'PARENT' && String(student.parent?._id) !== String(req.user.id)) {
        return errorResponse(res, HTTP_STATUS.FORBIDDEN, 'Not authorized to view this student');
      }

      return successResponse(res, HTTP_STATUS.OK, 'Student fetched successfully', student);
    } catch (err) {
      next(err);
    }
  }

  async updateStudent(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.profileImage = `/uploads/${req.file.filename}`;
      }
      const student = await studentService.updateStudent(req.params.id, data);
      return successResponse(res, HTTP_STATUS.OK, 'Student updated successfully', student);
    } catch (err) {
      next(err);
    }
  }

  async deleteStudent(req, res, next) {
    try {
      await studentService.deleteStudent(req.params.id);
      return successResponse(res, HTTP_STATUS.OK, 'Student deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentController();
