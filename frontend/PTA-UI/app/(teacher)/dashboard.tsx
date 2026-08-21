import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { BottomLandscape } from '@/components/ui/BottomLandscape';
import { mockTeachers, mockHomeworkList, mockAnnouncements } from '@/services/mockData';
import { TeacherContact, HomeworkItem, Announcement } from '@/services/types';

const { width } = Dimensions.get('window');

export default function TeacherDashboardScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherContact | null>(null);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [notices, setNotices] = useState<Announcement[]>([]);

  // Realistic mock homework statistics for the teacher's classroom dashboard
  const homeworkStats: Record<string, string> = {
    hw_01: '24/28 Submitted',
    hw_02: '28/28 Graded',
    hw_03: '15/28 Pending Review',
  };

  const loadDashboardData = () => {
    try {
      // Load current teacher profile (default to Ms. Sarah - tch_01)
      const teacher = mockTeachers.find((t) => t.id === 'tch_01') || mockTeachers[0];
      setCurrentTeacher(teacher);

      // Load homework assigned by this teacher or related to Grade 4
      const filteredHomework = mockHomeworkList.filter(
        (hw) => hw.teacherName === teacher.name || hw.subjectCategory === 'MATH'
      );
      setHomework(filteredHomework);

      // Load school/class notices
      setNotices(mockAnnouncements);
    } catch (error) {
      console.error('Error loading teacher dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          router.replace('/');
        },
      },
    ]);
  };

  if (loading || !currentTeacher) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />
          }
        >
          {/* Header Bar */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.headerIconButton, Shadows.soft]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#1E293B" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.headerIconButton, Shadows.soft]}
              onPress={() => router.push('/(teacher)/messages' as any)}
            >
              <Ionicons name="chatbubbles" size={22} color="#1E293B" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <View style={styles.greetingTitleRow}>
              <Text style={styles.greetingLight}>Good Morning,</Text>
            </View>
            <View style={styles.greetingNameRow}>
              <Text style={styles.greetingRole}>{currentTeacher.name}!</Text>
              <Text style={styles.greetingHeart}> 🏫</Text>
            </View>
            <Text style={styles.greetingSubtitle}>
              Here is what is happening with your classroom today.
            </Text>
          </View>

          {/* Teacher Class Info Clay Card */}
          <View style={[styles.classCard, Shadows.cardElevated]}>
            <View style={styles.cardDecorStar}>
              <Ionicons name="star" size={18} color="#F59E0B" />
            </View>

            {/* Left: Avatar with green outer ring */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarRingOuter}>
                <Image
                  source={currentTeacher.avatar}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Middle: Details */}
            <View style={styles.classInfo}>
              <Text style={styles.viewingTag}>Assigned Classroom</Text>
              <View style={styles.gradePill}>
                <Text style={styles.gradePillText}>
                  {currentTeacher.grade}
                </Text>
              </View>
              <Text style={styles.teacherSubjectText}>{currentTeacher.subject}</Text>
              <Text style={styles.studentCountText}>28 Students Enrolled</Text>
            </View>

            {/* Right: Daily Class Attendance Gauge */}
            <View style={styles.attendanceGauge}>
              <View style={styles.gaugeCircle}>
                <Text style={styles.gaugePercent}>96%</Text>
                <Text style={styles.gaugeLabel}>Attendance</Text>
              </View>
            </View>
          </View>

          {/* Quick Shortcuts Bar */}
          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.shortcutItem, Shadows.soft]}
              onPress={() => router.push('/(teacher)/student-management' as any)}
            >
              <View style={[styles.shortcutIconBg, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="people" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.shortcutLabel}>Students</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.shortcutItem, Shadows.soft]}
              onPress={() => router.push('/(teacher)/mark-attendance' as any)}
            >
              <View style={[styles.shortcutIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="calendar" size={22} color="#10B981" />
              </View>
              <Text style={styles.shortcutLabel}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.shortcutItem, Shadows.soft]}
              onPress={() => router.push('/(teacher)/upload-marks' as any)}
            >
              <View style={[styles.shortcutIconBg, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="ribbon" size={22} color="#3B82F6" />
              </View>
              <Text style={styles.shortcutLabel}>Add Marks</Text>
            </TouchableOpacity>
          </View>

          {/* Section: Homework Overview */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={styles.sectionIconMascot}>
                <Ionicons name="book" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Active Homework</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(teacher)/post-homework' as any)}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>Post New</Text>
              <Ionicons name="add-circle" size={16} color="#0284C7" />
            </TouchableOpacity>
          </View>

          {/* Dynamic Homework List */}
          {homework.slice(0, 3).map((hw) => {
            const isMath = hw.subject.toLowerCase().includes('math');
            const iconSource = isMath
              ? require('@/assets/images/icon_math.png')
              : require('@/assets/images/icon_english.png');
            const statsText = homeworkStats[hw.id] || '0/28 Submitted';

            return (
              <View
                key={hw.id}
                style={[styles.homeworkCard, Shadows.soft]}
              >
                <Image source={iconSource} style={styles.homeworkIcon} resizeMode="contain" />
                <View style={styles.homeworkDetails}>
                  <Text style={styles.homeworkTitle}>{hw.title}</Text>
                  <Text style={styles.homeworkSubtitle}>{hw.subject} • {hw.description}</Text>
                  <View style={styles.dueDateRow}>
                    <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
                    <Text style={styles.dueDateText}>Due: {hw.dueDate}</Text>
                  </View>
                </View>
                <View style={styles.homeworkRight}>
                  <View style={[styles.statusPill, hw.status === 'GRADED' ? styles.submittedPill : styles.dueSoonPill]}>
                    <Text style={hw.status === 'GRADED' ? styles.submittedText : styles.dueSoonText}>
                      {statsText}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Section: Recent Announcements */}
          <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconMascot, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
                <Ionicons name="megaphone" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Class Notices</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(teacher)/post-notice' as any)}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>Post Notice</Text>
              <Ionicons name="add-circle" size={16} color="#0284C7" />
            </TouchableOpacity>
          </View>

          {/* Announcement Card */}
          {notices.length > 0 && (
            <View style={[styles.announcementCard, Shadows.soft]}>
              <View style={styles.announcementTop}>
                <Image
                  source={require('@/assets/images/icon_calendar.png')}
                  style={styles.announcementIcon}
                  resizeMode="contain"
                />
                <View style={styles.announcementHeaderContent}>
                  <Text style={styles.announcementTitle}>
                    {notices[0].title}
                  </Text>
                  <Text style={styles.announcementMeta}>
                    {notices[0].publishedAt} • By {notices[0].author}
                  </Text>
                </View>
              </View>
              <Text style={styles.announcementBody}>
                {notices[0].body}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Scenery graphic at the bottom */}
      <BottomLandscape />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 95,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  greetingContainer: {
    marginBottom: 16,
  },
  greetingTitleRow: {
    flexDirection: 'row',
  },
  greetingLight: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  greetingNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingRole: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  greetingHeart: {
    fontSize: 24,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 22,
  },
  cardDecorStar: {
    position: 'absolute',
    top: 10,
    right: 14,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  avatarRingOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DCFCE7',
    borderWidth: 2.5,
    borderColor: '#86EFAC',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  classInfo: {
    flex: 1,
  },
  viewingTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 3,
  },
  gradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  gradePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  teacherSubjectText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  studentCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  attendanceGauge: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  gaugeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F0FDF4',
    borderWidth: 5,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  gaugePercent: {
    fontSize: 16,
    fontWeight: '900',
    color: '#15803D',
  },
  gaugeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#166534',
    marginTop: -1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconMascot: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    marginRight: 4,
  },
  homeworkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  homeworkIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    marginRight: 12,
  },
  homeworkDetails: {
    flex: 1,
  },
  homeworkTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  homeworkSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '600',
  },
  homeworkRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  dueSoonPill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  dueSoonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  submittedPill: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  submittedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  announcementCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius.xxl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  announcementTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  announcementHeaderContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  announcementMeta: {
    fontSize: 11,
    color: '#60A5FA',
    marginTop: 2,
    fontWeight: '600',
  },
  announcementBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '500',
    marginBottom: 10,
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 22,
  },
  shortcutItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
  },
  shortcutIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
});
