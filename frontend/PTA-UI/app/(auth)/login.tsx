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
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { ClayInput } from '@/components/ui/ClayInput';
import { ClayButton } from '@/components/ui/ClayButton';
import { SegmentedRoleControl, RoleType } from '@/components/ui/SegmentedRoleControl';
import { BottomLandscape } from '@/components/ui/BottomLandscape';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();

  const [selectedRole, setSelectedRole] = useState<RoleType>('PARENT');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (params.role) {
      const upperRole = params.role.toUpperCase();
      if (upperRole === 'PARENT' || upperRole === 'TEACHER' || upperRole === 'ADMIN') {
        setSelectedRole(upperRole as RoleType);
      }
    }
  }, [params.role]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!emailOrUsername.trim()) {
      newErrors.email = 'Please enter your email or username';
    }
    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Simulate authentication flow / API endpoint POST /api/v1/auth/login
      setTimeout(() => {
        setLoading(false);
        if (selectedRole === 'PARENT') {
          router.replace('/(parent)/dashboard' as any);
        } else if (selectedRole === 'TEACHER') {
          router.replace('/(teacher)/dashboard' as any);
        } else {
          router.replace('/(admin)/dashboard' as any);
        }
      }, 600);
    } catch (err) {
      setLoading(false);
      Alert.alert('Sign In Failed', 'Invalid credentials or server error. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    router.push({
      pathname: '/(auth)/reset-password' as any,
      params: { role: selectedRole },
    });
  };

  const handleRegister = () => {
    router.push({
      pathname: '/(auth)/register' as any,
      params: { role: selectedRole },
    });
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
            {/* Mascot & Greeting Header */}
            <View style={styles.heroSection}>
              {/* Playful Floating Decor */}
              <View style={[styles.decorStar, styles.decorStarLeft]}>
                <Ionicons name="star" size={14} color="#F59E0B" />
              </View>
              <View style={[styles.decorDot, styles.decorDotLeft]} />
              <View style={[styles.decorDot, styles.decorDotRight]} />

              {/* 3D Backpack Mascot */}
              <View style={styles.mascotWrapper}>
                <Image
                  source={require('@/assets/images/backpack.png')}
                  style={styles.mascotImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Glad to see you again 💛</Text>
            </View>

            {/* Role Switcher (Parent / Teacher) */}
            <SegmentedRoleControl
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
              style={styles.roleControl}
            />

            {/* Input Form Fields */}
            <View style={styles.formContainer}>
              {/* Email / Username */}
              <ClayInput
                placeholder="Email / Username"
                value={emailOrUsername}
                onChangeText={(text) => {
                  setEmailOrUsername(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email}
                leftIcon={
                  <View style={[styles.inputIconCircle, styles.userIconCircle]}>
                    <Ionicons name="person" size={18} color="#10B981" />
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
                  <View style={[styles.inputIconCircle, styles.lockIconCircle]}>
                    <Ionicons name="lock-closed" size={18} color="#3B82F6" />
                  </View>
                }
              />

              {/* Sign In CTA Button */}
              <ClayButton
                title={loading ? 'Signing In...' : 'Sign In'}
                onPress={handleSignIn}
                variant="primary"
                disabled={loading}
                leftIcon={
                  <View style={styles.buttonLockIconBg}>
                    <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                  </View>
                }
                rightIcon={
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                }
                style={styles.signInButton}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                activeOpacity={0.7}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Register Link */}
              <View style={styles.registerRow}>
                <Text style={styles.registerPrompt}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
                  <Text style={styles.registerLink}>Register</Text>
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
    paddingTop: 10,
    paddingBottom: 95,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    position: 'relative',
  },
  mascotWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
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
    top: 30,
    left: 45,
  },
  decorDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  decorDotLeft: {
    top: 75,
    right: 50,
    backgroundColor: '#EF4444',
  },
  decorDotRight: {
    top: 20,
    right: 65,
    backgroundColor: '#3B82F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  roleControl: {
    marginTop: 6,
    marginBottom: 18,
  },
  formContainer: {
    width: '100%',
  },
  inputIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconCircle: {
    backgroundColor: '#DCFCE7',
  },
  lockIconCircle: {
    backgroundColor: '#DBEAFE',
  },
  signInButton: {
    marginTop: 6,
    marginBottom: 18,
  },
  buttonLockIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 12,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2D9C8',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  registerPrompt: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
});
