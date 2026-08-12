import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { ClayInput } from '@/components/ui/ClayInput';
import { ClayButton } from '@/components/ui/ClayButton';
import { SegmentedRoleControl, RoleType } from '@/components/ui/SegmentedRoleControl';
import { BottomLandscape } from '@/components/ui/BottomLandscape';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();

  const [selectedRole, setSelectedRole] = useState<RoleType>('PARENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (params.role) {
      const upperRole = params.role.toUpperCase();
      if (upperRole === 'PARENT' || upperRole === 'TEACHER' || upperRole === 'ADMIN') {
        setSelectedRole(upperRole as RoleType);
      }
    }
  }, [params.role]);

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (phone.trim().length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!password) {
      newErrors.password = 'Please enter a password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Simulate API call for user registration: POST /api/v1/auth/register
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Account Created! 🎉',
          `Welcome to SchoolSync as a ${selectedRole.toLowerCase()}! Please sign in with your credentials.`,
          [
            {
              text: 'Sign In Now',
              onPress: () => {
                router.replace({
                  pathname: '/(auth)/login' as any,
                  params: { role: selectedRole },
                });
              },
            },
          ]
        );
      }, 700);
    } catch (err) {
      setLoading(false);
      Alert.alert('Registration Error', 'Unable to create account. Please try again.');
    }
  };

  const handleSignIn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push({
        pathname: '/(auth)/login' as any,
        params: { role: selectedRole },
      });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Navigation Bar / Back button */}
            <View style={styles.topNav}>
              <TouchableOpacity
                onPress={handleSignIn}
                activeOpacity={0.7}
                style={[styles.backButton, Shadows.soft]}
              >
                <Ionicons name="arrow-back" size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Mascot & Greeting Header */}
            <View style={styles.heroSection}>
              {/* Playful Floating Decor */}
              <View style={[styles.decorStar, styles.decorStarLeft]}>
                <Ionicons name="star" size={14} color="#F59E0B" />
              </View>
              <View style={[styles.decorDot, styles.decorDotLeft]} />
              <View style={[styles.decorStar, styles.decorStarRight]}>
                <Ionicons name="sparkles" size={16} color="#3B82F6" />
              </View>
              <View style={[styles.decorDot, styles.decorDotRight]} />

              {/* 3D Book Mascot */}
              <View style={styles.mascotWrapper}>
                <Image
                  source={require('@/assets/images/book_mascot.png')}
                  style={styles.mascotImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Let's get you started! ✨</Text>
            </View>

            {/* Role Switcher (Parent / Teacher) */}
            <SegmentedRoleControl
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
              style={styles.roleControl}
            />

            {/* Registration Form Fields */}
            <View style={styles.formContainer}>
              {/* Full Name */}
              <ClayInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                autoCapitalize="words"
                error={errors.fullName}
                leftIcon={
                  <View style={[styles.inputIconCircle, styles.skyBlueIconCircle]}>
                    <Ionicons name="person" size={18} color="#38BDF8" />
                  </View>
                }
              />

              {/* Email Address */}
              <ClayInput
                placeholder="Email Address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email}
                leftIcon={
                  <View style={[styles.inputIconCircle, styles.skyBlueIconCircle]}>
                    <Ionicons name="mail" size={18} color="#38BDF8" />
                  </View>
                }
              />

              {/* Phone Number */}
              <ClayInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                keyboardType="phone-pad"
                error={errors.phone}
                leftIcon={
                  <View style={[styles.inputIconCircle, styles.skyBlueIconCircle]}>
                    <Ionicons name="call" size={18} color="#38BDF8" />
                  </View>
                }
              />

              {/* Password */}
              <ClayInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                isPassword
                error={errors.password}
                leftIcon={
                  <View style={[styles.inputIconCircle, styles.skyBlueIconCircle]}>
                    <Ionicons name="lock-closed" size={18} color="#38BDF8" />
                  </View>
                }
              />

              {/* Register CTA Button */}
              <ClayButton
                title={loading ? 'Creating Account...' : 'Register'}
                onPress={handleRegister}
                variant="primary"
                disabled={loading}
                leftIcon={
                  <View style={styles.buttonUserIconBg}>
                    <Ionicons name="person-add" size={18} color="#FFFFFF" />
                  </View>
                }
                rightIcon={
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                }
                style={styles.registerButton}
              />

              {/* Sign In Link */}
              <View style={styles.signInRow}>
                <Text style={styles.signInPrompt}>Already have an account? </Text>
                <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Decorative Bottom Landscape Graphics */}
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 95,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButton: {
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
    marginTop: 2,
    marginBottom: 14,
    position: 'relative',
  },
  mascotWrapper: {
    width: 140,
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
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
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  decorStarLeft: {
    top: 15,
    left: 20,
  },
  decorStarRight: {
    top: 25,
    right: 25,
  },
  decorDot: {
    position: 'absolute',
    borderRadius: 999,
  },
  decorDotLeft: {
    top: 75,
    left: 35,
    width: 10,
    height: 10,
    backgroundColor: '#60A5FA',
  },
  decorDotRight: {
    top: 70,
    right: 35,
    width: 12,
    height: 12,
    backgroundColor: '#F472B6',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  roleControl: {
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
  },
  inputIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skyBlueIconCircle: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  registerButton: {
    marginTop: 6,
    height: 56,
  },
  buttonUserIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 999,
    padding: 5,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  signInPrompt: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  signInLink: {
    fontSize: 14,
    color: '#0284C7',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
