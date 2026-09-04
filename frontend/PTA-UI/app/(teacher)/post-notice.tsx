import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { ClayInput } from '@/components/ui/ClayInput';
import { ClayButton } from '@/components/ui/ClayButton';
import { Badge } from '@/components/ui/Badge';
import { BottomLandscape } from '@/components/ui/BottomLandscape';
import { AnnouncementCategory } from '@/services/types';

const GRADE_OPTIONS = ['All Classes', 'Grade 1-A', 'Grade 2-A', 'Grade 3-A', 'Grade 4-B', 'Grade 5-A'];

const CATEGORY_OPTIONS: { label: string; value: AnnouncementCategory; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'General', value: 'GENERAL', icon: 'chatbubble-outline' },
  { label: 'Notice', value: 'NOTICE', icon: 'megaphone-outline' },
  { label: 'Exam', value: 'EXAM', icon: 'document-text-outline' },
  { label: 'Holiday', value: 'HOLIDAY', icon: 'sunny-outline' },
  { label: 'Event', value: 'EVENT', icon: 'calendar-outline' },
];

type Priority = 'NORMAL' | 'IMPORTANT';

export default function PostNoticeScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | null>(null);
  const [priority, setPriority] = useState<Priority>('NORMAL');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const nextErrors: { [key: string]: string } = {};
    if (!title.trim()) nextErrors.title = 'Notice title is required';
    else if (title.trim().length < 3) nextErrors.title = 'Title is too short';
    if (!message.trim()) nextErrors.message = 'Add a message for the notice';
    else if (message.trim().length < 10) nextErrors.message = 'Please add a bit more detail';
    if (!selectedGrade) nextErrors.grade = 'Please select a target class';
    if (!selectedCategory) nextErrors.category = 'Please select a notice category';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setSelectedGrade(null);
    setSelectedCategory(null);
    setPriority('NORMAL');
    setAttachmentName(null);
    setErrors({});
  };

  const handlePublish = () => {
    if (!validate()) return;

    setSubmitting(true);
    // Simulated publish — frontend only, no backend integration.
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccess(true);
    }, 700);
  };

  const handleAttach = () => {
    if (attachmentName) {
      setAttachmentName(null);
      return;
    }
    setAttachmentName('sports_day_flyer.pdf');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerIconMascot}>
                <Ionicons name="megaphone" size={22} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Post Notice</Text>
                <Text style={styles.headerSubtitle}>
                  Share an announcement with your classroom
                </Text>
              </View>
            </View>

            {/* Notice Title */}
            <ClayInput
              label="Notice Title"
              placeholder="e.g. Annual Sports Day 2026"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (errors.title) setErrors((e) => ({ ...e, title: '' }));
              }}
              error={errors.title}
              leftIcon={<Ionicons name="pencil-outline" size={20} color="#94A3B8" />}
            />

            {/* Description / Message */}
            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Description / Message</Text>
              <View
                style={[
                  styles.textAreaContainer,
                  Shadows.soft,
                  errors.message ? styles.errorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textArea}
                  placeholder="Write the notice details students and parents should know."
                  placeholderTextColor="#94A3B8"
                  value={message}
                  onChangeText={(t) => {
                    setMessage(t);
                    if (errors.message) setErrors((e) => ({ ...e, message: '' }));
                  }}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              {errors.message ? <Text style={styles.errorText}>{errors.message}</Text> : null}
            </View>

            {/* Target Class */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Target Class</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {GRADE_OPTIONS.map((grade) => {
                  const active = selectedGrade === grade;
                  return (
                    <TouchableOpacity
                      key={grade}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedGrade(grade);
                        if (errors.grade) setErrors((e) => ({ ...e, grade: '' }));
                      }}
                      style={[styles.chip, active && styles.chipActiveGreen]}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActiveGreen]}>
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {errors.grade ? <Text style={styles.errorText}>{errors.grade}</Text> : null}
            </View>

            {/* Notice Category */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Notice Category</Text>
              <View style={styles.subjectGrid}>
                {CATEGORY_OPTIONS.map((cat) => {
                  const active = selectedCategory === cat.value;
                  return (
                    <TouchableOpacity
                      key={cat.value}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedCategory(cat.value);
                        if (errors.category) setErrors((e) => ({ ...e, category: '' }));
                      }}
                      style={[styles.subjectChip, active && styles.subjectChipActive]}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={16}
                        color={active ? '#FFFFFF' : '#10B981'}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.subjectChipText, active && styles.subjectChipTextActive]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
            </View>

            {/* Priority */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Priority</Text>
              <View style={styles.priorityRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setPriority('NORMAL')}
                  style={[
                    styles.priorityCard,
                    priority === 'NORMAL' && styles.priorityCardActiveNormal,
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={priority === 'NORMAL' ? '#0284C7' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.priorityText,
                      priority === 'NORMAL' && styles.priorityTextActiveNormal,
                    ]}
                  >
                    Normal
                  </Text>
                  <Text style={styles.prioritySubtext}>Standard notice</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setPriority('IMPORTANT')}
                  style={[
                    styles.priorityCard,
                    priority === 'IMPORTANT' && styles.priorityCardActiveImportant,
                  ]}
                >
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color={priority === 'IMPORTANT' ? '#DC2626' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.priorityText,
                      priority === 'IMPORTANT' && styles.priorityTextActiveImportant,
                    ]}
                  >
                    Important
                  </Text>
                  <Text style={styles.prioritySubtext}>Needs attention</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Attachment */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Attachment (optional)</Text>
              {attachmentName ? (
                <View style={[styles.attachmentCard, Shadows.soft]}>
                  <View style={styles.attachmentIconBg}>
                    <Ionicons name="document-text" size={20} color="#10B981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {attachmentName}
                    </Text>
                    <Text style={styles.attachmentMeta}>Ready to attach</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} onPress={handleAttach}>
                    <Ionicons name="close-circle" size={22} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleAttach}
                  style={styles.attachmentUpload}
                >
                  <View style={styles.attachmentUploadIconBg}>
                    <Ionicons name="cloud-upload-outline" size={22} color="#10B981" />
                  </View>
                  <Text style={styles.attachmentUploadText}>Tap to add a file</Text>
                  <Text style={styles.attachmentUploadSubtext}>
                    Flyers, PDFs, or images for this notice
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Publish Button */}
            <ClayButton
              title={submitting ? 'Publishing...' : 'Publish Notice'}
              onPress={handlePublish}
              disabled={submitting}
              variant="success"
              leftIcon={
                !submitting ? (
                  <Ionicons name="megaphone" size={18} color="#FFFFFF" />
                ) : undefined
              }
              style={{ marginTop: 8 }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <BottomLandscape />

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.successCard, Shadows.cardElevated]}>
            <View style={styles.successIconRing}>
              <Ionicons name="checkmark-circle" size={56} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Notice Published!</Text>
            <Text style={styles.successSubtitle}>
              Your {priority === 'IMPORTANT' ? 'important ' : ''}notice has been sent to{' '}
              {selectedGrade}.
            </Text>
            {priority === 'IMPORTANT' && (
              <Badge
                label="Important"
                variant="error"
                icon={<Ionicons name="alert-circle" size={13} color="#B91C1C" />}
                style={{ marginBottom: 18 }}
              />
            )}
            <View style={styles.successActionsRow}>
              <ClayButton
                title="Post Another"
                variant="secondary"
                onPress={() => {
                  setShowSuccess(false);
                  resetForm();
                }}
                style={{ flex: 1, marginRight: 8 }}
              />
              <ClayButton
                title="Done"
                variant="success"
                onPress={() => {
                  setShowSuccess(false);
                  resetForm();
                  router.push('/(teacher)/dashboard' as any);
                }}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 6,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  headerIconMascot: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
    marginLeft: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    marginLeft: 4,
  },
  chipRow: {
    paddingRight: 4,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  chipActiveGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActiveGreen: {
    color: '#15803D',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  subjectChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  subjectChipTextActive: {
    color: '#FFFFFF',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 120,
  },
  textArea: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
    minHeight: 96,
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  priorityRow: {
    flexDirection: 'row',
  },
  priorityCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  priorityCardActiveNormal: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  priorityCardActiveImportant: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    marginRight: 0,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginTop: 8,
  },
  priorityTextActiveNormal: {
    color: '#0284C7',
  },
  priorityTextActiveImportant: {
    color: '#DC2626',
  },
  prioritySubtext: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  attachmentUpload: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderStyle: 'dashed',
    paddingVertical: 24,
  },
  attachmentUploadIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentUploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  attachmentUploadSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    padding: 14,
  },
  attachmentIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  attachmentMeta: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  successIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#BBF7D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  successActionsRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
