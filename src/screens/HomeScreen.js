import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  ArrowRight,
  ChartLine,
  ClipboardCheck,
  Frown,
  History,
  Info,
  LockKeyhole,
  Meh,
  NotebookText,
  ShieldCheck,
  Smile,
} from 'lucide-react-native';

import { getStressEntries } from '../database/database';
import { getStressCategory } from '../services/stressCalculation';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

const moodDetails = {
  'very-good': {
    label: 'Very good',
    Icon: Smile,
    colour: Colors.success,
    background: '#EDF6EF',
  },

  good: {
    label: 'Good',
    Icon: Smile,
    colour: Colors.primaryDark,
    background: '#EDF7F5',
  },

  neutral: {
    label: 'Neutral',
    Icon: Meh,
    colour: '#A47E3B',
    background: '#FBF5E8',
  },

  low: {
    label: 'Low',
    Icon: Frown,
    colour: Colors.coral,
    background: '#FCEFEA',
  },

  'very-low': {
    label: 'Very low',
    Icon: Frown,
    colour: Colors.danger,
    background: '#FBECE9',
  },
};

export default function HomeScreen({ navigation }) {
  const [latestEntry, setLatestEntry] = useState(null);
  const [previousEntry, setPreviousEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { width } = useWindowDimensions();

  const isWide = width >= 760;

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const entries = await getStressEntries();

      const currentEntries = entries.filter(
        (entry) => entry.questionnaireVersion === 2
      );

      setLatestEntry(
        currentEntries.length > 0 ? currentEntries[0] : null
      );

      setPreviousEntry(
        currentEntries.length > 1 ? currentEntries[1] : null
      );
    } catch (error) {
      console.error(
        'Unable to load dashboard:',
        error
      );

      setLatestEntry(null);
      setPreviousEntry(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
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
    return new Date(dateValue).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getTrendInformation() {
    if (!latestEntry || !previousEntry) {
      return {
        title: 'Your wellbeing journey is beginning',
        message:
          'Continue completing daily reflections to begin seeing changes over time.',
        colour: Colors.primaryDark,
        background: '#EDF7F5',
      };
    }

    const difference =
      Number(latestEntry.score) -
      Number(previousEntry.score);

    if (difference <= -5) {
      return {
        title:
          'Your estimated stress level has reduced',
        message: `Your latest estimate is ${Math.abs(
          difference
        )}% lower than your previous check-in.`,
        colour: '#54785C',
        background: '#EDF6EF',
      };
    }

    if (difference >= 5) {
      return {
        title:
          'Today may feel more demanding',
        message: `Your latest estimate is ${difference}% higher than your previous check-in.`,
        colour: '#A05E4B',
        background: '#FCEFEA',
      };
    }

    return {
      title:
        'Your estimated stress level is stable',
      message:
        'Your latest estimate is similar to your previous check-in.',
      colour: '#8B6D35',
      background: '#FBF5E8',
    };
  }

  const category = latestEntry
    ? getStressCategory(latestEntry.score)
    : null;

  const mood = latestEntry?.mood
    ? moodDetails[latestEntry.mood]
    : null;

  const trend = getTrendInformation();

  const MoodIcon = mood?.Icon;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.greeting}>
              {getGreeting()}
            </Text>

            <Text style={styles.welcomeMessage}>
              Take a moment for yourself today.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.heroCard,
            isWide && styles.heroCardWide,
          ]}
        >
          <View style={styles.heroText}>
            <Text style={styles.heroLabel}>
              DAILY WELLBEING
            </Text>

            <Text style={styles.heroTitle}>
              Daily Stress Monitor
            </Text>

            <Text style={styles.heroDescription}>
              A calm space to pause, reflect and understand
              your daily wellbeing.
            </Text>

            <View style={styles.calmPrompt}>
              <View style={styles.calmPromptTextContainer}>
                <Text style={styles.calmPromptTitle}>
                  Pause for a moment.
                </Text>

                <View style={styles.calmPromptSecondRow}>
                  <Text style={styles.calmPromptText}>
                    Imagine a place where you feel calm.
                  </Text>

                  <ArrowRight
                    size={20}
                    color={Colors.primaryDark}
                    strokeWidth={1.8}
                  />
                </View>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.heroButton,
                pressed && styles.pressedButton,
              ]}
              onPress={() =>
                navigation.navigate('CheckIn')
              }
              accessibilityRole="button"
              accessibilityLabel="Start today's reflection"
            >
              <Text style={styles.heroButtonText}>
                Start Today’s Reflection
              </Text>

              <ArrowRight
                size={21}
                color={Colors.white}
              />
            </Pressable>
          </View>

          <View style={styles.heroImageContainer}>
            <Image
              source={require('../../assets/nature-calm.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <Text style={styles.sectionHeading}>
          Today’s wellbeing
        </Text>

        <View style={styles.wellbeingCard}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={Colors.primary}
              />

              <Text style={styles.loadingText}>
                Preparing your latest summary...
              </Text>
            </View>
          ) : latestEntry ? (
            <>
              <View style={styles.resultRow}>
                <View style={styles.scoreSection}>
                  <Text style={styles.smallLabel}>
                    Latest estimate
                  </Text>

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
                          color: category.colour,
                        },
                      ]}
                    >
                      {category.label} stress
                    </Text>
                  </View>
                </View>

                <View style={styles.resultDivider} />

                <View style={styles.moodSection}>
                  {mood && MoodIcon ? (
                    <>
                      <View
                        style={[
                          styles.dashboardMoodIcon,
                          {
                            backgroundColor:
                              mood.background,
                          },
                        ]}
                      >
                        <MoodIcon
                          size={36}
                          color={mood.colour}
                          strokeWidth={1.8}
                        />
                      </View>

                      <Text style={styles.smallLabel}>
                        Mood
                      </Text>

                      <Text
                        style={[
                          styles.dashboardMoodText,
                          {
                            color: mood.colour,
                          },
                        ]}
                      >
                        {mood.label}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.emptyMoodText}>
                      Mood information will appear here.
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.latestDateRow}>
                <NotebookText
                  size={18}
                  color="#8B6D35"
                />

                <Text style={styles.latestDateText}>
                  Last check-in:{' '}
                  {formatDate(latestEntry.date)}
                </Text>
              </View>

              {latestEntry.note ? (
                <View style={styles.reflectionCard}>
                  <NotebookText
                    size={21}
                    color="#9A7440"
                  />

                  <Text
                    style={styles.reflectionText}
                    numberOfLines={2}
                  >
                    “{latestEntry.note}”
                  </Text>
                </View>
              ) : null}
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <ClipboardCheck
                  size={38}
                  color={Colors.primary}
                  strokeWidth={1.8}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Your updated wellbeing journey starts here
              </Text>

              <Text style={styles.emptyText}>
                Complete your five-question daily reflection
                to see your estimated stress level and mood.
              </Text>
            </View>
          )}
        </View>

        {!isLoading && latestEntry ? (
          <>
            <Text style={styles.sectionHeading}>
              Today’s insight
            </Text>

            <View
              style={[
                styles.insightCard,
                {
                  backgroundColor: trend.background,
                  borderColor: `${trend.colour}55`,
                },
              ]}
            >
              <View
                style={[
                  styles.insightIcon,
                  {
                    backgroundColor:
                      `${trend.colour}18`,
                  },
                ]}
              >
                <ChartLine
                  size={25}
                  color={trend.colour}
                />
              </View>

              <View style={styles.insightTextContainer}>
                <Text
                  style={[
                    styles.insightTitle,
                    {
                      color: trend.colour,
                    },
                  ]}
                >
                  {trend.title}
                </Text>

                <Text style={styles.insightMessage}>
                  {trend.message}
                </Text>
              </View>
            </View>
          </>
        ) : null}

        <Text style={styles.sectionHeading}>
          Quick actions
        </Text>

        <View style={styles.actionsGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressedCard,
            ]}
            onPress={() =>
              navigation.navigate('CheckIn')
            }
          >
            <View style={styles.primaryActionIcon}>
              <ClipboardCheck
                size={27}
                color={Colors.white}
              />
            </View>

            <Text style={styles.actionTitle}>
              Reflection
            </Text>

            <Text style={styles.actionDescription}>
              Start today’s check-in.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressedCard,
            ]}
            onPress={() =>
              navigation.navigate('History')
            }
          >
            <View style={styles.secondaryActionIcon}>
              <History
                size={27}
                color={Colors.primaryDark}
              />
            </View>

            <Text style={styles.actionTitle}>
              Journey
            </Text>

            <Text style={styles.actionDescription}>
              Review your reflections.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressedCard,
            ]}
            onPress={() =>
              navigation.navigate('Progress')
            }
          >
            <View style={styles.sageActionIcon}>
              <ChartLine
                size={27}
                color="#54785C"
              />
            </View>

            <Text style={styles.actionTitle}>
              Trends
            </Text>

            <Text style={styles.actionDescription}>
              Explore your progress.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressedCard,
            ]}
            onPress={() =>
              navigation.navigate('Information')
            }
          >
            <View style={styles.privacyActionIcon}>
              <ShieldCheck
                size={27}
                color="#7A6340"
              />
            </View>

            <Text style={styles.actionTitle}>
              Privacy
            </Text>

            <Text style={styles.actionDescription}>
              Learn how your data is protected.
            </Text>
          </Pressable>
        </View>

        <View style={styles.privacyCard}>
          <LockKeyhole
            size={24}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />

          <View style={styles.privacyTextContainer}>
            <Text style={styles.privacyTitle}>
              Your reflections stay private
            </Text>

            <Text style={styles.privacyText}>
              Your reflections are stored securely in your
              authenticated account and are not automatically
              shared with other users.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.informationLink}
          onPress={() =>
            navigation.navigate('Information')
          }
        >
          <Info
            size={18}
            color={Colors.textSecondary}
          />

          <Text style={styles.informationLinkText}>
            Read the full information and privacy statement
          </Text>
        </Pressable>
      </View>
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

  contentWrapper: {
    width: '100%',
    maxWidth: 1500,
    alignSelf: 'center',
  },

  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  welcomeTextContainer: {
    flex: 1,
  },

  greeting: {
    fontSize: Typography.heading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },

  welcomeMessage: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  heroCard: {
    backgroundColor: '#F3F5EA',
    borderWidth: 1,
    borderColor: '#DCE5D5',
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },

  heroCardWide: {
    flexDirection: 'row',
  },

  heroText: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },

  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },

  heroDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    maxWidth: 430,
    marginBottom: Spacing.md,
  },

  calmPrompt: {
    maxWidth: 430,
    marginBottom: Spacing.lg,
    paddingVertical: 4,
  },

  calmPromptTextContainer: {
    flex: 1,
  },

  calmPromptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  calmPromptSecondRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  calmPromptText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginRight: 8,
  },

  heroButton: {
    alignSelf: 'flex-start',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 26,
    paddingHorizontal: 22,
    gap: 10,
  },

  heroButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  pressedButton: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  heroImageContainer: {
    flex: 1,
    minHeight: 290,
    position: 'relative',
    overflow: 'hidden',
  },

  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  sectionHeading: {
    fontSize: Typography.subheading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  wellbeingCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },

  loadingText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },

  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 850,
    width: '100%',
    alignSelf: 'center',
  },

  scoreSection: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
  },

  moodSection: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
  },

  resultDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.border,
  },

  smallLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },

  score: {
    fontSize: 42,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },

  categoryBadge: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 17,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  dashboardMoodIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  dashboardMoodText: {
    fontSize: 18,
    fontWeight: '600',
  },

  emptyMoodText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  latestDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },

  latestDateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },

  reflectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF5E8',
    borderWidth: 1,
    borderColor: '#EAD9B4',
    borderRadius: 15,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },

  reflectionText: {
    flex: 1,
    fontSize: 13,
    color: '#6B5432',
    lineHeight: 19,
    fontStyle: 'italic',
    marginLeft: Spacing.sm,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },

  emptyIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF5F2',
    marginBottom: Spacing.md,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  insightTextContainer: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5,
  },

  insightMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: Spacing.lg,
  },

  actionCard: {
    width: '50%',
    padding: 16,
    borderWidth: 6,
    borderColor: Colors.background,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    minHeight: 150,
    ...Shadows.card,
  },

  pressedCard: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  primaryActionIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginBottom: Spacing.md,
  },

  secondaryActionIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F0EC',
    marginBottom: Spacing.md,
  },

  sageActionIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2E9',
    marginBottom: Spacing.md,
  },

  privacyActionIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7EFDD',
    marginBottom: Spacing.md,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },

  actionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EDF5F2',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 18,
    padding: Spacing.lg,
  },

  privacyTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 5,
  },

  privacyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  informationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },

  informationLinkText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    textAlign: 'center',
  },
});