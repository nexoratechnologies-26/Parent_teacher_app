const Student = require('./student.model');

class StudentRepository {
  async create(studentData) {
    return await Student.create(studentData);
  }

  async findById(id) {
    return await Student.findById(id).populate('parent', 'firstName lastName email');
  }

  async findByClass(gradeClass, section) {
    const query = {};
    if (gradeClass) query.gradeClass = gradeClass;
    if (section) query.section = section;
    return await Student.find(query).populate('parent', 'firstName lastName email');
  }

  async findByRollNumber(rollNumber) {
    return await Student.findOne({ rollNumber });
  }

  async update(id, updateData) {
    return await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Student.findByIdAndDelete(id);
  }

  async findByParent(parentId) {
    return await Student.find({ parent: parentId });
  }
}

module.exports = new StudentRepository();
