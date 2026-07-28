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

export default function HomeScreen({ navigation }) {
  const [latestEntry, setLatestEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadLatestEntry = useCallback(async () => {
    try {
      setIsLoading(true);

      const entries = await getStressEntries();

      if (entries.length > 0) {
        setLatestEntry(entries[0]);
      } else {
        setLatestEntry(null);
      }
    } catch (error) {
      console.error('Unable to load latest stress entry:', error);
      setLatestEntry(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLatestEntry();
    }, [loadLatestEntry])
  );

  function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good morning';
    }

    if (currentHour < 18) {
      return 'Good afternoon';
    }

    return 'Good evening';
  }

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

  const category = latestEntry
    ? getStressCategory(latestEntry.score)
    : null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.greeting}>
        {getGreeting()} 👋
      </Text>

      <Text style={styles.title}>
        Daily Stress Monitor
      </Text>

      <Text style={styles.description}>
        Monitor your daily stress using self-reported anxiety,
        panic and lifestyle indicators.
      </Text>

      <View style={styles.statusCard}>
        <Text style={styles.cardTitle}>
          Latest stress result
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />

            <Text style={styles.loadingText}>
              Loading your latest result...
            </Text>
          </View>
        ) : latestEntry ? (
          <>
            <View style={styles.resultRow}>
              <View>
                <Text
                  style={[
                    styles.score,
                    {
                      color: category.colour,
                    },
                  ]}
                >
                  {latestEntry.score}%
                </Text>

                <Text
                  style={[
                    styles.category,
                    {
                      color: category.colour,
                    },
                  ]}
                >
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
                    styles.circleText,
                    {
                      color: category.colour,
                    },
                  ]}
                >
                  {latestEntry.score}%
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.lastCheckInLabel}>
              Last check-in
            </Text>

            <Text style={styles.lastCheckInDate}>
              {formatDate(latestEntry.date)}
            </Text>
          </>
        ) : (
          <View style={styles.emptyResult}>
            <Text style={styles.emptyIcon}>📋</Text>

            <Text style={styles.emptyTitle}>
              No check-in completed yet
            </Text>

            <Text style={styles.emptyText}>
              Complete your first daily check-in to see your latest
              stress result here.
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        Quick actions
      </Text>

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

      <Pressable
        style={styles.progressButton}
        onPress={() => navigation.navigate('Progress')}
      >
        <Text style={styles.progressButtonText}>
          View Stress Progress
        </Text>
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          About your results
        </Text>

        <Text style={styles.infoText}>
          Your score is an estimate based on your self-reported
          responses. It is intended to support personal monitoring
          and does not provide a medical diagnosis.
        </Text>
      </View>
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

  greeting: {
    fontSize: 18,
    color: '#475569',
    marginTop: 12,
    marginBottom: 6,
  },

  title: {
    fontSize: 31,
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

  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 26,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 26,
  },

  loadingText: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 12,
  },

  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  score: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  category: {
    fontSize: 17,
    fontWeight: '600',
  },

  scoreCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },

  lastCheckInLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },

  lastCheckInDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },

  emptyResult: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 14,
  },

  primaryButton: {
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
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
    marginBottom: 14,
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: 'bold',
  },

  progressButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 12,
  },

  progressButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  infoCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 18,
    marginTop: 24,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 21,
  },
});