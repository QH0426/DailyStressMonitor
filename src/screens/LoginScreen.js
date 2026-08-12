import { useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Eye,
  EyeOff,
  KeyRound,
  Leaf,
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
import WarmCard from '../components/WarmCard';

import { loginUser } from '../services/authService';
import { auth } from '../firebase/firebaseConfig';

import Colors from '../theme/colors';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  /*
    Forgot password state
  */
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

      /*
        Firebase authentication state automatically
        moves the signed-in user to the main app.
      */
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

    /*
      If the user has already typed an email into
      the login form, use it automatically.
    */
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
        <View style={styles.contentWrapper}>
          <View style={styles.brandIcon}>
            <Leaf
              size={40}
              color={Colors.primaryDark}
              strokeWidth={1.8}
            />
          </View>

          <Text style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.description}>
            Sign in to continue your private wellbeing
            journey and access your saved reflections.
          </Text>

          <WarmCard>
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
          </WarmCard>

          {/* Forgot Password panel */}

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
                      Enter the email address connected to your account.
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
            <ShieldCheck
              size={23}
              color={Colors.primaryDark}
              strokeWidth={1.9}
            />

            <Text style={styles.privacyText}>
              Authentication helps protect access to
              reflections connected to your account.
            </Text>
          </View>

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
    backgroundColor: Colors.background,
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  contentWrapper: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },

  brandIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#E9F2EC',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },

  title: {
    fontSize: 30,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  description: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: Spacing.xl,
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
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },

  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
  },

  inputContainer: {
    minHeight: 58,
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
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 20,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
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
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F2EC',
    marginRight: Spacing.md,
  },

  resetHeadingText: {
    flex: 1,
  },

  resetTitle: {
    fontSize: 18,
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
    minHeight: 58,
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
    backgroundColor: '#EDF5F2',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  privacyText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginLeft: Spacing.md,
  },

  registerQuestion: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});