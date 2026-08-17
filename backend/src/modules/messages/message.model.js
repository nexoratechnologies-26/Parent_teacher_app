const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender reference is required'],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver reference is required'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Linked student reference is required'],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    attachmentUrl: {
      type: String,
      trim: true,
    },
    readStatus: {
      type: String,
      enum: ['SENT', 'DELIVERED', 'READ'],
      default: 'SENT',
    },
    conversationId: {
      type: String,
      index: true,
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

// Pre-save hook to generate deterministic conversationId
messageSchema.pre('save', function (next) {
  if (!this.conversationId) {
    const ids = [this.senderId.toString(), this.receiverId.toString()].sort();
    this.conversationId = ids.join('_');
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
