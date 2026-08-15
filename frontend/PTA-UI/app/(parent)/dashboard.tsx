import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { BottomLandscape } from '@/components/ui/BottomLandscape';
import { parentApi } from '@/services/parentApi';
import { Student, DashboardSummary, HomeworkItem, Announcement } from '@/services/types';

const { width } = Dimensions.get('window');

export default function ParentDashboardScreen() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showChildPicker, setShowChildPicker] = useState(false);

  const loadData = useCallback(async (selectedStudentId?: string) => {
    try {
      const studentList = await parentApi.getLinkedStudents();
      setStudents(studentList);

      const current = selectedStudentId
        ? studentList.find((s) => s.id === selectedStudentId) || studentList[0]
        : studentList[0];

      setActiveStudent(current);

      if (current) {
        const summary = await parentApi.getDashboardSummary(current.id);
        setDashboardData(summary);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    if (activeStudent) {
      loadData(activeStudent.id);
    } else {
      loadData();
    }
  };

  const handleSelectChild = (child: Student) => {
    setActiveStudent(child);
    setShowChildPicker(false);
    loadData(child.id);
  };

  if (loading || !activeStudent) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  const attendancePct = dashboardData?.attendanceSummary?.percentage ?? activeStudent.attendancePercentage;
  const recentHomework = dashboardData?.recentHomework || [];
  const latestNotices = dashboardData?.latestNotices || [];

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
              onPress={() => router.push('/(parent)/profile' as any)}
            >
              <Ionicons name="menu" size={24} color="#1E293B" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.headerIconButton, Shadows.soft]}
              onPress={() => router.push('/(parent)/notifications' as any)}
            >
              <Ionicons name="notifications" size={22} color="#1E293B" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <View style={styles.greetingTitleRow}>
              <Text style={styles.greetingLight}>Good Morning,</Text>
            </View>
            <View style={styles.greetingNameRow}>
              <Text style={styles.greetingRole}>Parent!</Text>
              <Text style={styles.greetingHeart}> 💛</Text>
            </View>
            <Text style={styles.greetingSubtitle}>
              Here's what's happening with {activeStudent.name.split(' ')[0]} today.
            </Text>
          </View>

          {/* Main Active Child Clay Card */}
          <View style={[styles.childCard, Shadows.cardElevated]}>
            {/* Top right decorative star */}
            <View style={styles.cardDecorStar}>
              <Ionicons name="star" size={18} color="#F59E0B" />
            </View>

            {/* Left: Avatar with green arcs */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarRingOuter}>
                <Image
                  source={activeStudent.avatar}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Middle: Name & Grade pill */}
            <View style={styles.childInfo}>
              <Text style={styles.viewingTag}>Currently Viewing</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.gradePill}
                onPress={() => setShowChildPicker(true)}
              >
                <Text style={styles.gradePillText}>
                  {activeStudent.name} - {activeStudent.grade}
                </Text>
                <Ionicons name="swap-horizontal" size={14} color="#059669" style={{ marginLeft: 4 }} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.switchChildButton}
                onPress={() => setShowChildPicker(true)}
              >
                <Ionicons name="people" size={14} color="#065F46" />
                <Text style={styles.switchChildText}>Switch Child</Text>
              </TouchableOpacity>
            </View>

            {/* Right: Attendance circular progress gauge */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(parent)/attendance' as any)}
              style={styles.attendanceGauge}
            >
              <View style={styles.gaugeCircle}>
                <Text style={styles.gaugePercent}>{attendancePct}%</Text>
                <Text style={styles.gaugeLabel}>Attendance</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Section: Homework Due Soon */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={styles.sectionIconMascot}>
                <Ionicons name="book" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Homework Due Soon</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(parent)/homework' as any)}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color="#0284C7" />
            </TouchableOpacity>
          </View>

          {/* Dynamic Homework List */}
          {recentHomework.map((hw) => {
            const isMath = hw.subject.toLowerCase().includes('math');
            const iconSource = isMath
              ? require('@/assets/images/icon_math.png')
              : require('@/assets/images/icon_english.png');
            const isSubmitted = hw.status === 'SUBMITTED';

            return (
              <TouchableOpacity
                key={hw.id}
                activeOpacity={0.85}
                onPress={() => router.push('/(parent)/homework' as any)}
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
                  {isSubmitted ? (
                    <View style={[styles.statusPill, styles.submittedPill]}>
                      <Ionicons name="checkmark-circle" size={12} color="#15803D" style={{ marginRight: 3 }} />
                      <Text style={styles.submittedText}>Submitted</Text>
                    </View>
                  ) : (
                    <View style={[styles.statusPill, styles.dueSoonPill]}>
                      <Text style={styles.dueSoonText}>Due Soon</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" style={styles.chevron} />
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Section: Recent Announcements */}
          <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconMascot, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
                <Ionicons name="megaphone" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.sectionTitle}>Recent Announcements</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(parent)/notices' as any)}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color="#0284C7" />
            </TouchableOpacity>
          </View>

          {/* Dynamic Announcement Clay Card */}
          {latestNotices.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(parent)/notices' as any)}
              style={[styles.announcementCard, Shadows.soft]}
            >
              <View style={styles.announcementTop}>
                <Image
                  source={require('@/assets/images/icon_calendar.png')}
                  style={styles.announcementIcon}
                  resizeMode="contain"
                />
                <View style={styles.announcementHeaderContent}>
                  <Text style={styles.announcementTitle}>
                    {latestNotices[0].title}
                  </Text>
                  <Text style={styles.announcementMeta}>
                    {latestNotices[0].publishedAt} • By {latestNotices[0].author}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>
              <Text style={styles.announcementBody} numberOfLines={2}>
                {latestNotices[0].body}
              </Text>

              {/* Carousel Dots */}
              <View style={styles.dotsRow}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </TouchableOpacity>
          )}

          {/* Quick Shortcuts Bar */}
          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.shortcutItem, Shadows.soft]}
              onPress={() => router.push('/(parent)/marks' as any)}
            >
              <View style={[styles.shortcutIconBg, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="ribbon" size={22} color="#3B82F6" />
              </View>
              <Text style={styles.shortcutLabel}>Report Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.shortcutItem, Shadows.soft]}
              onPress={() => router.push('/(parent)/messages' as any)}
            >
              <View style={[styles.shortcutIconBg, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="chatbubbles" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.shortcutLabel}>Chat Teacher</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.shortcutItem, Shadows.soft]}
              onPress={() => router.push('/(parent)/attendance' as any)}
            >
              <View style={[styles.shortcutIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="calendar" size={22} color="#10B981" />
              </View>
              <Text style={styles.shortcutLabel}>Attendance</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Switch Child Modal */}
      <Modal
        visible={showChildPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChildPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowChildPicker(false)}
        >
          <View style={[styles.modalCard, Shadows.cardElevated]}>
            <Text style={styles.modalTitle}>Select Child</Text>
            <Text style={styles.modalSubtitle}>Switch view between enrolled children</Text>

            {students.map((child) => {
              const isSelected = child.id === activeStudent.id;
              return (
                <TouchableOpacity
                  key={child.id}
                  style={[
                    styles.childOption,
                    isSelected && styles.childOptionSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectChild(child)}
                >
                  <Image source={child.avatar} style={styles.modalChildAvatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.modalChildName}>{child.name}</Text>
                    <Text style={styles.modalChildGrade}>
                      {child.grade} • Roll No: {child.rollNo}
                    </Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.closeModalButton}
              activeOpacity={0.8}
              onPress={() => setShowChildPicker(false)}
            >
              <Text style={styles.closeModalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Atmospheric Bottom Graphics */}
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
  childCard: {
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
  childInfo: {
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
  switchChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  switchChildText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 4,
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
    marginRight: 2,
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
  chevron: {
    marginTop: 6,
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
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.xxl,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EFE8DC',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  childOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 10,
  },
  childOptionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  modalChildAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  modalChildName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalChildGrade: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeModalButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginTop: 6,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
