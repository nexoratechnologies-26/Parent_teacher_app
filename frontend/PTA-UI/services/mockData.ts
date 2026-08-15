import {
  StudentDetails,
  MonthlyAttendanceResponse,
  HomeworkItem,
  AcademicMarksResponse,
  Announcement,
  TeacherContact,
  ChatMessage,
  NotificationItem,
  DashboardSummary,
} from './types';

export const mockStudents: StudentDetails[] = [
  {
    id: 'stu_01',
    name: 'Leo Martin',
    grade: 'Grade 4',
    section: 'B',
    rollNo: '18',
    avatar: require('@/assets/images/child_avatar_leo.png'),
    attendancePercentage: 96,
    dob: '12 Oct 2016',
    bloodGroup: 'O+',
    admissionNo: 'SCH-2022-0418',
    emergencyContact: '+91 98765 43210',
    classTeacher: 'Ms. Sarah',
    teacherId: 'tch_01',
    parent: {
      id: 'par_01',
      name: 'Kishore Mohan',
      relationship: 'Father',
      phone: '+91 98765 43210',
      email: 'kishore.mohan@gmail.com',
      avatar: require('@/assets/images/parent_kishore.png'),
    },
  },
  {
    id: 'stu_02',
    name: 'Emma Martin',
    grade: 'Grade 2',
    section: 'A',
    rollNo: '09',
    avatar: require('@/assets/images/child_avatar_emma.png'),
    attendancePercentage: 98,
    dob: '05 Mar 2018',
    bloodGroup: 'A+',
    admissionNo: 'SCH-2024-0209',
    emergencyContact: '+91 98765 43210',
    classTeacher: 'Mrs. Priya Sharma',
    teacherId: 'tch_02',
    parent: {
      id: 'par_01',
      name: 'Kishore Mohan',
      relationship: 'Father',
      phone: '+91 98765 43210',
      email: 'kishore.mohan@gmail.com',
      avatar: require('@/assets/images/parent_kishore.png'),
    },
  },
];

export const generateMonthlyAttendance = (
  studentId: string,
  month: number,
  year: number
): MonthlyAttendanceResponse => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthName = monthNames[month - 1] || 'August';
  const daysInMonth = new Date(year, month, 0).getDate();

  const records = [];
  let presentCount = 0;
  let absentCount = 0;
  let holidayCount = 0;

  const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month - 1, d);
    const dayOfWeekIdx = dateObj.getDay();
    const dayName = dayOfWeekNames[dayOfWeekIdx];
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (dayOfWeekIdx === 0 || dayOfWeekIdx === 6) {
      // Weekend
      records.push({
        date: dateStr,
        dayOfWeek: dayName,
        status: 'WEEKEND' as const,
        reason: 'Weekend',
      });
    } else if (d === 15 && month === 8) {
      // Independence Day
      holidayCount++;
      records.push({
        date: dateStr,
        dayOfWeek: dayName,
        status: 'HOLIDAY' as const,
        reason: 'Independence Day',
      });
    } else if (d === 12 && month === 8) {
      // One sample sick leave
      absentCount++;
      records.push({
        date: dateStr,
        dayOfWeek: dayName,
        status: 'ABSENT' as const,
        reason: 'Medical leave approved',
      });
    } else {
      presentCount++;
      records.push({
        date: dateStr,
        dayOfWeek: dayName,
        status: 'PRESENT' as const,
        checkInTime: '8:30 AM',
      });
    }
  }

  const workingDays = presentCount + absentCount;
  const percentage = workingDays > 0 ? Math.round((presentCount / workingDays) * 100) : 100;

  return {
    studentId,
    month,
    year,
    monthName,
    attendancePercentage: percentage,
    totalWorkingDays: workingDays,
    presentDays: presentCount,
    absentDays: absentCount,
    holidayDays: holidayCount,
    monthlyRecords: records,
  };
};

export const mockHomeworkList: HomeworkItem[] = [
  {
    id: 'hw_01',
    subject: 'Mathematics',
    subjectCategory: 'MATH',
    title: 'Algebra Ch. 4',
    description: 'Solve questions 1 to 15 on Page 72 and show all working steps clearly.',
    assignedDate: '2026-08-11',
    dueDate: '2026-08-13',
    dueLabel: 'Due Tomorrow, 5:00 PM',
    status: 'PENDING',
    teacherName: 'Ms. Sarah',
    attachmentName: 'Algebra_Ch4_Worksheet.pdf',
    attachmentSize: '1.4 MB',
  },
  {
    id: 'hw_02',
    subject: 'Science',
    subjectCategory: 'SCIENCE',
    title: 'Solar System Model',
    description: 'Create a 3D model of the solar system using thermocol balls and color them.',
    assignedDate: '2026-08-01',
    dueDate: '2026-08-07',
    dueLabel: 'Submitted on Aug 7, 2026',
    status: 'SUBMITTED',
    teacherName: 'Mr. David Lee',
    attachmentName: 'Project_Guidelines.pdf',
    attachmentSize: '2.1 MB',
  },
  {
    id: 'hw_03',
    subject: 'English',
    subjectCategory: 'ENGLISH',
    title: 'Creative Writing',
    description: 'Write a short story on "A Day in My Future" in 150-200 words.',
    assignedDate: '2026-08-10',
    dueDate: '2026-08-15',
    dueLabel: 'Due Aug 15, 2026 • 5:00 PM',
    status: 'PENDING',
    teacherName: 'Mrs. Priya Sharma',
  },
];

export const mockAcademicMarks: AcademicMarksResponse = {
  studentId: 'stu_01',
  termId: 'midterm_2026',
  termName: 'Midterm Examinations 2026',
  overallPercentage: 92,
  overallGrade: 'A',
  termsList: [
    { id: 'midterm_2026', name: 'Midterm Examinations 2026' },
    { id: 'term_1_2026', name: 'Term 1 Examinations 2026' },
    { id: 'final_2025', name: 'Annual Assessment 2025' },
  ],
  feedbackSummary: "Great job! You're performing consistently above average.",
  marksBreakdown: [
    {
      subject: 'Mathematics',
      category: 'MATH',
      marksObtained: 95,
      maxMarks: 100,
      grade: 'A+',
      teacherComments: 'Excellent problem solving skills and clarity in steps.',
    },
    {
      subject: 'English',
      category: 'ENGLISH',
      marksObtained: 88,
      maxMarks: 100,
      grade: 'A',
      teacherComments: 'Very good vocabulary and creative expression in essays.',
    },
    {
      subject: 'Science',
      category: 'SCIENCE',
      marksObtained: 91,
      maxMarks: 100,
      grade: 'A+',
      teacherComments: 'Outstanding comprehension in biological and physical sciences.',
    },
  ],
};

export const mockAnnouncements: Announcement[] = [
  {
    id: 'anc_01',
    title: 'Upcoming Annual Sports Day 2026',
    body: 'Join us for a day full of fun, sports, team spirit and celebration! Refreshments and certificates will be distributed to all participants.',
    category: 'EVENT',
    publishedAt: '2026-08-10',
    author: 'Principal Office',
    isFeatured: true,
    eventDate: '24 Aug 2026',
    time: '8:30 AM Onwards',
    venue: 'School Main Ground',
  },
  {
    id: 'anc_02',
    title: 'Midterm Exam Schedule Released',
    body: 'The midterm examination schedule for Grades 1–10 has been published. Please check the timetable and ensure regular study habits.',
    category: 'EXAM',
    publishedAt: '2026-08-08',
    author: 'School Admin',
    eventDate: '18 Aug – 26 Aug 2026',
    attachmentName: 'Midterm_Syllabus_4B.pdf',
  },
  {
    id: 'anc_03',
    title: 'Independence Day Holiday Notice',
    body: 'School will remain closed on 15th August 2026 in observance of Independence Day celebrations.',
    category: 'HOLIDAY',
    publishedAt: '2026-08-05',
    author: 'School Admin',
  },
];

export const mockTeachers: TeacherContact[] = [
  {
    id: 'tch_01',
    name: 'Ms. Sarah',
    subject: 'Class Teacher & Mathematics',
    grade: 'Grade 4-B',
    isOnline: true,
    avatar: require('@/assets/images/teacher_sarah.png'),
    email: 'sarah@school.edu',
  },
  {
    id: 'tch_02',
    name: 'Mrs. Priya Sharma',
    subject: 'English Teacher',
    grade: 'Grade 4-B',
    isOnline: false,
    avatar: require('@/assets/images/child_avatar_emma.png'),
    email: 'priya.sharma@school.edu',
  },
];

export const mockChatMessages: Record<string, ChatMessage[]> = {
  tch_01: [
    {
      id: 'msg_01',
      senderId: 'tch_01',
      senderName: 'Ms. Sarah',
      recipientId: 'par_01',
      message: 'Hello Mr. Kishore!\nLeo did great on his math quiz today. 😊',
      timestamp: '2026-08-12T10:30:00Z',
      timeLabel: '10:30 AM',
      isMe: false,
    },
    {
      id: 'msg_02',
      senderId: 'par_01',
      senderName: 'Kishore Mohan',
      recipientId: 'tch_01',
      message: 'Thank you Ms. Sarah!\nWill check his homework tonight. 🙂',
      timestamp: '2026-08-12T10:35:00Z',
      timeLabel: '10:35 AM',
      isMe: true,
    },
  ],
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_01',
    type: 'ATTENDANCE',
    title: 'Attendance Marked',
    message: 'Leo was marked Present today at 8:30 AM',
    timestamp: '2026-08-12T08:30:00Z',
    timeLabel: '8:30 AM',
    dateGroup: 'Today',
    readStatus: false,
    targetScreen: '/(parent)/attendance',
  },
  {
    id: 'notif_02',
    type: 'MARKS',
    title: 'New Marks Uploaded',
    message: 'Midterm Math results are now available',
    timestamp: '2026-08-12T10:15:00Z',
    timeLabel: '10:15 AM',
    dateGroup: 'Today',
    readStatus: false,
    targetScreen: '/(parent)/marks',
  },
  {
    id: 'notif_03',
    type: 'HOMEWORK',
    title: 'New Homework Assigned',
    message: 'Science Project due next week',
    timestamp: '2026-08-11T16:45:00Z',
    timeLabel: 'Yesterday, 4:45 PM',
    dateGroup: 'Yesterday',
    readStatus: true,
    targetScreen: '/(parent)/homework',
  },
];
