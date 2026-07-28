import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { getStressEntries } from '../database/database';
import { getStressCategory } from '../services/stressCalculation';

export default function HistoryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const storedEntries = await getStressEntries();

      setEntries(storedEntries);
    } catch (error) {
      console.error('Unable to load stress history:', error);

      setErrorMessage(
        'Your stress history could not be loaded. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  function formatDate(dateValue) {
    const date = new Date(dateValue);

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (isLoading) {
    return (
      <View style={styles.centreContainer}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={styles.loadingText}>
          Loading your stress history...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Stress History</Text>

      <Text style={styles.description}>
        Review your previous daily check-ins and estimated stress scores.
      </Text>

      {errorMessage ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{errorMessage}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadEntries}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : null}

      {!errorMessage && entries.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📋</Text>

          <Text style={styles.emptyTitle}>
            No check-ins recorded
          </Text>

          <Text style={styles.emptyText}>
            Complete your first daily check-in to see your results here.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Text style={styles.primaryButtonText}>
              Start Daily Check-in
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!errorMessage &&
        entries.map((entry) => {
          const category = getStressCategory(entry.score);

          return (
            <View
              key={entry.id}
              style={styles.historyCard}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    {formatDate(entry.date)}
                  </Text>

                  <Text style={styles.categoryText}>
                    {category.label} stress
                  </Text>
                </View>

                <View
                  style={[
                    styles.scoreCircle,
                    {
                      borderColor: category.colour,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      {
                        color: category.colour,
                      },
                    ]}
                  >
                    {entry.score}%
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.answersGrid}>
                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>Stress</Text>
                  <Text style={styles.answerValue}>
                    {entry.stress}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>Anxiety</Text>
                  <Text style={styles.answerValue}>
                    {entry.anxiety}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>Panic</Text>
                  <Text style={styles.answerValue}>
                    {entry.panic}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>Sleep</Text>
                  <Text style={styles.answerValue}>
                    {entry.sleep}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>Workload</Text>
                  <Text style={styles.answerValue}>
                    {entry.workload}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>Energy</Text>
                  <Text style={styles.answerValue}>
                    {entry.energy}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>Lifestyle</Text>
                  <Text style={styles.answerValue}>
                    {entry.lifestyle}/5
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

      <Pressable
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>Return Home</Text>
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

  centreContainer: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  loadingText: {
    fontSize: 16,
    color: '#475569',
    marginTop: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 23,
    marginBottom: 24,
  },

  historyCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateContainer: {
    flex: 1,
    paddingRight: 14,
  },

  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },

  categoryText: {
    fontSize: 15,
    color: '#64748B',
  },

  scoreCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },

  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  answerItem: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 12,
  },

  answerLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 3,
  },

  answerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  emptyIcon: {
    fontSize: 46,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 22,
  },

  errorCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },

  errorText: {
    color: '#991B1B',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },

  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  primaryButton: {
    minHeight: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  homeButton: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
    marginTop: 8,
  },

  homeButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});