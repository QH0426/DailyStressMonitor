import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import { initialiseDatabase } from './src/database/database';

export default function App() {
  useEffect(() => {
    async function prepareDatabase() {
      try {
        await initialiseDatabase();
      } catch (error) {
        console.error('Database initialisation failed:', error);
      }
    }

    prepareDatabase();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}