import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayButton } from '@/components/ui/ClayButton';
import { Badge } from '@/components/ui/Badge';
import { BottomLandscape } from '@/components/ui/BottomLandscape';

const { width } = Dimensions.get('window');

export default function EntryScreen() {
  const router = useRouter();

  const handleParentLogin = () => {
    router.push({
      pathname: '/(auth)/login' as any,
      params: { role: 'PARENT' },
    });
  };

  const handleTeacherLogin = () => {
    router.push({
      pathname: '/(auth)/login' as any,
      params: { role: 'TEACHER' },
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Mascot Section */}
          <View style={styles.heroSection}>
            {/* Playful Floating Sparkles/Decorations */}
            <View style={[styles.decorStar, styles.decorStarLeft]}>
              <Ionicons name="star" size={16} color="#F59E0B" />
            </View>
            <View style={[styles.decorDot, styles.decorDotLeft]} />
            <View style={[styles.decorStar, styles.decorStarRight]}>
              <Ionicons name="sparkles" size={18} color="#3B82F6" />
            </View>
            <View style={[styles.decorDot, styles.decorDotRight]} />

            {/* Mascot Image */}
            <View style={styles.mascotContainer}>
              <Image
                source={require('@/assets/images/mascot.png')}
                style={styles.mascotImage}
                resizeMode="contain"
              />
            </View>

            {/* App Brand Title */}
            <View style={styles.titleRow}>
              <Text style={styles.titleSchool}>School</Text>
              <Text style={styles.titleSync}>Sync</Text>
            </View>
            <Text style={styles.subtitle}>Learning Made Simple & Fun</Text>
          </View>

          {/* Feature Highlights ClayCard */}
          <ClayCard style={styles.featureCard} elevated>
            {/* Badge */}
            <View style={styles.badgeWrapper}>
              <Badge
                label="Everything in One Place"
                variant="success"
                icon={<Ionicons name="checkmark-circle" size={16} color="#15803D" />}
              />
            </View>

            {/* 3 Feature Items */}
            <View style={styles.featuresRow}>
              {/* Feature 1 */}
              <View style={styles.featureItem}>
                <View style={[styles.iconCircle, styles.iconCircleYellow]}>
                  <Ionicons name="star" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.featureTitle}>Track Progress</Text>
                <Text style={styles.featureDesc}>
                  Stay updated with your child's growth
                </Text>
              </View>

              {/* Feature 2 */}
              <View style={styles.featureItem}>
                <View style={[styles.iconCircle, styles.iconCircleGreen]}>
                  <MaterialCommunityIcons name="bulletin-board" size={24} color="#10B981" />
                </View>
                <Text style={styles.featureTitle}>Class Updates</Text>
                <Text style={styles.featureDesc}>
                  Get important announcements
                </Text>
              </View>

              {/* Feature 3 */}
              <View style={styles.featureItem}>
                <View style={[styles.iconCircle, styles.iconCircleRed]}>
                  <MaterialCommunityIcons name="food-apple" size={24} color="#EF4444" />
                </View>
                <Text style={styles.featureTitle}>Homework & More</Text>
                <Text style={styles.featureDesc}>
                  Never miss an assignment
                </Text>
              </View>
            </View>

            {/* Carousel Pagination Dots */}
            <View style={styles.paginationRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </ClayCard>

          {/* Action Buttons Section */}
          <View style={styles.actionSection}>
            {/* Parent Login Button */}
            <ClayButton
              title="Parent Login"
              onPress={handleParentLogin}
              variant="primary"
              leftIcon={
                <View style={styles.buttonIconBg}>
                  <Ionicons name="people" size={20} color="#FFFFFF" />
                </View>
              }
              rightIcon={
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              }
              style={styles.buttonMargin}
            />

            {/* Teacher Login Button */}
            <ClayButton
              title="Teacher Login"
              onPress={handleTeacherLogin}
              variant="secondary"
              leftIcon={
                <View style={[styles.buttonIconBg, styles.teacherIconBg]}>
                  <Ionicons name="school" size={20} color="#2563EB" />
                </View>
              }
              rightIcon={
                <Ionicons name="chevron-forward" size={20} color="#2563EB" />
              }
              style={styles.buttonMargin}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Decorative Bottom Landscape Hills & Scenery */}
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
    paddingTop: 10,
    paddingBottom: 95,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
    position: 'relative',
  },
  mascotContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  decorStar: {
    position: 'absolute',
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
  },
  decorStarLeft: {
    top: 20,
    left: 40,
  },
  decorStarRight: {
    top: 30,
    right: 40,
  },
  decorDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  decorDotLeft: {
    top: 70,
    left: 25,
    backgroundColor: '#60A5FA',
  },
  decorDotRight: {
    top: 85,
    right: 30,
    backgroundColor: '#34D399',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  titleSchool: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  titleSync: {
    fontSize: 34,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  featureCard: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    marginBottom: 22,
  },
  badgeWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
  },
  iconCircleYellow: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  iconCircleGreen: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  iconCircleRed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 10,
    lineHeight: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  actionSection: {
    width: '100%',
  },
  buttonMargin: {
    marginBottom: 14,
  },
  buttonIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherIconBg: {
    backgroundColor: '#DBEAFE',
  },
});
