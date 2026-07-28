import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getStressCategory } from '../services/stressCalculation';

export default function ResultScreen({ route, navigation }) {
  const { score } = route.params;
  const category = getStressCategory(score);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Today’s Stress Result</Text>

      <Text style={styles.description}>
        This result is based on your self-reported answers.
      </Text>

      <View style={styles.resultCard}>
        <Text style={styles.scoreLabel}>
          Estimated stress level
        </Text>

        <Text
          style={[
            styles.score,
            {
              color: category.colour,
            },
          ]}
        >
          {score}%
        </Text>

        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: category.colour,
            },
          ]}
        >
          <Text style={styles.categoryText}>
            {category.label}
          </Text>
        </View>

        <Text style={styles.message}>
          {category.message}
        </Text>
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Important</Text>

        <Text style={styles.noticeText}>
          This application is intended for personal self-monitoring
          only. It does not provide a medical diagnosis, treatment or
          professional medical advice.
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.primaryButtonText}>
          View Stress History
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.secondaryButtonText}>
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
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 28,
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  scoreLabel: {
    fontSize: 17,
    color: '#475569',
    marginBottom: 12,
  },

  score: {
    fontSize: 66,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  categoryBadge: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
  },

  categoryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 17,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 25,
  },

  noticeCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 14,
    padding: 18,
    marginTop: 22,
  },

  noticeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#9A3412',
    marginBottom: 8,
  },

  noticeText: {
    fontSize: 15,
    color: '#7C2D12',
    lineHeight: 22,
  },

  primaryButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    marginTop: 24,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  secondaryButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
    marginTop: 14,
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: 'bold',
  },
});