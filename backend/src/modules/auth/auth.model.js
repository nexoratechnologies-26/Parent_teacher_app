const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * User Schema
 * Covers all three roles: PARENT, TEACHER, ADMIN
 * Sensitive fields (password, refreshToken, resetToken) are excluded from
 * default queries using `select: false` and must be explicitly requested.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['PARENT', 'TEACHER', 'ADMIN'],
        message: '{VALUE} is not a valid role. Must be PARENT, TEACHER, or ADMIN',
      },
      required: [true, 'User role is required'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()\u0020]{7,20}$/, 'Please provide a valid phone number'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Refresh token stored for rotation validation
    refreshToken: {
      type: String,
      select: false,
    },
    // Password reset fields
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Strip all sensitive fields from serialized output
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// ─── Pre-save Hook: Hash password when it is new or modified ──────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Instance Methods ─────────────────────────────────────────────────────────

/**
 * Compare a plain-text candidate password against the stored hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if a password reset token has expired.
 * @returns {boolean}
 */
userSchema.methods.isPasswordResetExpired = function () {
  return !this.passwordResetExpires || this.passwordResetExpires < Date.now();
};

module.exports = mongoose.model('User', userSchema);
