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
import { BottomLandscape } from '@/components/ui/BottomLandscape';

const GRADE_OPTIONS = ['Grade 1-A', 'Grade 2-A', 'Grade 3-A', 'Grade 4-B', 'Grade 5-A'];

const SUBJECT_OPTIONS: { label: string; category: 'MATH' | 'ENGLISH' | 'SCIENCE' | 'HISTORY' | 'ART' }[] = [
  { label: 'Mathematics', category: 'MATH' },
  { label: 'English', category: 'ENGLISH' },
  { label: 'Science', category: 'SCIENCE' },
  { label: 'History', category: 'HISTORY' },
  { label: 'Art', category: 'ART' },
];

const SUBJECT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  MATH: 'calculator',
  ENGLISH: 'book',
  SCIENCE: 'flask',
  HISTORY: 'globe',
  ART: 'color-palette',
};

function getUpcomingDates(days: number) {
  const options: { iso: string; dayLabel: string; dateLabel: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const today = new Date();
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    options.push({
      iso,
      dayLabel: dayNames[d.getDay()],
      dateLabel: `${monthNames[d.getMonth()]} ${d.getDate()}`,
    });
  }
  return options;
}

export default function PostHomeworkScreen() {
  const router = useRouter();
  const upcomingDates = getUpcomingDates(10);

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const nextErrors: { [key: string]: string } = {};
    if (!selectedGrade) nextErrors.grade = 'Please select a class';
    if (!selectedSubject) nextErrors.subject = 'Please select a subject';
    if (!title.trim()) nextErrors.title = 'Homework title is required';
    else if (title.trim().length < 3) nextErrors.title = 'Title is too short';
    if (!description.trim()) nextErrors.description = 'Add instructions for students';
    else if (description.trim().length < 10) nextErrors.description = 'Please add a bit more detail';
    if (!selectedDate) nextErrors.dueDate = 'Please select a due date';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setSelectedGrade(null);
    setSelectedSubject(null);
    setTitle('');
    setDescription('');
    setSelectedDate(null);
    setAttachmentName(null);
    setErrors({});
  };

  const handlePost = () => {
    if (!validate()) return;

    setSubmitting(true);
    // Simulated post — frontend only, no backend integration.
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
    setAttachmentName('worksheet_chapter_4.pdf');
  };

  const formattedSelectedDate = selectedDate
    ? upcomingDates.find((d) => d.iso === selectedDate)
    : null;

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
                <Ionicons name="book" size={22} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Post Homework</Text>
                <Text style={styles.headerSubtitle}>
                  Assign new homework to your classroom
                </Text>
              </View>
            </View>

            {/* Class / Grade Selection */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Class / Grade</Text>
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

            {/* Subject Selection */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Subject</Text>
              <View style={styles.subjectGrid}>
                {SUBJECT_OPTIONS.map((subject) => {
                  const active = selectedSubject === subject.label;
                  return (
                    <TouchableOpacity
                      key={subject.label}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedSubject(subject.label);
                        if (errors.subject) setErrors((e) => ({ ...e, subject: '' }));
                      }}
                      style={[styles.subjectChip, active && styles.subjectChipActive]}
                    >
                      <Ionicons
                        name={SUBJECT_ICONS[subject.category]}
                        size={16}
                        color={active ? '#FFFFFF' : '#3B82F6'}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.subjectChipText, active && styles.subjectChipTextActive]}>
                        {subject.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.subject ? <Text style={styles.errorText}>{errors.subject}</Text> : null}
            </View>

            {/* Title */}
            <ClayInput
              label="Homework Title"
              placeholder="e.g. Chapter 4 — Fractions Practice"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (errors.title) setErrors((e) => ({ ...e, title: '' }));
              }}
              error={errors.title}
              leftIcon={<Ionicons name="pencil-outline" size={20} color="#94A3B8" />}
            />

            {/* Description / Instructions */}
            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Description / Instructions</Text>
              <View
                style={[
                  styles.textAreaContainer,
                  Shadows.soft,
                  errors.description ? styles.errorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textArea}
                  placeholder="Write clear instructions for students — what to complete, how to submit, and any resources needed."
                  placeholderTextColor="#94A3B8"
                  value={description}
                  onChangeText={(t) => {
                    setDescription(t);
                    if (errors.description) setErrors((e) => ({ ...e, description: '' }));
                  }}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}
            </View>

            {/* Due Date */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Due Date</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {upcomingDates.map((d) => {
                  const active = selectedDate === d.iso;
                  return (
                    <TouchableOpacity
                      key={d.iso}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedDate(d.iso);
                        if (errors.dueDate) setErrors((e) => ({ ...e, dueDate: '' }));
                      }}
                      style={[styles.dateChip, active && styles.dateChipActive]}
                    >
                      <Text style={[styles.dateChipDay, active && styles.dateChipTextActive]}>
                        {d.dayLabel}
                      </Text>
                      <Text style={[styles.dateChipDate, active && styles.dateChipTextActive]}>
                        {d.dateLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {formattedSelectedDate ? (
                <View style={styles.selectedDatePill}>
                  <Ionicons name="calendar" size={14} color="#B45309" />
                  <Text style={styles.selectedDatePillText}>
                    Due {formattedSelectedDate.dayLabel}, {formattedSelectedDate.dateLabel}
                  </Text>
                </View>
              ) : null}
              {errors.dueDate ? <Text style={styles.errorText}>{errors.dueDate}</Text> : null}
            </View>

            {/* Attachment */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Attachment (optional)</Text>
              {attachmentName ? (
                <View style={[styles.attachmentCard, Shadows.soft]}>
                  <View style={styles.attachmentIconBg}>
                    <Ionicons name="document-text" size={20} color="#3B82F6" />
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
                    <Ionicons name="cloud-upload-outline" size={22} color="#3B82F6" />
                  </View>
                  <Text style={styles.attachmentUploadText}>Tap to add a file</Text>
                  <Text style={styles.attachmentUploadSubtext}>
                    Worksheets, PDFs, or images for students
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Post Button */}
            <ClayButton
              title={submitting ? 'Posting...' : 'Post Homework'}
              onPress={handlePost}
              disabled={submitting}
              variant="info"
              leftIcon={
                !submitting ? (
                  <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
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
            <Text style={styles.successTitle}>Homework Posted!</Text>
            <Text style={styles.successSubtitle}>
              {selectedSubject} homework has been assigned to {selectedGrade}.
            </Text>
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
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
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
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
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
  dateChip: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    borderRadius: BorderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    minWidth: 62,
  },
  dateChipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  dateChipDay: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  dateChipDate: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  dateChipTextActive: {
    color: '#FFFFFF',
  },
  selectedDatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: BorderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  selectedDatePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 6,
  },
  attachmentUpload: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    borderStyle: 'dashed',
    paddingVertical: 24,
  },
  attachmentUploadIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EFF6FF',
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
    backgroundColor: '#EFF6FF',
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
    marginBottom: 22,
    lineHeight: 18,
  },
  successActionsRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
