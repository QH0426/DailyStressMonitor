import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  ChartLine,
  CheckCircle2,
  Home,
  Leaf,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';

import Svg, {
  Circle,
  G,
  Line,
  Polyline,
  Text as SvgText,
} from 'react-native-svg';

import AppButton from '../components/AppButton';
import WarmCard from '../components/WarmCard';

import { getStressEntries } from '../database/database';
import { getChallengeFeedback } from '../services/firestoreService';
import { analyseHelpfulActivities } from '../services/helpfulActivities';
import { getStatistics } from '../services/statistics';
import { getStressCategory } from '../services/stressCalculation';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

const trendsBackgroundImage =
  require('../../assets/images/pexels-pixabay-220118.jpg');

export default function ProgressScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { width } = useWindowDimensions();

  const isWide = width >= 850;

  const loadProgressData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const [storedEntries, storedFeedback] =
        await Promise.all([
          getStressEntries(),
          getChallengeFeedback(),
        ]);

      const versionTwoEntries = storedEntries.filter(
        (entry) => entry.questionnaireVersion === 2
      );

      setEntries(versionTwoEntries);
      setFeedbackEntries(storedFeedback);
    } catch (error) {
      console.error(
        'Unable to load wellbeing trends:',
        error
      );

      setFeedbackEntries([]);

      setErrorMessage(
        'Your wellbeing trends could not be loaded. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgressData();
    }, [loadProgressData])
  );

  const statistics = getStatistics(entries);

  const helpfulActivities =
    analyseHelpfulActivities(feedbackEntries);

  const latestCategory =
    entries.length > 0
      ? getStressCategory(statistics.latestScore)
      : null;

  const recentEntries = entries
    .slice(0, 7)
    .reverse();

  const chartWidth = Math.min(
    Math.max(width - 90, 280),
    900
  );

  const chartHeight = isWide ? 260 : 280;

  const leftPadding = 48;
  const rightPadding = 24;
  const topPadding = 32;
  const bottomPadding = 55;

  const graphWidth =
    chartWidth - leftPadding - rightPadding;

  const graphHeight =
    chartHeight - topPadding - bottomPadding;

  function getPointX(index) {
    if (recentEntries.length <= 1) {
      return leftPadding + graphWidth / 2;
    }

    return (
      leftPadding +
      (index * graphWidth) /
        (recentEntries.length - 1)
    );
  }

  function getPointY(score) {
    return (
      topPadding +
      ((100 - Number(score)) / 100) *
        graphHeight
    );
  }

  function formatShortDate(dateValue) {
    return new Date(dateValue).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
      }
    );
  }

  function getTrendInformation() {
    if (entries.length < 2) {
      return {
        Icon: Sparkles,
        title: 'Your updated journey is beginning',
        message:
          'Complete another daily reflection to begin identifying changes in your estimated stress level.',
        colour: Colors.primaryDark,
        background: '#EDF5F2',
        border: '#D2E5DF',
        label: 'Beginning',
      };
    }

    const latestScore = Number(entries[0].score);
    const previousScore = Number(entries[1].score);

    const difference =
      latestScore - previousScore;

    if (difference <= -5) {
      return {
        Icon: ArrowDownRight,
        title: 'Your latest estimate is lower',
        message: `${Math.abs(
          difference
        )}% lower than your previous reflection.`,
        colour: '#54785C',
        background: '#EDF6EF',
        border: '#C9DFC9',
        label: 'Improving',
      };
    }

    if (difference >= 5) {
      return {
        Icon: ArrowUpRight,
        title: 'Today may feel more demanding',
        message: `${difference}% higher than your previous reflection.`,
        colour: '#A05E4B',
        background: '#FCEFEA',
        border: '#E7C3B8',
        label: 'Increased',
      };
    }

    return {
      Icon: Minus,
      title: 'Your estimated stress level is stable',
      message:
        'Your latest estimate is close to your previous reflection.',
      colour: '#8B6D35',
      background: '#FBF5E8',
      border: '#EAD9B4',
      label: 'Stable',
    };
  }

  function getEncouragement() {
    if (entries.length === 1) {
      return {
        title: 'Your first reflection matters',
        message:
          'Keep checking in to begin building your personal wellbeing trend.',
      };
    }

    if (entries.length < 7) {
      return {
        title: 'You are building a useful habit',
        message:
          'Each reflection adds more context to your wellbeing journey.',
      };
    }

    return {
      title: 'Your consistency is creating insight',
      message:
        'You now have enough recent reflections to begin noticing short-term changes and patterns.',
    };
  }

  const trend = getTrendInformation();
  const TrendIcon = trend.Icon;

  const encouragement = getEncouragement();

  const graphPoints = recentEntries
    .map((entry, index) => {
      const x = getPointX(index);
      const y = getPointY(entry.score);

      return `${x},${y}`;
    })
    .join(' ');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <ChartLine
            size={34}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />
        </View>

        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text style={styles.loadingText}>
          Preparing your wellbeing trends...
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={trendsBackgroundImage}
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
            {/* Page header */}

            <View
              style={[
                styles.pageHeader,
                isWide && styles.pageHeaderWide,
              ]}
            >
              <View style={styles.pageHeaderText}>
                <Text style={styles.pageEyebrow}>
                  YOUR PROGRESS
                </Text>

                <Text style={styles.pageTitle}>
                  Your Wellbeing Trends
                </Text>

                <Text style={styles.pageDescription}>
                  See how your estimated stress level changes
                  across your daily reflections.
                </Text>
              </View>

              <View style={styles.headerIllustration}>
                <View style={styles.singleHeaderIcon}>
                  <ChartLine
                    size={38}
                    color={Colors.primaryDark}
                    strokeWidth={1.8}
                  />
                </View>
              </View>
            </View>

            {/* Error */}

            {errorMessage ? (
              <WarmCard
                backgroundColor="#FBECE9"
                borderColor="#E7B8AE"
              >
                <Text style={styles.errorTitle}>
                  We could not load your trends
                </Text>

                <Text style={styles.errorText}>
                  {errorMessage}
                </Text>

                <AppButton
                  title="Try Again"
                  onPress={loadProgressData}
                />
              </WarmCard>
            ) : null}

            {/* Empty */}

            {!errorMessage && entries.length === 0 ? (
              <WarmCard style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Activity
                    size={40}
                    color={Colors.primary}
                    strokeWidth={1.8}
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  Your updated journey starts here
                </Text>

                <Text style={styles.emptyText}>
                  Complete a new five-question daily
                  reflection to begin building your
                  wellbeing trend.
                </Text>

                <AppButton
                  title="Start Daily Reflection"
                  onPress={() =>
                    navigation.navigate('CheckIn')
                  }
                />
              </WarmCard>
            ) : null}

            {!errorMessage && entries.length > 0 ? (
              <>
                {/* Summary */}

                <View style={styles.overviewCard}>
                  <View style={styles.overviewHeader}>
                    <View>
                      <Text style={styles.overviewEyebrow}>
                        WELLBEING AT A GLANCE
                      </Text>

                      <Text style={styles.overviewTitle}>
                        Your recent summary
                      </Text>
                    </View>

                    <View style={styles.overviewHeaderIcon}>
                      <ChartLine
                        size={23}
                        color={Colors.primaryDark}
                        strokeWidth={1.9}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.summaryRow,
                      !isWide && styles.summaryRowMobile,
                    ]}
                  >
                    <View
                      style={[
                        styles.latestSummary,
                        isWide &&
                          styles.latestSummaryWide,
                      ]}
                    >
                      <Text style={styles.summaryLabel}>
                        Latest
                      </Text>

                      <View style={styles.latestScoreRow}>
                        <Text
                          style={[
                            styles.compactLatestScore,
                            {
                              color:
                                latestCategory.colour,
                            },
                          ]}
                        >
                          {statistics.latestScore}%
                        </Text>

                        <View
                          style={[
                            styles.compactCategoryBadge,
                            {
                              backgroundColor:
                                `${latestCategory.colour}16`,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.compactCategoryText,
                              {
                                color:
                                  latestCategory.colour,
                              },
                            ]}
                          >
                            {latestCategory.label}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {isWide ? (
                      <View style={styles.verticalDivider} />
                    ) : null}

                    <View style={styles.compactStatistics}>
                      <View
                        style={[
                          styles.compactStat,
                          styles.statAverage,
                        ]}
                      >
                        <View style={styles.averageIcon}>
                          <Activity
                            size={19}
                            color={Colors.primaryDark}
                          />
                        </View>

                        <Text style={styles.summaryLabel}>
                          Average
                        </Text>

                        <Text style={styles.summaryValue}>
                          {statistics.averageScore}%
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.compactStat,
                          styles.statHighest,
                        ]}
                      >
                        <View style={styles.highIcon}>
                          <TrendingUp
                            size={19}
                            color="#A05E4B"
                          />
                        </View>

                        <Text style={styles.summaryLabel}>
                          Highest
                        </Text>

                        <Text style={styles.summaryValue}>
                          {statistics.highestScore}%
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.compactStat,
                          styles.statLowest,
                        ]}
                      >
                        <View style={styles.lowIcon}>
                          <TrendingDown
                            size={19}
                            color="#54785C"
                          />
                        </View>

                        <Text style={styles.summaryLabel}>
                          Lowest
                        </Text>

                        <Text style={styles.summaryValue}>
                          {statistics.lowestScore}%
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.compactStat,
                          styles.statReflections,
                        ]}
                      >
                        <View style={styles.totalIcon}>
                          <CalendarCheck
                            size={19}
                            color="#8B6D35"
                          />
                        </View>

                        <Text style={styles.summaryLabel}>
                          Reflections
                        </Text>

                        <Text style={styles.summaryValue}>
                          {statistics.totalEntries}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.compactTrend,
                      {
                        backgroundColor:
                          trend.background,
                        borderColor:
                          trend.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.compactTrendIcon,
                        {
                          backgroundColor:
                            `${trend.colour}18`,
                        },
                      ]}
                    >
                      <TrendIcon
                        size={23}
                        color={trend.colour}
                        strokeWidth={2}
                      />
                    </View>

                    <View style={styles.compactTrendText}>
                      <View style={styles.trendTitleRow}>
                        <Text
                          style={[
                            styles.compactTrendTitle,
                            {
                              color: trend.colour,
                            },
                          ]}
                        >
                          {trend.title}
                        </Text>

                        <View
                          style={[
                            styles.trendBadge,
                            {
                              backgroundColor:
                                `${trend.colour}18`,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.trendBadgeText,
                              {
                                color: trend.colour,
                              },
                            ]}
                          >
                            {trend.label}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.compactTrendMessage}>
                        {trend.message}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Graph */}

                <View style={styles.journeyCard}>
                  <View
                    style={[
                      styles.journeyHeader,
                      isWide && styles.journeyHeaderWide,
                    ]}
                  >
                    <View style={styles.journeyHeadingText}>
                      <Text style={styles.journeyTitle}>
                        Recent wellbeing journey
                      </Text>

                      <Text style={styles.journeySubtitle}>
                        Your most recent seven reflections
                      </Text>
                    </View>

                    <View style={styles.journeyIcon}>
                      <ChartLine
                        size={26}
                        color={Colors.primaryDark}
                        strokeWidth={1.9}
                      />
                    </View>
                  </View>

                  <View style={styles.chartContainer}>
                    <Svg
                      width={chartWidth}
                      height={chartHeight}
                    >
                      {[0, 25, 50, 75, 100].map(
                        (value) => {
                          const y = getPointY(value);

                          return (
                            <G key={value}>
                              <Line
                                x1={leftPadding}
                                y1={y}
                                x2={
                                  chartWidth -
                                  rightPadding
                                }
                                y2={y}
                                stroke="#D8D9DF"
                                strokeWidth="1"
                              />

                              <SvgText
                                x={leftPadding - 9}
                                y={y + 4}
                                fontSize="11"
                                fill={
                                  Colors.textSecondary
                                }
                                textAnchor="end"
                              >
                                {value}
                              </SvgText>
                            </G>
                          );
                        }
                      )}

                      {recentEntries.length > 1 ? (
                        <Polyline
                          points={graphPoints}
                          fill="none"
                          stroke={Colors.primary}
                          strokeWidth="4"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      ) : null}

                      {recentEntries.map(
                        (entry, index) => {
                          const x = getPointX(index);

                          const y = getPointY(
                            entry.score
                          );

                          const category =
                            getStressCategory(
                              entry.score
                            );

                          return (
                            <G key={entry.id}>
                              <Circle
                                cx={x}
                                cy={y}
                                r="8"
                                fill={category.colour}
                                stroke="#FFFFFF"
                                strokeWidth="3"
                              />

                              <SvgText
                                x={x}
                                y={y - 14}
                                fontSize="11"
                                fontWeight="bold"
                                fill={category.colour}
                                textAnchor="middle"
                              >
                                {entry.score}%
                              </SvgText>

                              <SvgText
                                x={x}
                                y={chartHeight - 18}
                                fontSize="10"
                                fill={
                                  Colors.textSecondary
                                }
                                textAnchor="middle"
                              >
                                {formatShortDate(
                                  entry.date
                                )}
                              </SvgText>
                            </G>
                          );
                        }
                      )}
                    </Svg>
                  </View>

                  <View style={styles.encouragementRow}>
                    <View style={styles.encouragementIcon}>
                      <CheckCircle2
                        size={23}
                        color="#54785C"
                        strokeWidth={1.9}
                      />
                    </View>

                    <View style={styles.encouragementText}>
                      <Text style={styles.encouragementTitle}>
                        {encouragement.title}
                      </Text>

                      <Text style={styles.encouragementMessage}>
                        {encouragement.message}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* What Helps Me */}

                <View style={styles.helpfulCard}>
                  <View style={styles.helpfulHeader}>
                    <View style={styles.helpfulHeaderIcon}>
                      <Sparkles
                        size={24}
                        color={Colors.primaryDark}
                        strokeWidth={1.9}
                      />
                    </View>

                    <View style={styles.helpfulHeaderText}>
                      <Text style={styles.helpfulEyebrow}>
                        WHAT HELPS ME
                      </Text>

                      <Text style={styles.helpfulTitle}>
                        {helpfulActivities.hasEnoughData
                          ? 'Your personal activity insights'
                          : 'Building your personal activity insights'}
                      </Text>
                    </View>
                  </View>

                  {helpfulActivities.totalFeedback === 0 ? (
                    <Text style={styles.helpfulIntro}>
                      Complete a personalised wellbeing challenge
                      and share how you feel afterwards. Your
                      feedback will appear here over time.
                    </Text>
                  ) : !helpfulActivities.hasEnoughData ? (
                    <Text style={styles.helpfulIntro}>
                      You have shared feedback after{' '}
                      {helpfulActivities.totalFeedback}{' '}
                      {helpfulActivities.totalFeedback === 1
                        ? 'personalised activity'
                        : 'personalised activities'}. Continue
                      using the challenges to help identify which
                      activities you report as most supportive.
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.helpfulIntro}>
                        These results are based on how you reported
                        feeling after your personalised activities.
                      </Text>

                      <View style={styles.helpfulList}>
                        {helpfulActivities.activities.map(
                          (activity) => (
                            <View
                              key={activity.profileSource}
                              style={styles.helpfulActivityRow}
                            >
                              <View style={styles.helpfulActivityText}>
                                <Text
                                  style={styles.helpfulActivityName}
                                >
                                  {activity.profileSource}
                                </Text>

                                <Text
                                  style={styles.helpfulActivityDetails}
                                >
                                  Helpful {activity.helpfulResponses} of{' '}
                                  {activity.totalResponses}{' '}
                                  {activity.totalResponses === 1
                                    ? 'time'
                                    : 'times'}
                                </Text>
                              </View>

                              <View style={styles.helpfulPercentageBadge}>
                                <Text
                                  style={styles.helpfulPercentageText}
                                >
                                  {activity.helpfulPercentage}%
                                </Text>
                              </View>
                            </View>
                          )
                        )}
                      </View>

                      {helpfulActivities.mostHelpful ? (
                        <View style={styles.helpfulInsight}>
                          <CheckCircle2
                            size={21}
                            color="#54785C"
                            strokeWidth={1.9}
                          />

                          <Text style={styles.helpfulInsightText}>
                            Early personal insight:{' '}
                            {helpfulActivities.mostHelpful.profileSource}{' '}
                            has received the strongest positive
                            feedback so far. This is based on your
                            self-reported responses and may change as
                            you complete more activities.
                          </Text>
                        </View>
                      ) : null}
                    </>
                  )}
                </View>

                {/* Disclaimer */}

                <View style={styles.reminderCard}>
                  <Leaf
                    size={21}
                    color={Colors.primaryDark}
                    strokeWidth={1.9}
                  />

                  <Text style={styles.reminderText}>
                    These trends support personal reflection
                    and are not a clinical assessment or
                    diagnosis.
                  </Text>
                </View>

                {/* Buttons */}

                <View
                  style={[
                    styles.buttonRow,
                    !isWide && styles.buttonRowMobile,
                  ]}
                >
                  <View style={styles.buttonWrapper}>
                    <AppButton
                      title="View Your Journey"
                      onPress={() =>
                        navigation.navigate('History')
                      }
                    />
                  </View>

                  <View style={styles.buttonWrapper}>
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
              </>
            ) : null}

            {!errorMessage && entries.length === 0 ? (
              <AppButton
                title="Return to Dashboard"
                icon={Home}
                variant="secondary"
                onPress={() =>
                  navigation.navigate('Home')
                }
              />
            ) : null}
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
    backgroundColor: 'rgba(244,241,247,0.25)',
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
    maxWidth: 1200,
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
    backgroundColor: '#E6F0ED',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#D2E5DF',
  },

  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },

  pageHeader: {
    backgroundColor: 'rgba(232,241,244,0.92)',
    borderWidth: 1,
    borderColor: '#C8DCE2',
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  pageHeaderWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pageHeaderText: {
    flex: 1,
  },

  pageEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.primaryDark,
    marginBottom: 7,
  },

  pageTitle: {
    fontSize: Typography.heading,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },

  pageDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    maxWidth: 620,
  },

  headerIllustration: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.lg,
  },

  singleHeaderIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: '#C8DCE2',
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
    width: 72,
    height: 72,
    borderRadius: 36,
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

  overviewCard: {
    backgroundColor: 'rgba(239,245,242,0.93)',
    borderWidth: 1,
    borderColor: '#CADFD8',
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  overviewEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primaryDark,
    marginBottom: 3,
  },

  overviewTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.text,
  },

  overviewHeaderIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DAEBE5',
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: Spacing.md,
  },

  summaryRowMobile: {
    flexDirection: 'column',
  },

  latestSummary: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },

  latestSummaryWide: {
    width: 210,
    marginBottom: 0,
    justifyContent: 'center',
  },

  latestScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  compactLatestScore: {
    fontSize: 38,
    fontWeight: '700',
    marginRight: 10,
  },

  compactCategoryBadge: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  compactCategoryText: {
    fontSize: 12,
    fontWeight: '600',
  },

  verticalDivider: {
    width: 1,
    backgroundColor: '#CADFD8',
    marginHorizontal: Spacing.md,
  },

  compactStatistics: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },

  compactStat: {
    flex: 1,
    minWidth: 115,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: 6,
    borderRadius: 16,
  },

  statAverage: {
    backgroundColor: 'rgba(224,239,237,0.82)',
  },

  statHighest: {
    backgroundColor: 'rgba(250,231,225,0.82)',
  },

  statLowest: {
    backgroundColor: 'rgba(229,241,231,0.82)',
  },

  statReflections: {
    backgroundColor: 'rgba(248,239,220,0.82)',
  },

  averageIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEDE8',
    marginBottom: 6,
  },

  highIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6DDD5',
    marginBottom: 6,
  },

  lowIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEBDC',
    marginBottom: 6,
  },

  totalIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E4C5',
    marginBottom: 6,
  },

  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 3,
  },

  summaryValue: {
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text,
  },

  compactTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 17,
    padding: Spacing.md,
  },

  compactTrendIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  compactTrendText: {
    flex: 1,
  },

  trendTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 3,
  },

  compactTrendTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingRight: 8,
  },

  trendBadge: {
    borderRadius: 13,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  trendBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  compactTrendMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  journeyCard: {
    backgroundColor: 'rgba(239,237,247,0.93)',
    borderWidth: 1,
    borderColor: '#D7D0E5',
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  journeyHeader: {
    marginBottom: Spacing.sm,
  },

  journeyHeaderWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  journeyHeadingText: {
    flex: 1,
  },

  journeyTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },

  journeySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  journeyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7E0F0',
  },

  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 18,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(215,208,229,0.75)',
  },

  encouragementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230,242,232,0.92)',
    borderWidth: 1,
    borderColor: '#BED8C2',
    borderRadius: 16,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },

  encouragementIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEBDD',
    marginRight: Spacing.md,
  },

  encouragementText: {
    flex: 1,
  },

  encouragementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#54785C',
    marginBottom: 3,
  },

  encouragementMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  helpfulCard: {
    backgroundColor: 'rgba(244,239,232,0.94)',
    borderWidth: 1,
    borderColor: '#E1D5C5',
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  helpfulHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  helpfulHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3EEE9',
    marginRight: Spacing.md,
  },

  helpfulHeaderText: {
    flex: 1,
  },

  helpfulEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  helpfulTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },

  helpfulIntro: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  helpfulList: {
    marginTop: Spacing.md,
  },

  helpfulActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: '#E4DDD2',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },

  helpfulActivityText: {
    flex: 1,
    paddingRight: Spacing.md,
  },

  helpfulActivityName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },

  helpfulActivityDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  helpfulPercentageBadge: {
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2EEE4',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  helpfulPercentageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#54785C',
  },

  helpfulInsight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EDF6EF',
    borderWidth: 1,
    borderColor: '#C9DFC9',
    borderRadius: 16,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },

  helpfulInsightText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginLeft: Spacing.sm,
  },

  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(228,240,237,0.94)',
    borderWidth: 1,
    borderColor: '#BED8D1',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  reminderText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginLeft: Spacing.md,
  },

  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },

  buttonRowMobile: {
    flexDirection: 'column',
    marginHorizontal: 0,
  },

  buttonWrapper: {
    flex: 1,
    paddingHorizontal: 5,
  },
});