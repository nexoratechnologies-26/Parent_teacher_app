const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    body: {
      type: String,
      required: [true, 'Announcement body is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ['GENERAL', 'EXAM', 'HOLIDAY', 'EVENT'],
        message: '{VALUE} is not a valid announcement category',
      },
      default: 'GENERAL',
    },
    targetAudience: {
      type: [String],
      enum: {
        values: ['ALL', 'PARENTS', 'TEACHERS', 'ADMINS'],
        message: '{VALUE} is not a valid target audience',
      },
      default: ['ALL'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    eventDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
