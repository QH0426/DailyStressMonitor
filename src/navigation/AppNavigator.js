import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CheckInScreen from '../screens/CheckInScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import InformationScreen from '../screens/InformationScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ResultScreen from '../screens/ResultScreen';

import Colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
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
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Daily Stress Monitor',
        }}
      />

      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          title: 'Daily Reflection',
        }}
      />

      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: 'Wellbeing Summary',
        }}
      />

      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Your Journey',
        }}
      />

      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Wellbeing Trends',
        }}
      />

      <Stack.Screen
        name="Information"
        component={InformationScreen}
        options={{
          title: 'Privacy & Information',
        }}
      />
    </Stack.Navigator>
  );
}