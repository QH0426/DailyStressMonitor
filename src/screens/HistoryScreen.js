import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
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
import WarmCard from '../components/WarmCard';

import {
  clearStressEntries,
  deleteStressEntry,
  getStressEntries,
} from '../database/database';

import { getStressCategory } from '../services/stressCalculation';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

const historyBackgroundImage =
  require('../../assets/images/pexels-natalie-grishina-62197976-8086416.jpg');

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

const newFactors = [
  {
    key: 'anxiety',
    label: 'Anxiety',
  },
  {
    key: 'panic',
    label: 'Panic / overwhelm',
  },
  {
    key: 'sleep',
    label: 'Sleep',
  },
  {
    key: 'workload',
    label: 'Daily responsibilities',
  },
  {
    key: 'energy',
    label: 'Energy',
  },
];

const oldFactors = [
  {
    key: 'stress',
    label: 'Stress',
  },
  {
    key: 'anxiety',
    label: 'Anxiety',
  },
  {
    key: 'panic',
    label: 'Panic',
  },
  {
    key: 'sleep',
    label: 'Sleep',
  },
  {
    key: 'workload',
    label: 'Workload',
  },
  {
    key: 'energy',
    label: 'Energy',
  },
  {
    key: 'lifestyle',
    label: 'Lifestyle',
  },
];

function getEntryFactors(entry) {
  if (entry.questionnaireVersion === 2) {
    return newFactors;
  }

  return oldFactors.filter(
    (factor) =>
      entry[factor.key] !== undefined &&
      entry[factor.key] !== null
  );
}

export default function HistoryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedEntryId, setExpandedEntryId] =
    useState(null);

  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const storedEntries = await getStressEntries();

      setEntries(storedEntries);
    } catch (error) {
      console.error(
        'Unable to load wellbeing journey:',
        error
      );

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
    return new Date(dateValue).toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  }

  function confirmAction(
    title,
    message,
    confirmText,
    onConfirm
  ) {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `${title}\n\n${message}`
      );

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

      if (expandedEntryId === entryId) {
        setExpandedEntryId(null);
      }

      await loadEntries();

      showMessage(
        'Reflection removed',
        'The selected reflection has been removed from your journey.'
      );
    } catch (error) {
      console.error(
        'Unable to delete reflection:',
        error
      );

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

      setExpandedEntryId(null);

      await loadEntries();

      showMessage(
        'Journey cleared',
        'All saved reflections have been removed.'
      );
    } catch (error) {
      console.error(
        'Unable to clear journey:',
        error
      );

      showMessage(
        'Unable to clear journey',
        'Your saved reflections could not be removed. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleEntry(entryId) {
    setExpandedEntryId(
      expandedEntryId === entryId
        ? null
        : entryId
    );
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
    <ImageBackground
      source={historyBackgroundImage}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
      resizeMode="cover"
    >
      <View style={styles.backgroundOverlay}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>

            {/* Header */}

            <View style={styles.pageHeader}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.pageEyebrow}>
                  YOUR REFLECTIONS
                </Text>

                <Text style={styles.pageTitle}>
                  Your Wellbeing Journey
                </Text>

                <Text style={styles.pageDescription}>
                  Review your saved reflections without
                  needing to open every detail at once.
                </Text>
              </View>

              <View style={styles.headerIcon}>
                <History
                  size={34}
                  color={Colors.primaryDark}
                  strokeWidth={1.8}
                />
              </View>
            </View>

            {/* Error */}

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

            {/* Empty */}

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
                  Complete your first daily reflection to
                  begin building a personal record of your
                  mood, notes and wellbeing.
                </Text>

                <AppButton
                  title="Start Daily Reflection"
                  icon={ClipboardCheck}
                  onPress={() =>
                    navigation.navigate('CheckIn')
                  }
                />
              </WarmCard>
            ) : null}

            {/* Reflections */}

            {!errorMessage &&
              entries.map((entry, index) => {
                const category =
                  getStressCategory(entry.score);

                const mood =
                  moodDetails[entry.mood] || null;

                const MoodIcon = mood?.Icon;

                const factors =
                  getEntryFactors(entry);

                const isExpanded =
                  expandedEntryId === entry.id;

                const cardStyle =
                  index % 3 === 0
                    ? styles.journeyCardSage
                    : index % 3 === 1
                    ? styles.journeyCardBlue
                    : styles.journeyCardWarm;

                return (
                  <View
                    key={entry.id}
                    style={[
                      styles.journeyCard,
                      cardStyle,
                    ]}
                  >
                    <View style={styles.entryTopRow}>
                      <View style={styles.dateSection}>
                        <View style={styles.dateIcon}>
                          <CalendarDays
                            size={20}
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

                      <View style={styles.scoreSection}>
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

                        <View
                          style={[
                            styles.categoryBadge,
                            {
                              backgroundColor:
                                `${category.colour}18`,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.categoryText,
                              {
                                color:
                                  category.colour,
                              },
                            ]}
                          >
                            {category.label}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryBottomRow}>
                      {mood && MoodIcon ? (
                        <View style={styles.compactMood}>
                          <View
                            style={[
                              styles.compactMoodIcon,
                              {
                                backgroundColor:
                                  mood.background,
                              },
                            ]}
                          >
                            <MoodIcon
                              size={22}
                              color={mood.colour}
                              strokeWidth={1.8}
                            />
                          </View>

                          <View>
                            <Text style={styles.smallLabel}>
                              Mood
                            </Text>

                            <Text
                              style={[
                                styles.compactMoodValue,
                                {
                                  color: mood.colour,
                                },
                              ]}
                            >
                              {mood.label}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text style={styles.noMoodText}>
                          No mood recorded
                        </Text>
                      )}

                      <Pressable
                        style={({ pressed }) => [
                          styles.detailsButton,
                          pressed &&
                            styles.detailsButtonPressed,
                        ]}
                        onPress={() =>
                          toggleEntry(entry.id)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={
                          isExpanded
                            ? 'Hide reflection details'
                            : 'View reflection details'
                        }
                      >
                        <Text style={styles.detailsButtonText}>
                          {isExpanded
                            ? 'Hide details'
                            : 'View details'}
                        </Text>

                        {isExpanded ? (
                          <ChevronUp
                            size={18}
                            color={Colors.primaryDark}
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            color={Colors.primaryDark}
                          />
                        )}
                      </Pressable>
                    </View>

                    {/* Expanded section */}

                    {isExpanded ? (
                      <View style={styles.detailsSection}>
                        {entry.note ? (
                          <View style={styles.noteCard}>
                            <View style={styles.noteHeader}>
                              <NotebookText
                                size={20}
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
                        ) : (
                          <View style={styles.noNoteCard}>
                            <NotebookText
                              size={19}
                              color={Colors.textSecondary}
                              strokeWidth={1.8}
                            />

                            <Text style={styles.noNoteText}>
                              No personal note was added to
                              this reflection.
                            </Text>
                          </View>
                        )}

                        <Text style={styles.answersHeading}>
                          Daily factors
                        </Text>

                        <View style={styles.answersGrid}>
                          {factors.map(
                            (factor, factorIndex) => (
                              <View
                                key={factor.key}
                                style={[
                                  styles.answerCard,
                                  factorIndex % 3 === 0
                                    ? styles.answerCardSage
                                    : factorIndex % 3 === 1
                                    ? styles.answerCardBlue
                                    : styles.answerCardWarm,
                                ]}
                              >
                                <Text
                                  style={
                                    styles.answerLabel
                                  }
                                >
                                  {factor.label}
                                </Text>

                                <Text
                                  style={
                                    styles.answerValue
                                  }
                                >
                                  {entry[factor.key]}/5
                                </Text>
                              </View>
                            )
                          )}
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
                          onPress={() =>
                            requestDeleteEntry(entry)
                          }
                          accessibilityLabel={`Remove reflection from ${formatDate(
                            entry.date
                          )}`}
                        />
                      </View>
                    ) : null}
                  </View>
                );
              })}

            {/* Data controls */}

            {!errorMessage &&
            entries.length > 0 ? (
              <View style={styles.dataControlCard}>
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
                      Removing your full journey permanently
                      deletes every saved reflection from your
                      account.
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
              </View>
            ) : null}

            {/* Dashboard */}

            <View style={styles.returnButtonWrapper}>
              <AppButton
                title="Return to Dashboard"
                icon={Home}
                variant="secondary"
                onPress={() =>
                  navigation.navigate('Home')
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },

  backgroundImageStyle: {
    opacity: 1,
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(247,244,239,0.32)',
  },

  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  contentWrapper: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
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

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230,242,237,0.94)',
    borderWidth: 1,
    borderColor: '#C2DDD3',
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  headerTextContainer: {
    flex: 1,
  },

  pageEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.primaryDark,
    marginBottom: 5,
  },

  pageTitle: {
    fontSize: Typography.heading,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },

  pageDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  headerIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderWidth: 1,
    borderColor: '#C7DED6',
    marginLeft: Spacing.lg,
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
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  journeyCardSage: {
    backgroundColor: 'rgba(229,241,234,0.94)',
    borderColor: '#BED8C6',
  },

  journeyCardBlue: {
    backgroundColor: 'rgba(229,239,245,0.94)',
    borderColor: '#C4D9E2',
  },

  journeyCardWarm: {
    backgroundColor: 'rgba(249,239,222,0.94)',
    borderColor: '#E5CFAB',
  },

  entryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.md,
  },

  dateIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220,235,229,0.95)',
    marginRight: Spacing.md,
  },

  dateTextContainer: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },

  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
  },

  scoreSection: {
    alignItems: 'flex-end',
  },

  scoreText: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },

  categoryBadge: {
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(102,125,116,0.18)',
    marginVertical: Spacing.md,
  },

  summaryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  compactMood: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  compactMoodIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },

  smallLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },

  compactMoodValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  noMoodText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: 'rgba(218,235,229,0.92)',
    borderWidth: 1,
    borderColor: '#C5DDD4',
  },

  detailsButtonPressed: {
    opacity: 0.75,
  },

  detailsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginRight: 5,
  },

  detailsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(102,125,116,0.18)',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },

  noteCard: {
    backgroundColor: 'rgba(250,237,212,0.96)',
    borderWidth: 1,
    borderColor: '#E5C99A',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
    fontSize: 14,
    color: '#6B5432',
    lineHeight: 21,
    fontStyle: 'italic',
  },

  noNoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232,240,243,0.94)',
    borderWidth: 1,
    borderColor: '#C9DCE2',
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  noNoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },

  answersHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: Spacing.md,
  },

  answerCard: {
    width: '50%',
    padding: 11,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 14,
  },

  answerCardSage: {
    backgroundColor: 'rgba(220,237,224,0.95)',
  },

  answerCardBlue: {
    backgroundColor: 'rgba(219,234,242,0.95)',
  },

  answerCardWarm: {
    backgroundColor: 'rgba(246,230,201,0.95)',
  },

  answerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 3,
  },

  answerValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },

  dataControlCard: {
    backgroundColor: 'rgba(250,230,224,0.95)',
    borderWidth: 1,
    borderColor: '#DFB7AA',
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
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
    backgroundColor: '#F4D9D0',
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

  returnButtonWrapper: {
    backgroundColor: 'rgba(229,240,236,0.93)',
    borderWidth: 1,
    borderColor: '#C5DDD4',
    borderRadius: 18,
    padding: 6,
  },
});