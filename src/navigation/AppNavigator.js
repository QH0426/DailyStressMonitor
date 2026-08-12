import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

import {
  LogOut,
} from 'lucide-react-native';

import CheckInScreen from '../screens/CheckInScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import InformationScreen from '../screens/InformationScreen';
import LoginScreen from '../screens/LoginScreen';
import ProgressScreen from '../screens/ProgressScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResultScreen from '../screens/ResultScreen';

import { auth } from '../firebase/firebaseConfig';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setCurrentUser(firebaseUser);
        setIsCheckingAuth(false);
      },
      (error) => {
        console.error(
          'Unable to check authentication state:',
          error
        );

        setCurrentUser(null);
        setIsCheckingAuth(false);
      }
    );

    return unsubscribe;
  }, []);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await signOut(auth);

      /*
        onAuthStateChanged automatically changes
        currentUser to null and the navigator then
        switches to the Login screen.
      */
    } catch (error) {
      console.error(
        'Unable to sign out:',
        error
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  function renderLogoutButton() {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={handleLogout}
        disabled={isLoggingOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        {isLoggingOut ? (
          <ActivityIndicator
            size="small"
            color={Colors.white}
          />
        ) : (
          <>
            <LogOut
              size={18}
              color={Colors.white}
              strokeWidth={2}
            />

            <Text style={styles.logoutText}>
              Logout
            </Text>
          </>
        )}
      </Pressable>
    );
  }

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text style={styles.loadingText}>
          Preparing your private space...
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryDark,
        },

        headerTintColor: Colors.white,

        headerTitleStyle: {
          fontWeight: '600',
        },

        headerShadowVisible: false,

        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      {currentUser ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Daily Stress Monitor',

              headerRight: () =>
                renderLogoutButton(),
            }}
          />

          <Stack.Screen
            name="CheckIn"
            component={CheckInScreen}
            options={{
              title: 'Daily Reflection',

              headerRight: () =>
                renderLogoutButton(),
            }}
          />

          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              title: 'Wellbeing Summary',

              headerRight: () =>
                renderLogoutButton(),
            }}
          />

          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              title: 'Your Journey',

              headerRight: () =>
                renderLogoutButton(),
            }}
          />

          <Stack.Screen
            name="Progress"
            component={ProgressScreen}
            options={{
              title: 'Wellbeing Trends',

              headerRight: () =>
                renderLogoutButton(),
            }}
          />

          <Stack.Screen
            name="Information"
            component={InformationScreen}
            options={{
              title: 'Privacy & Information',

              headerRight: () =>
                renderLogoutButton(),
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Sign In',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'Create Account',
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },

  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },

  logoutButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  logoutButtonPressed: {
    opacity: 0.72,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 6,
  },
});