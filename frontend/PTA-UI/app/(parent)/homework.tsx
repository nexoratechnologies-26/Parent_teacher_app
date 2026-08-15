import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { BottomLandscape } from '@/components/ui/BottomLandscape';
import { ClayButton } from '@/components/ui/ClayButton';
import { parentApi } from '@/services/parentApi';
import { HomeworkItem } from '@/services/types';

type FilterTab = 'ALL' | 'PENDING' | 'SUBMITTED';

export default function ParentHomeworkScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ studentId?: string }>();

  const studentId = params.studentId || 'stu_01';

  const [activeTab, setActiveTab] = useState<FilterTab>('PENDING');
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['hw_01']));
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchHomework = useCallback(async () => {
    try {
      const data = await parentApi.getHomework(studentId, activeTab);
      setHomeworkList(data);
    } catch (err) {
      console.error('Error loading homework:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId, activeTab]);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomework();
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleOpenDetails = (item: HomeworkItem) => {
    setSelectedHomework(item);
  };

  const handleSubmitHomework = (item: HomeworkItem) => {
    setSubmittingId(item.id);
    setTimeout(() => {
      setSubmittingId(null);
      // Mark as submitted locally in state
      setHomeworkList((prev) =>
        prev.map((hw) =>
          hw.id === item.id
            ? { ...hw, status: 'SUBMITTED', dueLabel: 'Submitted just now' }
            : hw
        )
      );
      if (selectedHomework?.id === item.id) {
        setSelectedHomework((prev) =>
          prev ? { ...prev, status: 'SUBMITTED', dueLabel: 'Submitted just now' } : null
        );
      }
      Alert.alert(
        'Homework Submitted! 🎉',
        `Your submission for "${item.title}" has been sent to ${item.teacherName}.`
      );
    }, 800);
  };

  const handleDownloadAttachment = (attachmentName?: string) => {
    if (!attachmentName) return;
    Alert.alert(
      'Attachment Downloaded 📎',
      `"${attachmentName}" has been downloaded. You can now view or print the worksheet.`,
      [
        {
          text: 'Share / Open',
          onPress: () => {
            Share.share({ message: `SchoolSync Homework Document: ${attachmentName}` });
          },
        },
        { text: 'Done', style: 'cancel' },
      ]
    );
  };

  const getSubjectIcon = (category: string) => {
    switch (category) {
      case 'MATH':
        return require('@/assets/images/icon_math_blue.png');
      case 'SCIENCE':
        return require('@/assets/images/icon_science.png');
      case 'ENGLISH':
      default:
        return require('@/assets/images/icon_english_yellow.png');
    }
  };

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
          {/* Top Bar */}
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={[styles.navButton, Shadows.soft]}
            >
              <Ionicons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>

            <View style={styles.navTitleRow}>
              <Text style={styles.navTitle}>Homework</Text>
              <View style={styles.miniBookBadge}>
                <Image
                  source={require('@/assets/images/book_mascot.png')}
                  style={styles.miniBookImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                Alert.alert('Filter Homework', 'Choose a subject filter', [
                  { text: 'All Subjects', onPress: () => setActiveTab('ALL') },
                  { text: 'Mathematics', onPress: () => {} },
                  { text: 'Science', onPress: () => {} },
                  { text: 'English', onPress: () => {} },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
              activeOpacity={0.7}
              style={[styles.navButton, Shadows.soft]}
            >
              <Ionicons name="filter-outline" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Segmented Filter Pills */}
          <View style={[styles.tabBarContainer, Shadows.soft]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('ALL')}
              style={[styles.tabButton, activeTab === 'ALL' && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, activeTab === 'ALL' && styles.tabTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('PENDING')}
              style={[styles.tabButton, activeTab === 'PENDING' && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, activeTab === 'PENDING' && styles.tabTextActive]}>
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('SUBMITTED')}
              style={[styles.tabButton, activeTab === 'SUBMITTED' && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, activeTab === 'SUBMITTED' && styles.tabTextActive]}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && !refreshing && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text style={styles.loadingText}>Fetching Homework...</Text>
            </View>
          )}

          {/* Empty State */}
          {!loading && homeworkList.length === 0 && (
            <View style={styles.emptyState}>
              <Image
                source={require('@/assets/images/book_mascot.png')}
                style={styles.emptyMascot}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>All Caught Up! 🌟</Text>
              <Text style={styles.emptySubtitle}>
                No homework found under the {activeTab.toLowerCase()} category.
              </Text>
            </View>
          )}

          {/* Homework Cards List */}
          {!loading &&
            homeworkList.map((item) => {
              const isSubmitted = item.status === 'SUBMITTED';
              const isBookmarked = bookmarkedIds.has(item.id);

              return (
                <View key={item.id} style={[styles.cardWrapper, Shadows.soft]}>
                  {/* Card Header with Icon, Subject Pill, and Status */}
                  <View style={styles.cardHeader}>
                    <Image
                      source={getSubjectIcon(item.subjectCategory)}
                      style={styles.subject3dIcon}
                      resizeMode="contain"
                    />

                    <View style={styles.headerInfo}>
                      <View style={styles.pillRow}>
                        <View style={styles.subjectPill}>
                          <Text style={styles.subjectPillText}>{item.subject}</Text>
                        </View>

                        {isSubmitted ? (
                          <View style={[styles.statusPill, styles.submittedPill]}>
                            <Ionicons
                              name="checkmark-circle"
                              size={12}
                              color="#15803D"
                              style={{ marginRight: 3 }}
                            />
                            <Text style={styles.submittedPillText}>Submitted</Text>
                          </View>
                        ) : (
                          <View style={[styles.statusPill, styles.pendingPill]}>
                            <Ionicons
                              name="time-outline"
                              size={12}
                              color="#B45309"
                              style={{ marginRight: 3 }}
                            />
                            <Text style={styles.pendingPillText}>Pending</Text>
                          </View>
                        )}
                      </View>

                      {/* Title */}
                      <Text style={styles.cardTitle}>{item.title}</Text>

                      {/* Due date row */}
                      <View style={styles.dueRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={13}
                          color={isSubmitted ? '#15803D' : '#D97706'}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={[
                            styles.dueText,
                            isSubmitted && { color: '#15803D' },
                          ]}
                        >
                          {item.dueLabel || `Due: ${item.dueDate}`}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description}
                  </Text>

                  {/* Card Actions Footer */}
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.viewDetailsButton}
                      onPress={() => handleOpenDetails(item)}
                    >
                      <Ionicons name="document-text-outline" size={16} color="#0284C7" />
                      <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>

                    {/* Attachment info or Bookmark */}
                    {item.attachmentName ? (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.attachmentChip}
                        onPress={() => handleDownloadAttachment(item.attachmentName)}
                      >
                        <Ionicons name="attach" size={14} color="#64748B" />
                        <Text style={styles.attachmentChipText}>1 Attachment</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.bookmarkButton}
                        onPress={() => toggleBookmark(item.id)}
                      >
                        <Ionicons
                          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                          size={20}
                          color={isBookmarked ? '#3B82F6' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </SafeAreaView>

      {/* Homework Details Modal */}
      <Modal
        visible={!!selectedHomework}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedHomework(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedHomework(null)}
        >
          {selectedHomework && (
            <View style={[styles.modalContent, Shadows.cardElevated]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalSubjectRow}>
                  <Image
                    source={getSubjectIcon(selectedHomework.subjectCategory)}
                    style={styles.modalSubjectIcon}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.modalSubject}>{selectedHomework.subject}</Text>
                    <Text style={styles.modalTitle}>{selectedHomework.title}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedHomework(null)}
                  style={styles.closeIconCircle}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Due Date & Teacher info */}
              <View style={styles.modalMetaCard}>
                <View style={styles.modalMetaRow}>
                  <Ionicons name="time" size={16} color="#F59E0B" />
                  <Text style={styles.modalMetaLabel}>Due:</Text>
                  <Text style={styles.modalMetaValue}>
                    {selectedHomework.dueDate} ({selectedHomework.dueLabel})
                  </Text>
                </View>
                <View style={styles.modalMetaRow}>
                  <Ionicons name="person" size={16} color="#3B82F6" />
                  <Text style={styles.modalMetaLabel}>Teacher:</Text>
                  <Text style={styles.modalMetaValue}>{selectedHomework.teacherName}</Text>
                </View>
              </View>

              {/* Full Description */}
              <Text style={styles.modalDescTitle}>Instructions:</Text>
              <Text style={styles.modalDescText}>{selectedHomework.description}</Text>

              {/* Attachment File Box */}
              {selectedHomework.attachmentName && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.modalAttachmentBox}
                  onPress={() => handleDownloadAttachment(selectedHomework.attachmentName)}
                >
                  <View style={styles.modalPdfIcon}>
                    <Ionicons name="document-outline" size={22} color="#EF4444" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.attachmentNameText}>
                      {selectedHomework.attachmentName}
                    </Text>
                    <Text style={styles.attachmentSizeText}>
                      PDF • {selectedHomework.attachmentSize || '1.2 MB'}
                    </Text>
                  </View>
                  <Ionicons name="download-outline" size={20} color="#0284C7" />
                </TouchableOpacity>
              )}

              {/* Modal CTA Buttons */}
              <View style={styles.modalActionsRow}>
                {selectedHomework.status !== 'SUBMITTED' ? (
                  <ClayButton
                    title={submittingId ? 'Submitting...' : 'Mark as Completed / Submit'}
                    onPress={() => handleSubmitHomework(selectedHomework)}
                    variant="primary"
                    disabled={!!submittingId}
                    leftIcon={
                      <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
                    }
                    style={{ flex: 1 }}
                  />
                ) : (
                  <View style={styles.alreadySubmittedBox}>
                    <Ionicons name="checkmark-circle" size={20} color="#15803D" style={{ marginRight: 6 }} />
                    <Text style={styles.alreadySubmittedText}>Submitted & Acknowledged</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Modal>

      {/* Atmospheric Bottom Scene */}
      <BottomLandscape />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 95,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  navButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
  },
  navTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  miniBookBadge: {
    width: 28,
    height: 28,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniBookImage: {
    width: '100%',
    height: '100%',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#F59E0B',
    ...Shadows.primaryButton,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  loadingWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyMascot: {
    width: 100,
    height: 90,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subject3dIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subjectPill: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  subjectPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  pendingPill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  submittedPill: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  submittedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1ECE1',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 5,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  attachmentChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 3,
  },
  bookmarkButton: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: 22,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalSubjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalSubjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginRight: 10,
  },
  modalSubject: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  modalMetaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFE8DC',
    marginBottom: 14,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  modalMetaLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 6,
    marginRight: 6,
  },
  modalMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalDescTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalDescText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 14,
  },
  modalAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  modalPdfIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  attachmentSizeText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  modalActionsRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 10,
  },
  alreadySubmittedBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
  },
  alreadySubmittedText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
});
