const Announcement = require('./announcement.model');

class AnnouncementRepository {
  async createAnnouncement(data) {
    const announcement = new Announcement(data);
    return await announcement.save();
  }

  async findAnnouncements(filter = {}, options = {}) {
    const { sort = { publishedAt: -1 }, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = Announcement.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const data = await query.exec();
    const total = await Announcement.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAnnouncementById(id) {
    return await Announcement.findById(id).exec();
  }

  async updateAnnouncement(id, data) {
    return await Announcement.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async deleteAnnouncement(id) {
    return await Announcement.findByIdAndDelete(id).exec();
  }
}

module.exports = new AnnouncementRepository();
