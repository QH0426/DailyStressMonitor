import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Stress Monitor</Text>

      <Text style={styles.subtitle}>Welcome</Text>

      <Text style={styles.description}>
        Track your daily stress using self-reported anxiety,
        panic and lifestyle indicators.
      </Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Today’s status</Text>

        <Text style={styles.statusText}>
          Complete your daily check-in to estimate and monitor your
          stress level.
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('CheckIn')}
      >
        <Text style={styles.primaryButtonText}>
          Start Today’s Check-in
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.secondaryButtonText}>
          View Stress History
        </Text>
      </Pressable>

      <Text style={styles.disclaimer}>
        This application is intended for self-monitoring only and does
        not provide a medical diagnosis.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },

  description: {
    fontSize: 17,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 28,
  },

  statusCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },

  statusText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },

  primaryButton: {
    width: '100%',
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    marginBottom: 14,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  secondaryButton: {
    width: '100%',
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: 'bold',
  },

  disclaimer: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 26,
  },
});