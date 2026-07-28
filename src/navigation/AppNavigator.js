import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CheckInScreen from '../screens/CheckInScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563EB',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
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
          title: 'Daily Check-in',
        }}
      />

      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: 'Stress Result',
        }}
      />

      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Stress History',
        }}
      />
    </Stack.Navigator>
  );
}