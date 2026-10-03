import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
import { supabase, isSupabaseConfigured } from './supabase';

// Base API configuration — automatically detects deployed origin on web or uses EXPO_PUBLIC_API_URL
const getBaseApiUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return process.env.EXPO_PUBLIC_API_URL || '/api/v1';
};

const API_BASE_URL = getBaseApiUrl();

// Toggle mock fallback for offline/development resilience
const USE_MOCK_FALLBACK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

class ParentApiService {
  private inMemoryMessages: Record<string, ChatMessage[]> = { ...mockChatMessages };
  private inMemoryNotifications: NotificationItem[] = [...mockNotifications];
  private inMemoryAnnouncements: Announcement[] = [...mockAnnouncements];
  private inMemoryHomework: HomeworkItem[] = [...mockHomeworkList];

  private async getAuthHeaders(): Promise<Record<string, string>> {
    let token: string | null = null;

    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token || null;
      } catch {}
    }

    if (!token) {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          token = window.localStorage.getItem('accessToken');
        }
      } else {
        try {
          token = await SecureStore.getItemAsync('accessToken');
        } catch {}
      }
    }

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

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
      const res = await fetch(`${API_BASE_URL}/parents/students`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch linked children');
      const json = await res.json();
      return json.data || json;
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
      const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch student profile');
      const json = await res.json();
      return json.data || json;
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
        recentHomework: this.inMemoryHomework.slice(0, 3),
        latestNotices: this.inMemoryAnnouncements.slice(0, 2),
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/dashboard-summary`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard summary');
      const json = await res.json();
      return json.data || json;
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return {
        studentId,
        attendanceSummary: { percentage: 96, presentDays: 22, absentDays: 1, totalDays: 23 },
        recentHomework: this.inMemoryHomework,
        latestNotices: this.inMemoryAnnouncements,
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
        `${API_BASE_URL}/students/${studentId}/attendance?month=${month}&year=${year}`,
        { headers: await this.getAuthHeaders() }
      );
      if (!res.ok) throw new Error('Failed to fetch attendance records');
      const json = await res.json();
      return json.data || json;
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
        return this.inMemoryHomework;
      }
      return this.inMemoryHomework.filter((item) => item.status === filterStatus);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/homework`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch homework');
      const json = await res.json();
      const data: HomeworkItem[] = json.data || json;
      if (!filterStatus || filterStatus === 'ALL') return data;
      return data.filter((item) => item.status === filterStatus);
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return this.inMemoryHomework;
    }
  }

  /**
   * POST /api/v1/homework
   * Teacher creates new homework assignment
   */
  async createHomework(data: Partial<HomeworkItem>): Promise<HomeworkItem> {
    const newItem: HomeworkItem = {
      id: `hw_${Date.now()}`,
      subject: data.subject || 'General',
      subjectCategory: (data.subjectCategory as any) || 'MATH',
      title: data.title || 'Assignment',
      description: data.description || '',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      dueLabel: data.dueLabel || 'Due Soon',
      status: 'PENDING',
      teacherName: data.teacherName || 'Teacher',
    };

    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency(300);
      this.inMemoryHomework.unshift(newItem);
      return newItem;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/homework`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return json.data || json;
    } catch (err) {
      this.inMemoryHomework.unshift(newItem);
      return newItem;
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
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/marks${query}`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch marks');
      const json = await res.json();
      return json.data || json;
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
      if (!category || category === 'ALL') return this.inMemoryAnnouncements;
      return this.inMemoryAnnouncements.filter((a) => a.category === category);
    }

    try {
      const query = category && category !== 'ALL' ? `?category=${category}` : '';
      const res = await fetch(`${API_BASE_URL}/announcements${query}`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const json = await res.json();
      const list = json.data || json;
      return Array.isArray(list) ? list : this.inMemoryAnnouncements;
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      return this.inMemoryAnnouncements;
    }
  }

  /**
   * POST /api/v1/announcements
   * Create new school notice
   */
  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const newNotice: Announcement = {
      id: `anc_${Date.now()}`,
      title: data.title || 'Notice',
      body: data.body || '',
      category: (data.category as any) || 'GENERAL',
      publishedAt: new Date().toISOString().split('T')[0],
      author: data.author || 'Teacher',
      isFeatured: data.isFeatured || false,
      eventDate: data.eventDate,
    };

    if (USE_MOCK_FALLBACK) {
      await this.simulateLatency(300);
      this.inMemoryAnnouncements.unshift(newNotice);
      return newNotice;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      const created = json.data || json;
      this.inMemoryAnnouncements.unshift(created);
      return created;
    } catch (err) {
      this.inMemoryAnnouncements.unshift(newNotice);
      return newNotice;
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
      const res = await fetch(`${API_BASE_URL}/communications/teachers`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch teachers');
      const json = await res.json();
      return json.data || json;
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
      const res = await fetch(`${API_BASE_URL}/communications/messages/${teacherId}`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch chat messages');
      const json = await res.json();
      return json.data || json;
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
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ recipientId: teacherId, message: messageText }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      const json = await res.json();
      const saved = json.data || json;
      if (!this.inMemoryMessages[teacherId]) this.inMemoryMessages[teacherId] = [];
      this.inMemoryMessages[teacherId].push(saved);
      return saved;
    } catch (err) {
      console.warn('API Error, using fallback:', err);
      if (!this.inMemoryMessages[teacherId]) this.inMemoryMessages[teacherId] = [];
      this.inMemoryMessages[teacherId].push(newMessage);
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
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: await this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const json = await res.json();
      return json.data || json;
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
        headers: await this.getAuthHeaders(),
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
