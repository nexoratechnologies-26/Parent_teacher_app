const studentRepository = require('./student.repository');

class StudentService {
  async createStudent(data) {
    const existing = await studentRepository.findByRollNumber(data.rollNumber);
    if (existing) {
      const error = new Error('Student with this roll number already exists');
      error.statusCode = 400;
      throw error;
    }
    return await studentRepository.create(data);
  }

  async getStudentById(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      const error = new Error('Student not found');
      error.statusCode = 404;
      throw error;
    }
    return student;
  }

  async getStudentsByClass(gradeClass, section) {
    return await studentRepository.findByClass(gradeClass, section);
  }

  async getStudentsByParent(parentId) {
    return await studentRepository.findByParent(parentId);
  }

  async updateStudent(id, data) {
    const student = await studentRepository.update(id, data);
    if (!student) {
      const error = new Error('Student not found');
      error.statusCode = 404;
      throw error;
    }
    return student;
  }

  async deleteStudent(id) {
    const student = await studentRepository.delete(id);
    if (!student) {
      const error = new Error('Student not found');
      error.statusCode = 404;
      throw error;
    }
    return student;
  }
}

module.exports = new StudentService();
