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
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';
import WarmCard from '../components/WarmCard';

import { registerUser } from '../services/authService';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

function getRegistrationError(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Please choose a stronger password with at least six characters.';

    case 'auth/network-request-failed':
      return 'The connection failed. Please check your internet connection and try again.';

    case 'auth/too-many-requests':
      return 'Too many attempts were made. Please wait and try again.';

    case 'auth/operation-not-allowed':
      return 'Email and password registration is not enabled in Firebase.';

    default:
      return 'Your account could not be created. Please try again.';
  }
}

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isRegistering, setIsRegistering] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  function validateForm() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage(
        'Please enter your email address.'
      );

      return false;
    }

    if (
      !trimmedEmail.includes('@') ||
      !trimmedEmail.includes('.')
    ) {
      setErrorMessage(
        'Please enter a valid email address.'
      );

      return false;
    }

    if (!password) {
      setErrorMessage(
        'Please enter a password.'
      );

      return false;
    }

    if (password.length < 6) {
      setErrorMessage(
        'Your password must contain at least six characters.'
      );

      return false;
    }

    if (!confirmPassword) {
      setErrorMessage(
        'Please confirm your password.'
      );

      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        'The two passwords do not match.'
      );

      return false;
    }

    return true;
  }

  async function handleRegister() {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsRegistering(true);

      await registerUser(
        email.trim().toLowerCase(),
        password
      );

      /*
        Do not navigate manually here.

        Firebase automatically signs in a newly
        registered user. AppNavigator listens to
        onAuthStateChanged() and will automatically
        replace the authentication screens with the
        main application screens.
      */
    } catch (error) {
      console.error(
        'Unable to register user:',
        error
      );

      setErrorMessage(
        getRegistrationError(error.code)
      );
    } finally {
      setIsRegistering(false);
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
        <View style={styles.brandIcon}>
          <Leaf
            size={40}
            color={Colors.primaryDark}
            strokeWidth={1.8}
          />
        </View>

        <Text style={styles.title}>
          Create your private space
        </Text>

        <Text style={styles.description}>
          Create an account to protect access to
          your wellbeing reflections and continue
          your personal journey.
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
                autoComplete="email"
                textContentType="emailAddress"
                editable={!isRegistering}
                accessibilityLabel="Email address"
              />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              Password
            </Text>

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
                placeholder="At least 6 characters"
                placeholderTextColor="#A49B91"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                editable={!isRegistering}
                accessibilityLabel="Password"
              />

              <Pressable
                style={styles.visibilityButton}
                onPress={() =>
                  setShowPassword(
                    (currentValue) =>
                      !currentValue
                  )
                }
                disabled={isRegistering}
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

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              Confirm password
            </Text>

            <View style={styles.inputContainer}>
              <ShieldCheck
                size={21}
                color={Colors.textSecondary}
                strokeWidth={1.9}
              />

              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter the password again"
                placeholderTextColor="#A49B91"
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                editable={!isRegistering}
                accessibilityLabel="Confirm password"
                onSubmitEditing={handleRegister}
              />

              <Pressable
                style={styles.visibilityButton}
                onPress={() =>
                  setShowConfirmPassword(
                    (currentValue) =>
                      !currentValue
                  )
                }
                disabled={isRegistering}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword
                    ? 'Hide confirmed password'
                    : 'Show confirmed password'
                }
              >
                {showConfirmPassword ? (
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
              isRegistering
                ? 'Creating Account...'
                : 'Create Account'
            }
            icon={UserPlus}
            onPress={handleRegister}
            disabled={isRegistering}
          />

          {isRegistering ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.activityIndicator}
            />
          ) : null}
        </WarmCard>

        <View style={styles.privacyCard}>
          <ShieldCheck
            size={23}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />

          <Text style={styles.privacyText}>
            Authentication protects access to
            reflections connected to your account.
            Your password is managed securely by
            Firebase Authentication.
          </Text>
        </View>

        <Text style={styles.loginQuestion}>
          Already have an account?
        </Text>

        <AppButton
          title="Go to Login"
          variant="secondary"
          onPress={() =>
            navigation.navigate('Login')
          }
          disabled={isRegistering}
        />
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
    fontSize: 29,
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

  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
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

  activityIndicator: {
    marginTop: Spacing.sm,
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

  loginQuestion: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});