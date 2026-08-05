import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  clearStressEntries,
  deleteStressEntry,
  getStressEntries,
} from '../database/database';

import { getStressCategory } from '../services/stressCalculation';

export default function HistoryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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

  function confirmAction(title, message, confirmText, onConfirm) {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${title}\n\n${message}`);

      if (confirmed) {
        onConfirm();
      }

      return;
    }

    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: confirmText,
          style: 'destructive',
          onPress: onConfirm,
        },
      ]
    );
  }

  function showMessage(title, message) {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  }

  function requestDeleteEntry(entry) {
    confirmAction(
      'Delete this check-in?',
      `The ${entry.score}% result from ${formatDate(
        entry.date
      )} will be permanently removed.`,
      'Delete',
      () => handleDeleteEntry(entry.id)
    );
  }

  async function handleDeleteEntry(entryId) {
    try {
      setIsDeleting(true);

      await deleteStressEntry(entryId);
      await loadEntries();

      showMessage(
        'Check-in deleted',
        'The selected check-in has been removed from your history.'
      );
    } catch (error) {
      console.error('Unable to delete stress entry:', error);

      showMessage(
        'Deletion failed',
        'The selected check-in could not be deleted. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function requestClearHistory() {
    confirmAction(
      'Delete all stress history?',
      'Every saved check-in will be permanently removed. This action cannot be undone.',
      'Delete All',
      handleClearHistory
    );
  }

  async function handleClearHistory() {
    try {
      setIsDeleting(true);

      await clearStressEntries();
      await loadEntries();

      showMessage(
        'History cleared',
        'All saved stress check-ins have been removed.'
      );
    } catch (error) {
      console.error('Unable to clear stress history:', error);

      showMessage(
        'Deletion failed',
        'Your stress history could not be cleared. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
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
        Review and manage your previous daily check-ins.
      </Text>

      {errorMessage ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadEntries}
          >
            <Text style={styles.retryButtonText}>
              Try Again
            </Text>
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
            Complete a daily check-in to see your results here.
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

                  <Text
                    style={[
                      styles.categoryText,
                      { color: category.colour },
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
                  <Text style={styles.answerLabel}>
                    Stress
                  </Text>
                  <Text style={styles.answerValue}>
                    {entry.stress}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>
                    Anxiety
                  </Text>
                  <Text style={styles.answerValue}>
                    {entry.anxiety}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>
                    Panic
                  </Text>
                  <Text style={styles.answerValue}>
                    {entry.panic}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>
                    Sleep
                  </Text>
                  <Text style={styles.answerValue}>
                    {entry.sleep}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>
                    Workload
                  </Text>
                  <Text style={styles.answerValue}>
                    {entry.workload}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>
                    Energy
                  </Text>
                  <Text style={styles.answerValue}>
                    {entry.energy}/5
                  </Text>
                </View>

                <View style={styles.answerItem}>
                  <Text style={styles.answerLabel}>
                    Lifestyle
                  </Text>
                  <Text style={styles.answerValue}>
                    {entry.lifestyle}/5
                  </Text>
                </View>
              </View>

              <Pressable
                style={[
                  styles.deleteEntryButton,
                  isDeleting && styles.disabledButton,
                ]}
                onPress={() => requestDeleteEntry(entry)}
                disabled={isDeleting}
                accessibilityRole="button"
                accessibilityLabel={`Delete check-in from ${formatDate(
                  entry.date
                )}`}
              >
                <Text style={styles.deleteEntryButtonText}>
                  Delete This Check-in
                </Text>
              </Pressable>
            </View>
          );
        })}

      {!errorMessage && entries.length > 0 ? (
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>
            Data controls
          </Text>

          <Text style={styles.dangerText}>
            Clearing your history permanently removes every saved
            check-in from this device or browser.
          </Text>

          <Pressable
            style={[
              styles.clearHistoryButton,
              isDeleting && styles.disabledButton,
            ]}
            onPress={requestClearHistory}
            disabled={isDeleting}
            accessibilityRole="button"
            accessibilityLabel="Delete all saved stress history"
          >
            <Text style={styles.clearHistoryButtonText}>
              {isDeleting
                ? 'Please wait...'
                : 'Delete All History'}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>
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
    fontWeight: '600',
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

  deleteEntryButton: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FB923C',
    borderRadius: 11,
    marginTop: 8,
  },

  deleteEntryButtonText: {
    color: '#C2410C',
    fontSize: 15,
    fontWeight: 'bold',
  },

  dangerCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },

  dangerTitle: {
    color: '#991B1B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  dangerText: {
    color: '#7F1D1D',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },

  clearHistoryButton: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 11,
  },

  clearHistoryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  disabledButton: {
    opacity: 0.55,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
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
  },

  homeButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});