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
  Student,
} from './types';
import {
  mockStudents,
  generateMonthlyAttendance,
  mockHomeworkList,
  mockAcademicMarks,
  mockAnnouncements,
  mockTeachers,
  mockChatMessages,
  mockNotifications,
} from './mockData';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Toggle mock fallback for offline/development resilience
const USE_MOCK_FALLBACK = true;

class ParentApiService {
  private inMemoryMessages: Record<string, ChatMessage[]> = { ...mockChatMessages };
  private inMemoryNotifications: NotificationItem[] = [...mockNotifications];

  /**
   * GET /api/v1/parents/students
   * Fetch list of children linked to active parent
   */
  async getLinkedStudents(): Promise<Student[]> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      return mockStudents.map((s) => ({
        id: s.id,
        name: s.name,
        grade: `${s.grade}-${s.section}`,
        section: s.section,
        rollNo: s.rollNo,
        avatar: s.avatar,
        attendancePercentage: s.attendancePercentage,
      }));
    }

    try {
      const res = await fetch(`${API_BASE_URL}/parents/students`);
      if (!res.ok) throw new Error('Failed to fetch linked children');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return mockStudents;
    }
  }

  /**
   * GET /api/v1/students/:studentId
   * Fetch detailed student profile & emergency / parent linkages
   */
  async getStudentProfile(studentId: string): Promise<StudentDetails> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      const found = mockStudents.find((s) => s.id === studentId) || mockStudents[0];
      return found;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}`);
      if (!res.ok) throw new Error('Failed to fetch student profile');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return mockStudents[0];
    }
  }

  /**
   * GET /api/v1/students/:studentId/dashboard-summary
   * Fetch overview stats, pending homework, and recent notices
   */
  async getDashboardSummary(studentId: string): Promise<DashboardSummary> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      const student = mockStudents.find((s) => s.id === studentId) || mockStudents[0];
      return {
        studentId,
        attendanceSummary: {
          percentage: student.attendancePercentage,
          presentDays: 22,
          absentDays: 1,
          totalDays: 23,
        },
        recentHomework: mockHomeworkList.slice(0, 3),
        latestNotices: mockAnnouncements.slice(0, 2),
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/dashboard-summary`);
      if (!res.ok) throw new Error('Failed to fetch dashboard summary');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return {
        studentId,
        attendanceSummary: { percentage: 96, presentDays: 22, absentDays: 1, totalDays: 23 },
        recentHomework: mockHomeworkList,
        latestNotices: mockAnnouncements,
      };
    }
  }

  /**
   * GET /api/v1/students/:studentId/attendance?month=MM&year=YYYY
   * Historical view of attendance with calendar breakdown
   */
  async getAttendance(
    studentId: string,
    month: number,
    year: number
  ): Promise<MonthlyAttendanceResponse> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      return generateMonthlyAttendance(studentId, month, year);
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/students/${studentId}/attendance?month=${month}&year=${year}`
      );
      if (!res.ok) throw new Error('Failed to fetch attendance records');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return generateMonthlyAttendance(studentId, month, year);
    }
  }

  /**
   * GET /api/v1/students/:studentId/homework
   * Complete list of assigned homework and submission status
   */
  async getHomework(
    studentId: string,
    filterStatus?: 'ALL' | 'PENDING' | 'SUBMITTED'
  ): Promise<HomeworkItem[]> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      if (!filterStatus || filterStatus === 'ALL') {
        return mockHomeworkList;
      }
      return mockHomeworkList.filter((item) => item.status === filterStatus);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/homework`);
      if (!res.ok) throw new Error('Failed to fetch homework');
      const data: HomeworkItem[] = await res.json();
      if (!filterStatus || filterStatus === 'ALL') return data;
      return data.filter((item) => item.status === filterStatus);
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return mockHomeworkList;
    }
  }

  /**
   * GET /api/v1/students/:studentId/marks?termId=:termId
   * Subject-wise exam results, term marks, and report generation
   */
  async getAcademicMarks(
    studentId: string,
    termId?: string
  ): Promise<AcademicMarksResponse> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      return mockAcademicMarks;
    }

    try {
      const query = termId ? `?termId=${termId}` : '';
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/marks${query}`);
      if (!res.ok) throw new Error('Failed to fetch marks');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return mockAcademicMarks;
    }
  }

  /**
   * GET /api/v1/announcements
   * Feed of school notices, holiday alerts, and exam schedules
   */
  async getAnnouncements(category?: string): Promise<Announcement[]> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      if (!category || category === 'ALL') return mockAnnouncements;
      return mockAnnouncements.filter((a) => a.category === category);
    }

    try {
      const query = category && category !== 'ALL' ? `?category=${category}` : '';
      const res = await fetch(`${API_BASE_URL}/announcements${query}`);
      if (!res.ok) throw new Error('Failed to fetch announcements');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return mockAnnouncements;
    }
  }

  /**
   * GET /api/v1/communications/teachers
   * Assigned teachers for active student
   */
  async getTeachers(): Promise<TeacherContact[]> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      return mockTeachers;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/communications/teachers`);
      if (!res.ok) throw new Error('Failed to fetch teachers');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return mockTeachers;
    }
  }

  /**
   * GET /api/v1/communications/messages/:teacherId
   * Direct chat history with teacher
   */
  async getMessages(teacherId: string): Promise<ChatMessage[]> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      return this.inMemoryMessages[teacherId] || [];
    }

    try {
      const res = await fetch(`${API_BASE_URL}/communications/messages/${teacherId}`);
      if (!res.ok) throw new Error('Failed to fetch chat messages');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return this.inMemoryMessages[teacherId] || [];
    }
  }

  /**
   * POST /api/v1/communications/messages
   * Send a new message to the teacher
   */
  async sendMessage(teacherId: string, messageText: string): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'par_01',
      senderName: 'Kishore Mohan',
      recipientId: teacherId,
      message: messageText,
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency(300);
      if (!this.inMemoryMessages[teacherId]) {
        this.inMemoryMessages[teacherId] = [];
      }
      this.inMemoryMessages[teacherId].push(newMessage);
      return newMessage;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/communications/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: teacherId, message: messageText }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return newMessage;
    }
  }

  /**
   * GET /api/v1/notifications
   * Central list of push alert logs
   */
  async getNotifications(): Promise<NotificationItem[]> {
    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency();
      return this.inMemoryNotifications;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return this.inMemoryNotifications;
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   * Mark notification as read
   */
  async markNotificationAsRead(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_FALLBACK) {
      this.inMemoryNotifications = this.inMemoryNotifications.map((n) =>
        n.id === id ? { ...n, readStatus: true } : n
      );
      return { success: true };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
      });
      return await res.json();
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return { success: true };
    }
  }

  private simulateLatency(ms: number = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const parentApi = new ParentApiService();
