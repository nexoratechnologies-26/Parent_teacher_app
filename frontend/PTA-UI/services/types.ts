// API and Shared Data Model Types matching School Mobile Application Data Specifications

export type RoleType = 'PARENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  role: RoleType;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LinkedParent {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  avatar?: any;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNo: string;
  avatar: any;
  avatarUrl?: string;
  attendancePercentage: number;
}

export interface StudentDetails extends Student {
  dob: string;
  bloodGroup: string;
  admissionNo: string;
  emergencyContact: string;
  classTeacher: string;
  teacherId: string;
  parent: LinkedParent;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HOLIDAY' | 'WEEKEND';

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  status: AttendanceStatus;
  checkInTime?: string;
  reason?: string;
}

export interface MonthlyAttendanceResponse {
  studentId: string;
  month: number;
  year: number;
  monthName: string;
  attendancePercentage: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  holidayDays: number;
  monthlyRecords: DailyAttendanceRecord[];
}

export type HomeworkStatus = 'PENDING' | 'SUBMITTED' | 'GRADED';

export interface HomeworkItem {
  id: string;
  subject: string;
  subjectCategory: 'MATH' | 'ENGLISH' | 'SCIENCE' | 'HISTORY' | 'ART';
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  dueLabel?: string;
  status: HomeworkStatus;
  teacherName: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: string;
}

export interface SubjectMarks {
  subject: string;
  category: 'MATH' | 'ENGLISH' | 'SCIENCE' | 'HISTORY' | 'ART';
  marksObtained: number;
  maxMarks: number;
  grade: string;
  teacherComments: string;
}

export interface AcademicMarksResponse {
  studentId: string;
  termId: string;
  termName: string;
  overallPercentage: number;
  overallGrade: string;
  termsList: { id: string; name: string }[];
  marksBreakdown: SubjectMarks[];
  feedbackSummary: string;
}

export type AnnouncementCategory = 'GENERAL' | 'NOTICE' | 'EXAM' | 'HOLIDAY' | 'EVENT';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  publishedAt: string;
  author: string;
  isFeatured?: boolean;
  eventDate?: string;
  time?: string;
  venue?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface TeacherContact {
  id: string;
  name: string;
  subject: string;
  grade: string;
  isOnline: boolean;
  avatar: any;
  avatarUrl?: string;
  email?: string;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  timestamp: string;
  timeLabel: string;
  isMe: boolean;
  attachmentUrl?: string;
}

export type NotificationType = 'ATTENDANCE' | 'HOMEWORK' | 'MARKS' | 'NOTICE';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  timeLabel: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier';
  readStatus: boolean;
  targetScreen?: string;
}

export interface DashboardSummary {
  studentId: string;
  attendanceSummary: {
    percentage: number;
    presentDays: number;
    absentDays: number;
    totalDays: number;
  };
  recentHomework: HomeworkItem[];
  latestNotices: Announcement[];
}
