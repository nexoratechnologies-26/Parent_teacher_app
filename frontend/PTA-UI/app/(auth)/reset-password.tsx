import React, { useState } from 'react';
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

import { Shadows, BorderRadius } from '@/constants/theme';
import { ClayInput } from '@/components/ui/ClayInput';
import { ClayButton } from '@/components/ui/ClayButton';
import { BottomLandscape } from '@/components/ui/BottomLandscape';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your registered email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSendResetLink = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Simulate API call for password reset link: POST /api/v1/auth/forgot-password
      setTimeout(() => {
        setLoading(false);
        setIsSent(true);
        Alert.alert(
          'Reset Link Sent! 📬',
          `We have sent password recovery instructions to ${email}. Please check your inbox.`,
          [
            {
              text: 'Back to Sign In',
              onPress: () => {
                router.replace({
                  pathname: '/(auth)/login' as any,
                  params: { role: params.role || 'PARENT' },
                });
              },
            },
          ]
        );
      }, 700);
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Unable to send reset instructions. Please try again.');
    }
  };

  const handleBackToSignIn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/(auth)/login' as any,
        params: { role: params.role || 'PARENT' },
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
            {/* Top Navigation */}
            <View style={styles.topNav}>
              <TouchableOpacity
                onPress={handleBackToSignIn}
                activeOpacity={0.7}
                style={[styles.backButton, Shadows.soft]}
              >
                <Ionicons name="arrow-back" size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Header with Title & Cute Key Graphic */}
            <View style={styles.headerSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleReset}>Reset</Text>
                <Text style={styles.titlePassword}>Password</Text>
              </View>

              {/* Key Mascot Graphic */}
              <View style={styles.keyMascotWrapper}>
                <Image
                  source={require('@/assets/images/key_mascot.png')}
                  style={styles.keyMascotImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Info Message Clay Card */}
            <View style={[styles.infoCard, Shadows.soft]}>
              <View style={styles.mailMascotWrapper}>
                <Image
                  source={require('@/assets/images/mail_mascot.png')}
                  style={styles.mailMascotImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.infoText}>
                Enter your registered email and we'll send you instructions to reset your password.
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <ClayInput
                placeholder="Registered Email Address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(undefined);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                error={error}
                leftIcon={
                  <View style={[styles.inputIconCircle, styles.tealIconCircle]}>
                    <Ionicons name="mail-outline" size={18} color="#0D9488" />
                  </View>
                }
              />

              {/* Send Reset Link CTA */}
              <ClayButton
                title={loading ? 'Sending...' : 'Send Reset Link'}
                onPress={handleSendResetLink}
                variant="info"
                disabled={loading}
                leftIcon={
                  <View style={styles.buttonSendIconBg}>
                    <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                  </View>
                }
                style={styles.sendButton}
              />

              {/* Back to Sign In Link */}
              <TouchableOpacity
                onPress={handleBackToSignIn}
                activeOpacity={0.7}
                style={styles.backToSignInButton}
              >
                <Ionicons name="arrow-back" size={16} color="#0284C7" style={styles.backLinkIcon} />
                <Text style={styles.backToSignInText}>Back to Sign In</Text>
              </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 95,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  titleReset: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  titlePassword: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0D9488',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  keyMascotWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyMascotImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: BorderRadius.xxl,
    padding: 16,
    marginBottom: 24,
  },
  mailMascotWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  mailMascotImage: {
    width: '100%',
    height: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#065F46',
    fontWeight: '600',
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
  tealIconCircle: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  sendButton: {
    marginTop: 8,
    height: 56,
  },
  buttonSendIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 999,
    padding: 5,
  },
  backToSignInButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 8,
  },
  backLinkIcon: {
    marginRight: 6,
  },
  backToSignInText: {
    fontSize: 15,
    color: '#0284C7',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
