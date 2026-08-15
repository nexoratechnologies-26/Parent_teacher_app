import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { ClayButton } from '@/components/ui/ClayButton';
import { BottomLandscape } from '@/components/ui/BottomLandscape';
import { parentApi } from '@/services/parentApi';
import { StudentDetails } from '@/services/types';

export default function StudentProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ studentId?: string }>();

  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const studentId = params.studentId || 'stu_01';
      const data = await parentApi.getStudentProfile(studentId);
      setStudent(data);
    } catch (err) {
      console.error('Error fetching student profile:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params.studentId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const handleCallParent = () => {
    if (!student?.parent.phone) return;
    Linking.openURL(`tel:${student.parent.phone}`).catch(() => {
      Alert.alert('Phone Call', `Calling ${student.parent.phone}`);
    });
  };

  const handleChatTeacher = () => {
    if (!student) return;
    router.push({
      pathname: '/(parent)/messages' as any,
      params: { teacherId: student.teacherId, teacherName: student.classTeacher },
    });
  };

  const handleDownloadStudentID = () => {
    if (!student) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      Alert.alert(
        'Student ID Downloaded! 🎓',
        `Official digital ID Card for ${student.name} (${student.grade}-${student.section}) has been generated and saved to your device.`,
        [
          {
            text: 'Share / View',
            onPress: () => {
              Share.share({
                message: `SchoolSync Student ID: ${student.name}, ${student.grade}-${student.section}, Roll No: ${student.rollNo}, Admission: ${student.admissionNo}`,
              });
            },
          },
          { text: 'Done', style: 'cancel' },
        ]
      );
    }, 900);
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'Student Profile Options',
      'Select an action for this student record',
      [
        { text: 'View Attendance Report', onPress: () => router.push('/(parent)/attendance' as any) },
        { text: 'View Academic Marks', onPress: () => router.push('/(parent)/marks' as any) },
        { text: 'Message Class Teacher', onPress: handleChatTeacher },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (loading || !student) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading Student Profile...</Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
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

            <TouchableOpacity
              onPress={handleMoreOptions}
              activeOpacity={0.7}
              style={[styles.navButton, Shadows.soft]}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Student Hero Banner */}
          <View style={styles.heroSection}>
            {/* Playful Floating Decorations */}
            <View style={[styles.decorBadge, styles.decorBook]}>
              <Ionicons name="book" size={18} color="#3B82F6" />
            </View>
            <View style={[styles.decorBadge, styles.decorPencil]}>
              <Ionicons name="pencil" size={16} color="#F59E0B" />
            </View>
            <View style={[styles.decorStar, styles.decorStarLeft]}>
              <Ionicons name="star" size={14} color="#86EFAC" />
            </View>
            <View style={[styles.decorStar, styles.decorStarRight]}>
              <Ionicons name="star" size={16} color="#FBBF24" />
            </View>

            {/* Avatar with Gold Clay Ring */}
            <View style={styles.avatarOuterRing}>
              <View style={styles.avatarInnerContainer}>
                <Image
                  source={student.avatar}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
              {/* Star Badge on Avatar */}
              <View style={styles.avatarStarBadge}>
                <Ionicons name="star" size={14} color="#FFFFFF" />
              </View>
            </View>

            {/* Student Name */}
            <Text style={styles.studentName}>{student.name}</Text>

            {/* Grade & Roll No Pill */}
            <View style={styles.gradeBadgePill}>
              <Ionicons name="school" size={14} color="#0284C7" style={{ marginRight: 5 }} />
              <Text style={styles.gradeBadgeText}>
                {student.grade}-{student.section} | Roll No. {student.rollNo}
              </Text>
            </View>
          </View>

          {/* Student Info Clay Card */}
          <View style={[styles.infoCard, Shadows.soft]}>
            {/* Row 1: DOB */}
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, styles.dobIconBox]}>
                <Ionicons name="calendar" size={20} color="#0D9488" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>DOB</Text>
                <Text style={styles.infoValue}>{student.dob}</Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            {/* Row 2: Blood Group */}
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, styles.bloodIconBox]}>
                <Ionicons name="water" size={20} color="#EF4444" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={styles.infoValue}>{student.bloodGroup}</Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            {/* Row 3: Class Teacher */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleChatTeacher}
              style={styles.infoRow}
            >
              <View style={[styles.infoIconBox, styles.teacherIconBox]}>
                <Ionicons name="person" size={20} color="#D97706" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Class Teacher</Text>
                <Text style={styles.infoValue}>{student.classTeacher}</Text>
              </View>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0284C7" />
            </TouchableOpacity>
          </View>

          {/* Assigned Parent Clay Card */}
          <View style={[styles.parentCard, Shadows.soft]}>
            <View style={styles.parentSectionHeader}>
              <Ionicons name="people" size={16} color="#059669" style={{ marginRight: 6 }} />
              <Text style={styles.parentSectionTitle}>Assigned Parent</Text>
            </View>

            <View style={styles.parentContentRow}>
              <Image source={student.parent.avatar} style={styles.parentAvatar} />
              <View style={styles.parentDetails}>
                <Text style={styles.parentName}>{student.parent.name}</Text>
                <Text style={styles.parentRelationship}>{student.parent.relationship}</Text>

                {/* Phone contact chip */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCallParent}
                  style={styles.phoneChip}
                >
                  <Ionicons name="call" size={12} color="#059669" />
                  <Text style={styles.phoneChipText}>{student.parent.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Download Student ID CTA Button */}
          <ClayButton
            title={downloading ? 'Downloading ID...' : 'Download Student ID'}
            onPress={handleDownloadStudentID}
            variant="success"
            disabled={downloading}
            leftIcon={
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            }
            style={styles.downloadButton}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Bottom atmospheric greenery */}
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
    paddingTop: 8,
    paddingBottom: 95,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  heroSection: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
    position: 'relative',
  },
  avatarOuterRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF3C7',
    borderWidth: 4,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadows.card,
  },
  avatarInnerContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarStarBadge: {
    position: 'absolute',
    bottom: -2,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#38BDF8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorBadge: {
    position: 'absolute',
    padding: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    ...Shadows.soft,
  },
  decorBook: {
    top: 25,
    left: 25,
  },
  decorPencil: {
    top: 30,
    right: 25,
  },
  decorStar: {
    position: 'absolute',
  },
  decorStarLeft: {
    top: 0,
    left: 50,
  },
  decorStarRight: {
    top: -5,
    right: 55,
  },
  studentName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 12,
    letterSpacing: -0.5,
  },
  gradeBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    marginTop: 6,
  },
  gradeBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dobIconBox: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  bloodIconBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  teacherIconBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1ECE1',
    marginVertical: 10,
  },
  parentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 20,
  },
  parentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  parentSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  parentContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parentAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    marginRight: 14,
  },
  parentDetails: {
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  parentRelationship: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  phoneChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 4,
  },
  downloadButton: {
    height: 56,
    marginBottom: 16,
  },
});
