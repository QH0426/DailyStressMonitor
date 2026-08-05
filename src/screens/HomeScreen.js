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

import {
  ChartLine,
  ClipboardCheck,
  Frown,
  History,
  Info,
  Leaf,
  LockKeyhole,
  Meh,
  NotebookText,
  ShieldCheck,
  Smile,
  Sparkles,
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

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const entries = await getStressEntries();

      setLatestEntry(entries.length > 0 ? entries[0] : null);
      setPreviousEntry(entries.length > 1 ? entries[1] : null);
    } catch (error) {
      console.error('Unable to load dashboard:', error);

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
    const date = new Date(dateValue);

    return date.toLocaleString('en-GB', {
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
        title: 'Your journey is beginning',
        message:
          'Continue completing daily reflections to see how your wellbeing changes over time.',
        colour: Colors.primaryDark,
        background: '#EDF7F5',
      };
    }

    const difference =
      Number(latestEntry.score) - Number(previousEntry.score);

    if (difference <= -5) {
      return {
        title: 'Your stress level has reduced',
        message: `Your latest estimate is ${Math.abs(
          difference
        )}% lower than your previous check-in.`,
        colour: '#54785C',
        background: '#EDF6EF',
      };
    }

    if (difference >= 5) {
      return {
        title: 'Today may feel more demanding',
        message: `Your latest estimate is ${difference}% higher than your previous check-in.`,
        colour: '#A05E4B',
        background: '#FCEFEA',
      };
    }

    return {
      title: 'Your stress level is stable',
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
      <View style={styles.welcomeRow}>
        <View style={styles.leafContainer}>
          <Leaf
            size={27}
            color={Colors.primaryDark}
            strokeWidth={2}
          />
        </View>

        <View style={styles.welcomeTextContainer}>
          <Text style={styles.greeting}>
            {getGreeting()}
          </Text>

          <Text style={styles.welcomeMessage}>
            Take a moment for yourself today.
          </Text>
        </View>
      </View>

      <View style={styles.brandCard}>
        <View style={styles.brandIcon}>
          <Sparkles
            size={25}
            color={Colors.primaryDark}
          />
        </View>

        <View style={styles.brandTextContainer}>
          <Text style={styles.title}>
            Daily Stress Monitor
          </Text>

          <Text style={styles.brandSubtitle}>
            A calm space for reflection and personal wellbeing.
          </Text>
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
            <View style={styles.resultHeader}>
              <View style={styles.resultInformation}>
                <Text style={styles.smallLabel}>
                  Latest stress level
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
                      backgroundColor: `${category.colour}18`,
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

              <View
                style={[
                  styles.scoreCircle,
                  {
                    borderColor: category.colour,
                  },
                ]}
              >
                <Leaf
                  size={27}
                  color={category.colour}
                  strokeWidth={2}
                />

                <Text
                  style={[
                    styles.circleScore,
                    {
                      color: category.colour,
                    },
                  ]}
                >
                  {latestEntry.score}%
                </Text>
              </View>
            </View>

            {mood && MoodIcon ? (
              <View
                style={[
                  styles.contextCard,
                  {
                    backgroundColor: mood.background,
                    borderColor: `${mood.colour}55`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.contextIconContainer,
                    {
                      backgroundColor: `${mood.colour}20`,
                    },
                  ]}
                >
                  <MoodIcon
                    size={32}
                    color={mood.colour}
                    strokeWidth={1.9}
                  />
                </View>

                <View style={styles.contextTextContainer}>
                  <Text style={styles.contextLabel}>
                    Today’s mood
                  </Text>

                  <Text
                    style={[
                      styles.contextValue,
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

            {latestEntry.note ? (
              <View style={styles.reflectionCard}>
                <NotebookText
                  size={22}
                  color="#9A7440"
                  strokeWidth={1.9}
                />

                <View style={styles.reflectionTextContainer}>
                  <Text style={styles.reflectionLabel}>
                    Today’s reflection
                  </Text>

                  <Text
                    style={styles.reflectionText}
                    numberOfLines={4}
                  >
                    “{latestEntry.note}”
                  </Text>
                </View>
              </View>
            ) : null}

            <View style={styles.divider} />

            <Text style={styles.dateLabel}>
              Last reflection
            </Text>

            <Text style={styles.dateText}>
              {formatDate(latestEntry.date)}
            </Text>
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
              Your wellbeing journey starts here
            </Text>

            <Text style={styles.emptyText}>
              Complete your first daily reflection to see your mood,
              stress estimate and personal notes.
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
                  backgroundColor: `${trend.colour}18`,
                },
              ]}
            >
              <Sparkles
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
          onPress={() => navigation.navigate('CheckIn')}
          accessibilityRole="button"
          accessibilityLabel="Start today's daily reflection"
        >
          <View style={styles.primaryActionIcon}>
            <ClipboardCheck
              size={27}
              color={Colors.white}
            />
          </View>

          <Text style={styles.actionTitle}>
            Daily reflection
          </Text>

          <Text style={styles.actionDescription}>
            Record today’s mood and stress factors.
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.pressedCard,
          ]}
          onPress={() => navigation.navigate('History')}
          accessibilityRole="button"
          accessibilityLabel="View saved wellbeing history"
        >
          <View style={styles.secondaryActionIcon}>
            <History
              size={27}
              color={Colors.primaryDark}
            />
          </View>

          <Text style={styles.actionTitle}>
            Your journey
          </Text>

          <Text style={styles.actionDescription}>
            Review previous reflections and notes.
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.pressedCard,
          ]}
          onPress={() => navigation.navigate('Progress')}
          accessibilityRole="button"
          accessibilityLabel="View wellbeing trends and statistics"
        >
          <View style={styles.sageActionIcon}>
            <ChartLine
              size={27}
              color="#54785C"
            />
          </View>

          <Text style={styles.actionTitle}>
            Wellbeing trends
          </Text>

          <Text style={styles.actionDescription}>
            Explore progress, averages and changes.
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.pressedCard,
          ]}
          onPress={() => navigation.navigate('Information')}
          accessibilityRole="button"
          accessibilityLabel="Open information and privacy details"
        >
          <View style={styles.privacyActionIcon}>
            <ShieldCheck
              size={27}
              color="#7A6340"
            />
          </View>

          <Text style={styles.actionTitle}>
            Privacy & safety
          </Text>

          <Text style={styles.actionDescription}>
            Learn how your information is stored.
          </Text>
        </Pressable>
      </View>

      <View style={styles.privacyCard}>
        <LockKeyhole
          size={23}
          color={Colors.primaryDark}
          strokeWidth={1.9}
        />

        <View style={styles.privacyTextContainer}>
          <Text style={styles.privacyTitle}>
            Your reflections stay private
          </Text>

          <Text style={styles.privacyText}>
            Your current records are stored locally on this device or
            browser and are not automatically shared.
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.informationLink}
        onPress={() => navigation.navigate('Information')}
      >
        <Info
          size={18}
          color={Colors.textSecondary}
        />

        <Text style={styles.informationLinkText}>
          Read the full information and privacy statement
        </Text>
      </Pressable>
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

  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  leafContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F2EC',
    marginRight: Spacing.md,
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

  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF5F2',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDECE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  brandTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 5,
  },

  brandSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
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

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultInformation: {
    flex: 1,
    paddingRight: Spacing.md,
  },

  smallLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  score: {
    fontSize: 53,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  categoryText: {
    fontSize: 15,
    fontWeight: '600',
  },

  scoreCircle: {
    width: 105,
    height: 105,
    borderRadius: 53,
    borderWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },

  circleScore: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },

  contextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 17,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },

  contextIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  contextTextContainer: {
    flex: 1,
  },

  contextLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 3,
  },

  contextValue: {
    fontSize: 18,
    fontWeight: '600',
  },

  reflectionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FBF5E8',
    borderWidth: 1,
    borderColor: '#EAD9B4',
    borderRadius: 17,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },

  reflectionTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  reflectionLabel: {
    fontSize: 13,
    color: '#8B6D35',
    marginBottom: 5,
  },

  reflectionText: {
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

  dateLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },

  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
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
    minHeight: 180,
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