import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function InformationScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Information & Privacy
      </Text>

      <Text style={styles.introduction}>
        Daily Stress Monitor is a personal self-monitoring application
        designed to help adults reflect on changes in their estimated
        daily stress level.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          About the application
        </Text>

        <Text style={styles.cardText}>
          The application uses self-reported answers relating to stress,
          anxiety, panic-related symptoms, sleep, workload, energy and
          lifestyle. These responses are combined into an estimated
          stress percentage.
        </Text>
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>
          Important disclaimer
        </Text>

        <Text style={styles.warningText}>
          This application does not diagnose, prevent or treat a medical
          or mental health condition. The score is an estimate created
          from a short self-reported questionnaire and should not be
          interpreted as a clinical assessment.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          How the score works
        </Text>

        <Text style={styles.cardText}>
          Stress, anxiety, panic-related symptoms and workload increase
          the estimated score. Positive factors such as better sleep,
          higher energy and healthier lifestyle responses reduce the
          estimated score.
        </Text>

        <Text style={styles.secondaryText}>
          The scoring model is designed for prototype self-monitoring.
          The percentage and category thresholds have not been clinically
          validated.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Your data and privacy
        </Text>

        <Text style={styles.cardText}>
          On the mobile application, check-in records are stored locally
          on the device using SQLite. In the browser version, records are
          stored using browser local storage.
        </Text>

        <Text style={styles.secondaryText}>
          The application does not currently upload check-in records to a
          cloud database. Data is not automatically shared between
          different devices.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Data retention
        </Text>

        <Text style={styles.cardText}>
          Saved records remain on the device or browser until they are
          removed, the application is uninstalled, the device data is
          cleared or browser storage is deleted.
        </Text>

        <Text style={styles.secondaryText}>
          A future update will provide controls for deleting individual
          entries and clearing the full history from inside the
          application.
        </Text>
      </View>

      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>
          When to seek support
        </Text>

        <Text style={styles.supportText}>
          If you are worried about your wellbeing, experiencing ongoing
          distress or finding daily activities difficult, consider
          contacting a qualified healthcare professional or an
          appropriate support service.
        </Text>

        <Text style={styles.supportText}>
          If you believe that you or another person is in immediate
          danger, contact the appropriate emergency service in your
          location.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Intended users
        </Text>

        <Text style={styles.cardText}>
          This prototype is intended for adults aged 18 and over. It is
          designed for general personal self-monitoring and is not
          intended for clinical decision-making.
        </Text>
      </View>

      <View style={styles.versionCard}>
        <Text style={styles.versionLabel}>
          Daily Stress Monitor
        </Text>

        <Text style={styles.versionText}>
          Prototype version 1.0.0
        </Text>

        <Text style={styles.versionText}>
          Developed using React Native and Expo
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Home')}
        accessibilityRole="button"
        accessibilityLabel="Return to the home dashboard"
      >
        <Text style={styles.primaryButtonText}>
          Return Home
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },

  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 12,
  },

  introduction: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },

  cardText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 23,
  },

  secondaryText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    marginTop: 12,
  },

  warningCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  warningTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#9A3412',
    marginBottom: 10,
  },

  warningText: {
    fontSize: 15,
    color: '#7C2D12',
    lineHeight: 23,
  },

  supportCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  supportTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
  },

  supportText: {
    fontSize: 15,
    color: '#1E40AF',
    lineHeight: 23,
    marginBottom: 10,
  },

  versionCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 18,
    marginBottom: 22,
    alignItems: 'center',
  },

  versionLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },

  versionText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 3,
  },

  primaryButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});