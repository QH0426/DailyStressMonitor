import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ImageBackground,
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
  ClipboardList,
  Frown,
  Heart,
  History,
  Info,
  LockKeyhole,
  Meh,
  MoonStar,
  NotebookText,
  ShieldCheck,
  Smile,
  TriangleAlert,
  Waves,
} from 'lucide-react-native';

import { getStressEntries } from '../database/database';
import { getStressCategory } from '../services/stressCalculation';
import { analyseRecentPatterns } from '../services/patternAnalysis';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

const homeBackgroundImage =
  require('../../assets/images/pexels-bosichong-28616279.jpg');

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

function getPatternAppearance(pattern) {
  if (!pattern) {
    return {
      Icon: ChartLine,
      label: 'RECENT PATTERN',
      colour: Colors.primaryDark,
      background: 'rgba(237,245,242,0.92)',
      border: '#D2E5DF',
      iconBackground: '#DDECE5',
    };
  }

  if (pattern.type === 'warning') {
    return {
      Icon: TriangleAlert,
      label: 'EARLY WARNING',
      colour: '#A05E4B',
      background: 'rgba(255,244,240,0.92)',
      border: '#E8C5BA',
      iconBackground: '#F7E4DE',
    };
  }

  if (pattern.factor === 'sleep') {
    return {
      Icon: MoonStar,
      label: 'RECENT PATTERN',
      colour: '#7B6B94',
      background: 'rgba(245,241,248,0.92)',
      border: '#DCD2E6',
      iconBackground: '#EAE2F0',
    };
  }

  if (pattern.factor === 'workload') {
    return {
      Icon: ClipboardList,
      label: 'RECENT PATTERN',
      colour: '#8B6D35',
      background: 'rgba(251,245,232,0.92)',
      border: '#EAD9B4',
      iconBackground: '#F4E8CB',
    };
  }

  if (pattern.factor === 'anxiety') {
    return {
      Icon: Waves,
      label: 'RECENT PATTERN',
      colour: '#8B6658',
      background: 'rgba(249,240,236,0.92)',
      border: '#E6CEC4',
      iconBackground: '#F0DDD5',
    };
  }

  if (pattern.type === 'building') {
    return {
      Icon: ChartLine,
      label: 'BUILDING YOUR PATTERN',
      colour: Colors.primaryDark,
      background: 'rgba(237,245,242,0.92)',
      border: '#D2E5DF',
      iconBackground: '#DDECE5',
    };
  }

  return {
    Icon: ChartLine,
    label: 'RECENT PATTERN',
    colour: '#54785C',
    background: 'rgba(241,247,242,0.92)',
    border: '#CFE0D1',
    iconBackground: '#E2EEE4',
  };
}

export default function HomeScreen({ navigation }) {
  const [latestEntry, setLatestEntry] = useState(null);
  const [previousEntry, setPreviousEntry] = useState(null);
  const [allEntries, setAllEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { width } = useWindowDimensions();

  const isWide = width >= 850;

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const entries = await getStressEntries();

      const currentEntries = entries.filter(
        (entry) => entry.questionnaireVersion === 2
      );

      setAllEntries(currentEntries);

      setLatestEntry(
        currentEntries.length > 0
          ? currentEntries[0]
          : null
      );

      setPreviousEntry(
        currentEntries.length > 1
          ? currentEntries[1]
          : null
      );
    } catch (error) {
      console.error(
        'Unable to load dashboard:',
        error
      );

      setLatestEntry(null);
      setPreviousEntry(null);
      setAllEntries([]);
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

  function getTrendInformation() {
    if (!latestEntry || !previousEntry) {
      return {
        title: 'Your wellbeing journey is beginning',
        message:
          'Continue completing daily reflections to begin seeing changes over time.',
        colour: Colors.primaryDark,
        background: 'rgba(237,247,245,0.92)',
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
        background: 'rgba(237,246,239,0.92)',
      };
    }

    if (difference >= 5) {
      return {
        title:
          'Today may feel more demanding',
        message: `Your latest estimate is ${difference}% higher than your previous check-in.`,
        colour: '#A05E4B',
        background: 'rgba(252,239,234,0.92)',
      };
    }

    return {
      title:
        'Your estimated stress level is stable',
      message:
        'Your latest estimate is similar to your previous check-in.',
      colour: '#8B6D35',
      background: 'rgba(251,245,232,0.92)',
    };
  }

  const category = latestEntry
    ? getStressCategory(latestEntry.score)
    : null;

  const mood = latestEntry?.mood
    ? moodDetails[latestEntry.mood]
    : null;

  const trend = getTrendInformation();

  const recentPattern =
    analyseRecentPatterns(allEntries);

  const patternAppearance =
    getPatternAppearance(recentPattern);

  const PatternIcon =
    patternAppearance.Icon;

  const MoodIcon = mood?.Icon;

  return (
    <ImageBackground
      source={homeBackgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.backgroundOverlay}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>

            {/* Welcome */}

            <View style={styles.welcomePanel}>
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
            </View>

            {/* Hero */}

            <View
              style={[
                styles.heroCard,
                isWide && styles.heroCardWide,
              ]}
            >
              <View
                style={[
                  styles.heroText,
                  isWide && styles.heroTextWide,
                ]}
              >
                <View style={styles.heroBadge}>
                  <Heart
                    size={15}
                    color={Colors.primaryDark}
                    strokeWidth={1.8}
                  />

                  <Text style={styles.heroLabel}>
                    DAILY WELLBEING
                  </Text>
                </View>

                <Text style={styles.heroTitle}>
                  Pause. Reflect. Understand.
                </Text>

                <Text style={styles.heroDescription}>
                  A private space to check in with yourself,
                  understand your daily stress and notice
                  changes in your wellbeing over time.
                </Text>

                <View style={styles.calmPrompt}>
                  <Text style={styles.calmPromptTitle}>
                    A moment for you
                  </Text>

                  <Text style={styles.calmPromptText}>
                    Slow down for a moment and notice how
                    you are feeling today.
                  </Text>
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
                    size={20}
                    color={Colors.white}
                    strokeWidth={2}
                  />
                </Pressable>
              </View>

              <View
                style={[
                  styles.heroImageContainer,
                  isWide && styles.heroImageContainerWide,
                ]}
              >
                <Image
                  source={require('../../assets/images/pexels-vie-studio-7006364.jpg')}
                  style={styles.heroImage}
                  resizeMode="cover"
                />

                <View style={styles.heroImageOverlay} />

                <View style={styles.imageMessage}>
                  <Text style={styles.imageMessageSmall}>
                    TODAY’S REMINDER
                  </Text>

                  <Text style={styles.imageMessageMain}>
                    Give yourself permission to pause.
                  </Text>
                </View>
              </View>
            </View>

            {/* Today's wellbeing */}

            <View style={styles.sectionLabelPanel}>
              <Text style={styles.sectionHeading}>
                Today’s wellbeing
              </Text>

              <Text style={styles.sectionSubtitle}>
                Your latest personal check-in.
              </Text>
            </View>

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
                  <View
                    style={[
                      styles.resultRow,
                      !isWide && styles.resultRowMobile,
                    ]}
                  >
                    <View style={styles.scoreSection}>
                      <View style={styles.scoreLabelRow}>
                        <View style={styles.scoreDot} />

                        <Text style={styles.smallLabel}>
                          Latest stress estimate
                        </Text>
                      </View>

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

                      <Text style={styles.scoreHelpText}>
                        This estimate is based on your latest
                        daily reflection.
                      </Text>
                    </View>

                    {isWide ? (
                      <View style={styles.resultDivider} />
                    ) : (
                      <View style={styles.resultDividerMobile} />
                    )}

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
                              size={38}
                              color={mood.colour}
                              strokeWidth={1.8}
                            />
                          </View>

                          <Text style={styles.smallLabel}>
                            Today’s mood
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

                          <Text style={styles.moodHelpText}>
                            Your mood adds personal context
                            to today’s reflection.
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
                      strokeWidth={1.8}
                    />

                    <Text style={styles.latestDateText}>
                      Last check-in:{' '}
                      {formatDate(latestEntry.date)}
                    </Text>
                  </View>

                  {latestEntry.note ? (
                    <View style={styles.reflectionCard}>
                      <View style={styles.reflectionIcon}>
                        <NotebookText
                          size={21}
                          color="#8B6D35"
                          strokeWidth={1.8}
                        />
                      </View>

                      <View style={styles.reflectionTextContainer}>
                        <Text style={styles.reflectionLabel}>
                          Your reflection
                        </Text>

                        <Text
                          style={styles.reflectionText}
                          numberOfLines={3}
                        >
                          “{latestEntry.note}”
                        </Text>
                      </View>
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
                    Your wellbeing journey starts here
                  </Text>

                  <Text style={styles.emptyText}>
                    Complete your five-question daily reflection
                    to see your estimated stress level and mood.
                  </Text>

                  <Pressable
                    style={({ pressed }) => [
                      styles.emptyButton,
                      pressed && styles.pressedButton,
                    ]}
                    onPress={() =>
                      navigation.navigate('CheckIn')
                    }
                  >
                    <Text style={styles.emptyButtonText}>
                      Begin your first reflection
                    </Text>

                    <ArrowRight
                      size={18}
                      color={Colors.white}
                    />
                  </Pressable>
                </View>
              )}
            </View>

            {!isLoading && latestEntry ? (
              <>
                <View style={styles.sectionLabelPanel}>
                  <Text style={styles.sectionHeading}>
                    Today’s insight
                  </Text>
                </View>

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
                      strokeWidth={1.9}
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

                <View style={styles.sectionLabelPanel}>
                  <Text style={styles.sectionHeading}>
                    Recent wellbeing pattern
                  </Text>

                  <Text style={styles.sectionSubtitle}>
                    Based on your recent daily reflections.
                  </Text>
                </View>

                <View
                  style={[
                    styles.patternCard,
                    {
                      backgroundColor:
                        patternAppearance.background,
                      borderColor:
                        patternAppearance.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.patternIcon,
                      {
                        backgroundColor:
                          patternAppearance.iconBackground,
                      },
                    ]}
                  >
                    <PatternIcon
                      size={26}
                      color={patternAppearance.colour}
                      strokeWidth={1.9}
                    />
                  </View>

                  <View style={styles.patternTextContainer}>
                    <Text
                      style={[
                        styles.patternLabel,
                        {
                          color:
                            patternAppearance.colour,
                        },
                      ]}
                    >
                      {patternAppearance.label}
                    </Text>

                    <Text
                      style={[
                        styles.patternTitle,
                        {
                          color:
                            patternAppearance.colour,
                        },
                      ]}
                    >
                      {recentPattern.title}
                    </Text>

                    <Text style={styles.patternMessage}>
                      {recentPattern.message}
                    </Text>

                    {recentPattern.type === 'warning' ? (
                      <Text style={styles.patternSafetyNote}>
                        This is a reflection-based pattern, not
                        a medical warning or diagnosis.
                      </Text>
                    ) : null}
                  </View>
                </View>
              </>
            ) : null}

            {/* Quick actions */}

            <View style={styles.sectionLabelPanel}>
              <Text style={styles.sectionHeading}>
                Quick actions
              </Text>

              <Text style={styles.sectionSubtitle}>
                Continue your wellbeing journey.
              </Text>
            </View>

            <View style={styles.actionsGrid}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  styles.actionCardTeal,
                  isWide && styles.actionCardWide,
                  pressed && styles.pressedCard,
                ]}
                onPress={() =>
                  navigation.navigate('CheckIn')
                }
              >
                <View style={styles.primaryActionIcon}>
                  <ClipboardCheck
                    size={25}
                    color={Colors.white}
                  />
                </View>

                <Text style={styles.actionTitle}>
                  Reflection
                </Text>

                <Text style={styles.actionDescription}>
                  Start today’s check-in.
                </Text>

                <ArrowRight
                  size={18}
                  color={Colors.primaryDark}
                  style={styles.actionArrow}
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  styles.actionCardBlue,
                  isWide && styles.actionCardWide,
                  pressed && styles.pressedCard,
                ]}
                onPress={() =>
                  navigation.navigate('History')
                }
              >
                <View style={styles.secondaryActionIcon}>
                  <History
                    size={25}
                    color={Colors.primaryDark}
                  />
                </View>

                <Text style={styles.actionTitle}>
                  Journey
                </Text>

                <Text style={styles.actionDescription}>
                  Review your reflections.
                </Text>

                <ArrowRight
                  size={18}
                  color={Colors.primaryDark}
                  style={styles.actionArrow}
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  styles.actionCardSage,
                  isWide && styles.actionCardWide,
                  pressed && styles.pressedCard,
                ]}
                onPress={() =>
                  navigation.navigate('Progress')
                }
              >
                <View style={styles.sageActionIcon}>
                  <ChartLine
                    size={25}
                    color="#54785C"
                  />
                </View>

                <Text style={styles.actionTitle}>
                  Trends
                </Text>

                <Text style={styles.actionDescription}>
                  Explore your progress.
                </Text>

                <ArrowRight
                  size={18}
                  color={Colors.primaryDark}
                  style={styles.actionArrow}
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  styles.actionCardWarm,
                  isWide && styles.actionCardWide,
                  pressed && styles.pressedCard,
                ]}
                onPress={() =>
                  navigation.navigate('Information')
                }
              >
                <View style={styles.privacyActionIcon}>
                  <ShieldCheck
                    size={25}
                    color="#7A6340"
                  />
                </View>

                <Text style={styles.actionTitle}>
                  Privacy
                </Text>

                <Text style={styles.actionDescription}>
                  Learn how your data is protected.
                </Text>

                <ArrowRight
                  size={18}
                  color={Colors.primaryDark}
                  style={styles.actionArrow}
                />
              </Pressable>
            </View>

            {/* Privacy */}

            <View style={styles.privacyCard}>
              <View style={styles.privacyIconContainer}>
                <LockKeyhole
                  size={24}
                  color={Colors.primaryDark}
                  strokeWidth={1.9}
                />
              </View>

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
                color="#29473D"
              />

              <Text style={styles.informationLinkText}>
                Read the full information and privacy statement
              </Text>
            </Pressable>
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

  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(247,244,239,0.34)',
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
    maxWidth: 1380,
    alignSelf: 'center',
  },

  welcomePanel: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(236,244,239,0.90)',
    borderWidth: 1,
    borderColor: 'rgba(210,229,223,0.95)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeTextContainer: {
    flex: 1,
  },

  greeting: {
    fontSize: Typography.heading,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },

  welcomeMessage: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  heroCard: {
    backgroundColor: 'rgba(244,239,232,0.91)',
    borderWidth: 1,
    borderColor: 'rgba(230,222,211,0.95)',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },

  heroCardWide: {
    flexDirection: 'row',
    minHeight: 390,
  },

  heroText: {
    padding: Spacing.xl,
    justifyContent: 'center',
  },

  heroTextWide: {
    width: '52%',
    paddingHorizontal: 42,
    paddingVertical: 38,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F0E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: Spacing.md,
  },

  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.primaryDark,
    marginLeft: 7,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#29473D',
    lineHeight: 42,
    marginBottom: Spacing.md,
  },

  heroDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    maxWidth: 500,
    marginBottom: Spacing.lg,
  },

  calmPrompt: {
    backgroundColor: 'rgba(233,242,236,0.85)',
    borderWidth: 1,
    borderColor: '#D5E4DC',
    borderRadius: 17,
    padding: Spacing.md,
    maxWidth: 470,
    marginBottom: Spacing.lg,
  },

  calmPromptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  calmPromptText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
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
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },

  heroImageContainer: {
    minHeight: 330,
    position: 'relative',
    overflow: 'hidden',
  },

  heroImageContainerWide: {
    width: '48%',
    minHeight: 390,
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(90,71,52,0.06)',
  },

  imageMessage: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 22,
    backgroundColor: 'rgba(248,244,233,0.90)',
    borderRadius: 18,
    padding: Spacing.md,
  },

  imageMessageSmall: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#8B6D35',
    marginBottom: 4,
  },

  imageMessageMain: {
    fontSize: 15,
    fontWeight: '600',
    color: '#51483D',
  },

  sectionLabelPanel: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(236,244,239,0.90)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(210,229,223,0.90)',
  },

  sectionHeading: {
    fontSize: Typography.subheading,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  wellbeingCard: {
    backgroundColor: 'rgba(232,241,244,0.90)',
    borderWidth: 1,
    borderColor: 'rgba(200,219,226,0.95)',
    borderRadius: 26,
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
    alignItems: 'stretch',
    maxWidth: 980,
    width: '100%',
    alignSelf: 'center',
  },

  resultRowMobile: {
    flexDirection: 'column',
  },

  scoreSection: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },

  moodSection: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },

  resultDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#C9DBDF',
  },

  resultDividerMobile: {
    height: 1,
    width: '100%',
    backgroundColor: '#C9DBDF',
  },

  scoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  scoreDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 7,
  },

  smallLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 5,
  },

  score: {
    fontSize: 54,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },

  categoryBadge: {
    alignSelf: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  scoreHelpText: {
    maxWidth: 290,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: Spacing.md,
  },

  dashboardMoodIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },

  dashboardMoodText: {
    fontSize: 19,
    fontWeight: '600',
  },

  moodHelpText: {
    maxWidth: 290,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: Spacing.md,
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
    borderTopColor: '#C9DBDF',
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
    alignItems: 'flex-start',
    backgroundColor: 'rgba(250,240,229,0.92)',
    borderWidth: 1,
    borderColor: '#E8D1B6',
    borderRadius: 17,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },

  reflectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4E8CB',
  },

  reflectionTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  reflectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B6D35',
    marginBottom: 4,
  },

  reflectionText: {
    fontSize: 13,
    color: '#6B5432',
    lineHeight: 19,
    fontStyle: 'italic',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },

  emptyIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
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
    maxWidth: 480,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: Spacing.lg,
    gap: 8,
  },

  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },

  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },

  insightIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
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

  patternCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },

  patternIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  patternTextContainer: {
    flex: 1,
  },

  patternLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
  },

  patternTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  patternMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  patternSafetyNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
    marginTop: 8,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: Spacing.lg,
  },

  actionCard: {
    width: '50%',
    padding: 17,
    borderWidth: 6,
    borderColor: 'rgba(247,244,239,0.45)',
    borderRadius: 24,
    minHeight: 165,
    position: 'relative',
    ...Shadows.card,
  },

  actionCardTeal: {
    backgroundColor: 'rgba(228,241,238,0.92)',
  },

  actionCardBlue: {
    backgroundColor: 'rgba(230,239,246,0.92)',
  },

  actionCardSage: {
    backgroundColor: 'rgba(234,242,233,0.92)',
  },

  actionCardWarm: {
    backgroundColor: 'rgba(248,239,225,0.92)',
  },

  actionCardWide: {
    width: '25%',
  },

  pressedCard: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },

  primaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginBottom: Spacing.md,
  },

  secondaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEBE7',
    marginBottom: Spacing.md,
  },

  sageActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFEBDE',
    marginBottom: Spacing.md,
  },

  privacyActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E5CA',
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
    paddingRight: 22,
  },

  actionArrow: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(226,240,235,0.93)',
    borderWidth: 1,
    borderColor: '#BED9D0',
    borderRadius: 20,
    padding: Spacing.lg,
    ...Shadows.card,
  },

  privacyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D5E8E1',
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
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,239,232,0.90)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: Spacing.md,
  },

  informationLinkText: {
    fontSize: 13,
    color: '#29473D',
    marginLeft: Spacing.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
});