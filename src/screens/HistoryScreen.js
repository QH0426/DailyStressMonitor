import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Frown,
  History,
  Home,
  Meh,
  NotebookText,
  ShieldCheck,
  Smile,
  Trash2,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';
import SectionHeader from '../components/SectionHeader';
import WarmCard from '../components/WarmCard';

import {
  clearStressEntries,
  deleteStressEntry,
  getStressEntries,
} from '../database/database';

import { getStressCategory } from '../services/stressCalculation';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

const moodDetails = {
  'very-good': {
    label: 'Very good',
    Icon: Smile,
    colour: '#5F8F68',
    background: '#EAF4EC',
  },

  good: {
    label: 'Good',
    Icon: Smile,
    colour: Colors.primaryDark,
    background: '#EAF5F2',
  },

  neutral: {
    label: 'Neutral',
    Icon: Meh,
    colour: '#9A7740',
    background: '#FBF4E6',
  },

  low: {
    label: 'Low',
    Icon: Frown,
    colour: '#B56D57',
    background: '#FBEDE8',
  },

  'very-low': {
    label: 'Very low',
    Icon: Frown,
    colour: '#A9574A',
    background: '#F9E7E3',
  },
};

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
      console.error('Unable to load wellbeing journey:', error);

      setErrorMessage(
        'Your saved reflections could not be loaded. Please try again.'
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
    return new Date(dateValue).toLocaleString('en-GB', {
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

    Alert.alert(title, message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: confirmText,
        style: 'destructive',
        onPress: onConfirm,
      },
    ]);
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
      'Remove this reflection?',
      `The ${entry.score}% reflection from ${formatDate(
        entry.date
      )} will be permanently removed.`,
      'Remove',
      () => handleDeleteEntry(entry.id)
    );
  }

  async function handleDeleteEntry(entryId) {
    try {
      setIsDeleting(true);

      await deleteStressEntry(entryId);
      await loadEntries();

      showMessage(
        'Reflection removed',
        'The selected reflection has been removed from your journey.'
      );
    } catch (error) {
      console.error('Unable to delete reflection:', error);

      showMessage(
        'Unable to remove reflection',
        'The selected reflection could not be removed. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function requestClearHistory() {
    confirmAction(
      'Remove your full journey?',
      'Every saved reflection will be permanently removed. This action cannot be undone.',
      'Remove All',
      handleClearHistory
    );
  }

  async function handleClearHistory() {
    try {
      setIsDeleting(true);

      await clearStressEntries();
      await loadEntries();

      showMessage(
        'Journey cleared',
        'All saved reflections have been removed.'
      );
    } catch (error) {
      console.error('Unable to clear journey:', error);

      showMessage(
        'Unable to clear journey',
        'Your saved reflections could not be removed. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <History
            size={32}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />
        </View>

        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text style={styles.loadingText}>
          Preparing your wellbeing journey...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Your Wellbeing Journey"
        description="Every reflection can help you understand how your wellbeing changes over time."
        icon={History}
      />

      {errorMessage ? (
        <WarmCard
          backgroundColor="#FBECE9"
          borderColor="#E7B8AE"
        >
          <Text style={styles.errorTitle}>
            We could not load your reflections
          </Text>

          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

          <AppButton
            title="Try Again"
            onPress={loadEntries}
          />
        </WarmCard>
      ) : null}

      {!errorMessage && entries.length === 0 ? (
        <WarmCard style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <ClipboardCheck
              size={40}
              color={Colors.primary}
              strokeWidth={1.8}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Your journey starts here
          </Text>

          <Text style={styles.emptyText}>
            Complete your first daily reflection to begin building a
            personal record of your mood, notes and wellbeing.
          </Text>

          <AppButton
            title="Start Daily Reflection"
            icon={ClipboardCheck}
            onPress={() => navigation.navigate('CheckIn')}
          />
        </WarmCard>
      ) : null}

      {!errorMessage &&
        entries.map((entry) => {
          const category = getStressCategory(entry.score);
          const mood = moodDetails[entry.mood] || null;
          const MoodIcon = mood?.Icon;

          return (
            <WarmCard
              key={entry.id}
              style={styles.journeyCard}
            >
              <View style={styles.entryHeader}>
                <View style={styles.dateSection}>
                  <View style={styles.dateIcon}>
                    <CalendarDays
                      size={22}
                      color={Colors.primaryDark}
                      strokeWidth={1.9}
                    />
                  </View>

                  <View style={styles.dateTextContainer}>
                    <Text style={styles.dateLabel}>
                      Daily reflection
                    </Text>

                    <Text style={styles.dateText}>
                      {formatDate(entry.date)}
                    </Text>
                  </View>
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

              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: `${category.colour}18`,
                    borderColor: `${category.colour}45`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: category.colour,
                    },
                  ]}
                >
                  {category.label} stress
                </Text>
              </View>

              {mood && MoodIcon ? (
                <View
                  style={[
                    styles.moodCard,
                    {
                      backgroundColor: mood.background,
                      borderColor: `${mood.colour}55`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.moodIcon,
                      {
                        backgroundColor: `${mood.colour}18`,
                      },
                    ]}
                  >
                    <MoodIcon
                      size={30}
                      color={mood.colour}
                      strokeWidth={1.8}
                    />
                  </View>

                  <View style={styles.moodTextContainer}>
                    <Text style={styles.smallLabel}>
                      Mood
                    </Text>

                    <Text
                      style={[
                        styles.moodValue,
                        {
                          color: mood.colour,
                        },
                      ]}
                    >
                      {mood.label}
                    </Text>
                  </View>
                </View>
              ) : null}

              {entry.note ? (
                <View style={styles.noteCard}>
                  <View style={styles.noteHeader}>
                    <NotebookText
                      size={21}
                      color="#8B6D35"
                      strokeWidth={1.9}
                    />

                    <Text style={styles.noteLabel}>
                      Personal reflection
                    </Text>
                  </View>

                  <Text style={styles.noteText}>
                    “{entry.note}”
                  </Text>
                </View>
              ) : null}

              <View style={styles.divider} />

              <Text style={styles.answersHeading}>
                Daily factors
              </Text>

              <View style={styles.answersGrid}>
                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>
                    Stress
                  </Text>

                  <Text style={styles.answerValue}>
                    {entry.stress}/5
                  </Text>
                </View>

                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>
                    Anxiety
                  </Text>

                  <Text style={styles.answerValue}>
                    {entry.anxiety}/5
                  </Text>
                </View>

                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>
                    Panic
                  </Text>

                  <Text style={styles.answerValue}>
                    {entry.panic}/5
                  </Text>
                </View>

                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>
                    Sleep
                  </Text>

                  <Text style={styles.answerValue}>
                    {entry.sleep}/5
                  </Text>
                </View>

                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>
                    Workload
                  </Text>

                  <Text style={styles.answerValue}>
                    {entry.workload}/5
                  </Text>
                </View>

                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>
                    Energy
                  </Text>

                  <Text style={styles.answerValue}>
                    {entry.energy}/5
                  </Text>
                </View>

                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>
                    Lifestyle
                  </Text>

                  <Text style={styles.answerValue}>
                    {entry.lifestyle}/5
                  </Text>
                </View>
              </View>

              <AppButton
                title={
                  isDeleting
                    ? 'Please wait...'
                    : 'Remove This Reflection'
                }
                icon={Trash2}
                variant="danger"
                disabled={isDeleting}
                onPress={() => requestDeleteEntry(entry)}
                accessibilityLabel={`Remove reflection from ${formatDate(
                  entry.date
                )}`}
              />
            </WarmCard>
          );
        })}

      {!errorMessage && entries.length > 0 ? (
        <WarmCard
          backgroundColor="#FFF5F2"
          borderColor="#E8C5BA"
        >
          <View style={styles.dataHeader}>
            <View style={styles.dataIcon}>
              <ShieldCheck
                size={25}
                color="#A05E4B"
                strokeWidth={1.9}
              />
            </View>

            <View style={styles.dataTextContainer}>
              <Text style={styles.dataTitle}>
                Your data controls
              </Text>

              <Text style={styles.dataText}>
                Removing your full journey permanently deletes every
                saved reflection from this device or browser.
              </Text>
            </View>
          </View>

          <AppButton
            title={
              isDeleting
                ? 'Please wait...'
                : 'Remove All Reflections'
            }
            icon={Trash2}
            variant="danger"
            disabled={isDeleting}
            onPress={requestClearHistory}
          />
        </WarmCard>
      ) : null}

      <AppButton
        title="Return to Dashboard"
        icon={Home}
        variant="secondary"
        onPress={() => navigation.navigate('Home')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },

  loadingIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F2EC',
    marginBottom: Spacing.lg,
  },

  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#A05E4B',
    marginBottom: Spacing.sm,
  },

  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: Spacing.md,
  },

  emptyCard: {
    alignItems: 'center',
  },

  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF5F2',
    marginBottom: Spacing.md,
  },

  emptyTitle: {
    fontSize: Typography.heading,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  journeyCard: {
    padding: Spacing.lg,
  },

  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.md,
  },

  dateIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F2EC',
    marginRight: Spacing.md,
  },

  dateTextContainer: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },

  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 21,
  },

  scoreCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },

  scoreText: {
    fontSize: 20,
    fontWeight: '700',
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: Spacing.md,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 17,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },

  moodIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  moodTextContainer: {
    flex: 1,
  },

  smallLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 3,
  },

  moodValue: {
    fontSize: 18,
    fontWeight: '600',
  },

  noteCard: {
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#ECDDBE',
    borderRadius: 17,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },

  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B6D35',
    marginLeft: Spacing.sm,
  },

  noteText: {
    fontSize: 15,
    color: '#6B5432',
    lineHeight: 22,
    fontStyle: 'italic',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },

  answersHeading: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: Spacing.sm,
  },

  answerCard: {
    width: '50%',
    padding: 12,
    borderWidth: 5,
    borderColor: Colors.surface,
    borderRadius: 16,
    backgroundColor: '#F8F4EF',
  },

  answerLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },

  answerValue: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },

  dataHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },

  dataIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7E4DE',
    marginRight: Spacing.md,
  },

  dataTextContainer: {
    flex: 1,
  },

  dataTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A05E4B',
    marginBottom: 5,
  },

  dataText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
});