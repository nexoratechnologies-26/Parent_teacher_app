// utils/constants.js
// Purpose: fixed values used across the whole app, in one place.
// Instead of typing "TEACHER" as a raw string in 10 different files
// (and risking typos like "Teacher" vs "TEACHER"), everyone imports these.

const ROLES = {
  TEACHER: 'TEACHER',
  PARENT: 'PARENT',
  ADMIN: 'ADMIN',
};

const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HOLIDAY: 'HOLIDAY',
};

const ANNOUNCEMENT_CATEGORY = {
  GENERAL: 'GENERAL',
  EXAM: 'EXAM',
  HOLIDAY: 'HOLIDAY',
  EVENT: 'EVENT',
};

const NOTIFICATION_TYPE = {
  ATTENDANCE: 'ATTENDANCE',
  HOMEWORK: 'HOMEWORK',
  MARKS: 'MARKS',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

module.exports = {
  ROLES,
  ATTENDANCE_STATUS,
  ANNOUNCEMENT_CATEGORY,
  NOTIFICATION_TYPE,
  HTTP_STATUS,
};
