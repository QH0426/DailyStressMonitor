import { useState } from 'react';

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react-native';

import {
  sendPasswordResetEmail,
} from 'firebase/auth';

import AppButton from '../components/AppButton';

import { loginUser } from '../services/authService';
import { auth } from '../firebase/firebaseConfig';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

function getLoginError(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/invalid-credential':
      return 'The email address or password is incorrect.';

    case 'auth/user-disabled':
      return 'This account has been disabled.';

    case 'auth/network-request-failed':
      return 'The connection failed. Please check your internet and try again.';

    case 'auth/too-many-requests':
      return 'Too many attempts were made. Please wait and try again.';

    default:
      return 'You could not be signed in. Please check your details and try again.';
  }
}

function getResetError(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/missing-email':
      return 'Please enter your email address.';

    case 'auth/network-request-failed':
      return 'The connection failed. Please check your internet connection and try again.';

    case 'auth/too-many-requests':
      return 'Too many requests were made. Please wait a little and try again.';

    default:
      return 'The password reset email could not be sent. Please check the email address and try again.';
  }
}

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [resetEmail, setResetEmail] =
    useState('');

  const [isSendingReset, setIsSendingReset] =
    useState(false);

  const [resetError, setResetError] =
    useState('');

  const [resetSuccess, setResetSuccess] =
    useState('');

  function validateForm() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage(
        'Please enter your email address.'
      );

      return false;
    }

    if (!trimmedEmail.includes('@')) {
      setErrorMessage(
        'Please enter a valid email address.'
      );

      return false;
    }

    if (!password) {
      setErrorMessage(
        'Please enter your password.'
      );

      return false;
    }

    return true;
  }

  async function handleLogin() {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoggingIn(true);

      await loginUser(
        email.trim().toLowerCase(),
        password
      );
    } catch (error) {
      console.error(
        'Unable to log in:',
        error
      );

      setErrorMessage(
        getLoginError(error.code)
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  function openForgotPassword() {
    setResetError('');
    setResetSuccess('');

    setResetEmail(
      email.trim().toLowerCase()
    );

    setShowForgotPassword(true);
  }

  function closeForgotPassword() {
    if (isSendingReset) {
      return;
    }

    setShowForgotPassword(false);
    setResetError('');
    setResetSuccess('');
  }

  async function handlePasswordReset() {
    const trimmedEmail =
      resetEmail.trim().toLowerCase();

    setResetError('');
    setResetSuccess('');

    if (!trimmedEmail) {
      setResetError(
        'Please enter the email address connected to your account.'
      );

      return;
    }

    if (!trimmedEmail.includes('@')) {
      setResetError(
        'Please enter a valid email address.'
      );

      return;
    }

    try {
      setIsSendingReset(true);

      await sendPasswordResetEmail(
        auth,
        trimmedEmail
      );

      setResetSuccess(
        'Password reset email sent. Please check your inbox and follow the link to create a new password.'
      );
    } catch (error) {
      console.error(
        'Unable to send password reset email:',
        error
      );

      setResetError(
        getResetError(error.code)
      );
    } finally {
      setIsSendingReset(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.pageShell,
            isWide && styles.pageShellWide,
          ]}
        >
          <View
            style={[
              styles.visualPanel,
              isWide && styles.visualPanelWide,
            ]}
          >
            <Image
              source={require('../../assets/images/pexels-albinawhite-12058425.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />

            <View style={styles.imageOverlay} />

            <View style={styles.visualContent}>
              <View style={styles.visualBadge}>
                <Heart
                  size={18}
                  color={Colors.primaryDark}
                  strokeWidth={1.9}
                />

                <Text style={styles.visualBadgeText}>
                  DAILY WELLBEING
                </Text>
              </View>

              <View style={styles.visualTextBlock}>
                <Text style={styles.visualTitle}>
                  A private space to pause and reflect.
                </Text>

                <Text style={styles.visualDescription}>
                  Check in with how you feel, understand
                  your daily stress patterns and keep track
                  of your wellbeing over time.
                </Text>
              </View>

              <View style={styles.visualQuote}>
                <Text style={styles.visualQuoteText}>
                  Small daily reflections can help make
                  patterns easier to notice.
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.formPanel,
              isWide && styles.formPanelWide,
            ]}
          >
            <View style={styles.brandMark}>
              <View style={styles.brandIcon}>
                <Heart
                  size={29}
                  color={Colors.primaryDark}
                  strokeWidth={1.8}
                />
              </View>

              <View>
                <Text style={styles.brandName}>
                  Daily Stress Monitor
                </Text>

                <Text style={styles.brandSubtitle}>
                  Personal wellbeing reflection
                </Text>
              </View>
            </View>

            <View style={styles.headingBlock}>
              <Text style={styles.title}>
                Welcome back
              </Text>

              <Text style={styles.description}>
                Sign in to continue your private wellbeing
                journey and access your saved reflections.
              </Text>
            </View>

            <View style={styles.loginCard}>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  Email address
                </Text>

                <View style={styles.inputContainer}>
                  <Mail
                    size={21}
                    color={Colors.textSecondary}
                    strokeWidth={1.9}
                  />

                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="#A49B91"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoggingIn}
                    accessibilityLabel="Email address"
                  />
                </View>
              </View>

              <View style={styles.passwordHeader}>
                <Text style={styles.inputLabel}>
                  Password
                </Text>

                <Pressable
                  onPress={openForgotPassword}
                  accessibilityRole="button"
                  accessibilityLabel="Forgot password"
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </Pressable>
              </View>

              <View style={styles.passwordInputSection}>
                <View style={styles.inputContainer}>
                  <LockKeyhole
                    size={21}
                    color={Colors.textSecondary}
                    strokeWidth={1.9}
                  />

                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#A49B91"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoggingIn}
                    accessibilityLabel="Password"
                    onSubmitEditing={handleLogin}
                  />

                  <Pressable
                    style={styles.visibilityButton}
                    onPress={() =>
                      setShowPassword(
                        (currentValue) =>
                          !currentValue
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={21}
                        color={Colors.primaryDark}
                        strokeWidth={1.9}
                      />
                    ) : (
                      <Eye
                        size={21}
                        color={Colors.primaryDark}
                        strokeWidth={1.9}
                      />
                    )}
                  </Pressable>
                </View>
              </View>

              {errorMessage ? (
                <View style={styles.errorCard}>
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                </View>
              ) : null}

              <AppButton
                title={
                  isLoggingIn
                    ? 'Signing In...'
                    : 'Sign In'
                }
                icon={LogIn}
                onPress={handleLogin}
                disabled={isLoggingIn}
              />

              {isLoggingIn ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.primary}
                  style={styles.activityIndicator}
                />
              ) : null}
            </View>

            {showForgotPassword ? (
              <View style={styles.resetCard}>
                <View style={styles.resetHeader}>
                  <View style={styles.resetTitleRow}>
                    <View style={styles.resetIcon}>
                      <KeyRound
                        size={22}
                        color={Colors.primaryDark}
                        strokeWidth={1.9}
                      />
                    </View>

                    <View style={styles.resetHeadingText}>
                      <Text style={styles.resetTitle}>
                        Reset your password
                      </Text>

                      <Text style={styles.resetDescription}>
                        Enter the email address connected to
                        your account.
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={styles.closeButton}
                    onPress={closeForgotPassword}
                    accessibilityRole="button"
                    accessibilityLabel="Close password reset"
                  >
                    <X
                      size={21}
                      color={Colors.textSecondary}
                    />
                  </Pressable>
                </View>

                <View style={styles.resetInputContainer}>
                  <Mail
                    size={20}
                    color={Colors.textSecondary}
                    strokeWidth={1.9}
                  />

                  <TextInput
                    style={styles.input}
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="#A49B91"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isSendingReset}
                    accessibilityLabel="Password reset email"
                  />
                </View>

                {resetError ? (
                  <View style={styles.errorCard}>
                    <Text style={styles.errorText}>
                      {resetError}
                    </Text>
                  </View>
                ) : null}

                {resetSuccess ? (
                  <View style={styles.successCard}>
                    <Text style={styles.successText}>
                      {resetSuccess}
                    </Text>
                  </View>
                ) : null}

                {!resetSuccess ? (
                  <AppButton
                    title={
                      isSendingReset
                        ? 'Sending...'
                        : 'Send Reset Email'
                    }
                    icon={Mail}
                    onPress={handlePasswordReset}
                    disabled={isSendingReset}
                  />
                ) : (
                  <AppButton
                    title="Back to Sign In"
                    variant="secondary"
                    onPress={closeForgotPassword}
                  />
                )}

                {isSendingReset ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.primary}
                    style={styles.activityIndicator}
                  />
                ) : null}
              </View>
            ) : null}

            <View style={styles.privacyCard}>
              <View style={styles.privacyIcon}>
                <ShieldCheck
                  size={22}
                  color={Colors.primaryDark}
                  strokeWidth={1.9}
                />
              </View>

              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>
                  Your reflections are private
                </Text>

                <Text style={styles.privacyText}>
                  Authentication helps protect access to
                  reflections connected to your account.
                </Text>
              </View>
            </View>

            <View style={styles.registerSection}>
              <Text style={styles.registerQuestion}>
                Don’t have an account yet?
              </Text>

              <AppButton
                title="Create an Account"
                icon={UserPlus}
                variant="secondary"
                onPress={() =>
                  navigation.navigate('Register')
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: '#F7F4EF',
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  pageShell: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    backgroundColor: '#FBFAF7',
    borderWidth: 1,
    borderColor: '#E6E0D8',
    borderRadius: 30,
    overflow: 'hidden',
    ...Shadows.card,
  },

  pageShellWide: {
    flexDirection: 'row',
    minHeight: 700,
  },

  visualPanel: {
    minHeight: 330,
    position: 'relative',
    overflow: 'hidden',
  },

  visualPanelWide: {
    flex: 1.05,
    minHeight: 700,
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(236, 242, 233, 0.42)',
  },

  visualContent: {
    flex: 1,
    padding: 34,
    justifyContent: 'space-between',
  },

  visualBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  visualBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primaryDark,
    marginLeft: 7,
  },

  visualTextBlock: {
    maxWidth: 440,
  },

  visualTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#29473D',
    lineHeight: 42,
    marginBottom: 12,
  },

  visualDescription: {
    fontSize: 15,
    color: '#49645B',
    lineHeight: 23,
  },

  visualQuote: {
    maxWidth: 410,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    padding: 14,
  },

  visualQuoteText: {
    flex: 1,
    fontSize: 13,
    color: '#675D4E',
    lineHeight: 19,
  },

  formPanel: {
    padding: Spacing.xl,
    backgroundColor: '#FBFAF7',
  },

  formPanelWide: {
    flex: 0.95,
    justifyContent: 'center',
    paddingHorizontal: 42,
  },

  brandMark: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },

  brandIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0EA',
    marginRight: 12,
  },

  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 2,
  },

  brandSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  headingBlock: {
    marginBottom: Spacing.lg,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 7,
  },

  description: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 23,
  },

  loginCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E3DED6',
    borderRadius: 22,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  inputSection: {
    marginBottom: Spacing.lg,
  },

  passwordInputSection: {
    marginBottom: Spacing.lg,
  },

  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
  },

  inputContainer: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFAF7',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 13,
    paddingHorizontal: Spacing.md,
  },

  visibilityButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorCard: {
    backgroundColor: '#FBECE9',
    borderWidth: 1,
    borderColor: '#E7B8AE',
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  errorText: {
    fontSize: 14,
    color: '#A05E4B',
    lineHeight: 20,
  },

  successCard: {
    backgroundColor: '#EDF6EF',
    borderWidth: 1,
    borderColor: '#C9DFC9',
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  successText: {
    fontSize: 14,
    color: '#54785C',
    lineHeight: 20,
  },

  activityIndicator: {
    marginTop: Spacing.sm,
  },

  resetCard: {
    backgroundColor: '#F3F7F4',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  resetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  resetTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  resetIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4EEE7',
    marginRight: Spacing.md,
  },

  resetHeadingText: {
    flex: 1,
  },

  resetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  resetDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },

  resetInputContainer: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFAF7',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF5F0',
    borderWidth: 1,
    borderColor: '#D6E4DA',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  privacyIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2EEE6',
  },

  privacyTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  privacyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  registerSection: {
    paddingTop: 2,
  },

  registerQuestion: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});