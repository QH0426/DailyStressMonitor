import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
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
import SectionHeader from '../components/SectionHeader';
import WarmCard from '../components/WarmCard';

import { getStressEntries } from '../database/database';
import { getStatistics } from '../services/statistics';
import { getStressCategory } from '../services/stressCalculation';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

export default function ProgressScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { width } = useWindowDimensions();

  const loadProgressData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const storedEntries = await getStressEntries();

      setEntries(storedEntries);
    } catch (error) {
      console.error(
        'Unable to load wellbeing trends:',
        error
      );

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

  const latestCategory =
    entries.length > 0
      ? getStressCategory(statistics.latestScore)
      : null;

  const recentEntries = entries
    .slice(0, 7)
    .reverse();

  const chartWidth = Math.min(
    Math.max(width - 78, 280),
    720
  );

  const chartHeight = 290;

  const leftPadding = 48;
  const rightPadding = 24;
  const topPadding = 32;
  const bottomPadding = 58;

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
        title: 'Your journey is beginning',
        message:
          'Complete more daily reflections to begin identifying changes in your estimated stress level.',
        colour: Colors.primaryDark,
        background: '#EDF5F2',
        border: '#D2E5DF',
        label: 'Beginning',
      };
    }

    const latestScore = Number(entries[0].score);
    const previousScore = Number(entries[1].score);
    const difference = latestScore - previousScore;

    if (difference <= -5) {
      return {
        Icon: ArrowDownRight,
        title: 'Your latest stress level is lower',
        message: `Your latest estimate is ${Math.abs(
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
        message: `Your latest estimate is ${difference}% higher than your previous reflection.`,
        colour: '#A05E4B',
        background: '#FCEFEA',
        border: '#E7C3B8',
        label: 'Increased',
      };
    }

    return {
      Icon: Minus,
      title: 'Your stress level is stable',
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
          'You have started creating a clearer picture of your daily wellbeing.',
      };
    }

    if (entries.length < 7) {
      return {
        title: 'You are building a useful habit',
        message:
          'Every new reflection adds more context to your personal wellbeing journey.',
      };
    }

    return {
      title: 'Your consistency is creating insight',
      message:
        'You now have enough reflections to begin noticing short-term changes and patterns.',
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
          Preparing your wellbeing trends...
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
        title="Your Wellbeing Trends"
        description="Every reflection helps you understand how your wellbeing changes over time."
        icon={ChartLine}
      />

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
            Your journey starts here
          </Text>

          <Text style={styles.emptyText}>
            Complete a daily reflection to begin viewing your
            statistics and wellbeing trend.
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
          <WarmCard style={styles.latestCard}>
            <Text style={styles.latestLabel}>
              Latest estimated stress level
            </Text>

            <View
              style={[
                styles.latestCircle,
                {
                  borderColor:
                    latestCategory.colour,
                },
              ]}
            >
              <Leaf
                size={29}
                color={latestCategory.colour}
                strokeWidth={1.8}
              />

              <Text
                style={[
                  styles.latestScore,
                  {
                    color:
                      latestCategory.colour,
                  },
                ]}
              >
                {statistics.latestScore}%
              </Text>
            </View>

            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor:
                    `${latestCategory.colour}18`,
                  borderColor:
                    `${latestCategory.colour}45`,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      latestCategory.colour,
                  },
                ]}
              >
                {latestCategory.label} stress
              </Text>
            </View>
          </WarmCard>

          <Text style={styles.sectionTitle}>
            Your statistics
          </Text>

          <View style={styles.statisticsGrid}>
            <View style={styles.statisticWrapper}>
              <View style={styles.statisticCard}>
                <View style={styles.averageIcon}>
                  <Activity
                    size={23}
                    color={Colors.primaryDark}
                  />
                </View>

                <Text style={styles.statisticLabel}>
                  Average
                </Text>

                <Text style={styles.statisticValue}>
                  {statistics.averageScore}%
                </Text>
              </View>
            </View>

            <View style={styles.statisticWrapper}>
              <View style={styles.statisticCard}>
                <View style={styles.highIcon}>
                  <TrendingUp
                    size={23}
                    color="#A05E4B"
                  />
                </View>

                <Text style={styles.statisticLabel}>
                  Highest
                </Text>

                <Text style={styles.statisticValue}>
                  {statistics.highestScore}%
                </Text>
              </View>
            </View>

            <View style={styles.statisticWrapper}>
              <View style={styles.statisticCard}>
                <View style={styles.lowIcon}>
                  <TrendingDown
                    size={23}
                    color="#54785C"
                  />
                </View>

                <Text style={styles.statisticLabel}>
                  Lowest
                </Text>

                <Text style={styles.statisticValue}>
                  {statistics.lowestScore}%
                </Text>
              </View>
            </View>

            <View style={styles.statisticWrapper}>
              <View style={styles.statisticCard}>
                <View style={styles.totalIcon}>
                  <CalendarCheck
                    size={23}
                    color="#8B6D35"
                  />
                </View>

                <Text style={styles.statisticLabel}>
                  Reflections
                </Text>

                <Text style={styles.statisticValue}>
                  {statistics.totalEntries}
                </Text>
              </View>
            </View>
          </View>

          <SectionHeader
            title="Current trend"
            description="A comparison between your latest two reflections."
            icon={Sparkles}
            iconColour={trend.colour}
            iconBackground={trend.background}
          />

          <View
            style={[
              styles.trendCard,
              {
                backgroundColor:
                  trend.background,
                borderColor: trend.border,
              },
            ]}
          >
            <View
              style={[
                styles.trendIcon,
                {
                  backgroundColor:
                    `${trend.colour}18`,
                },
              ]}
            >
              <TrendIcon
                size={28}
                color={trend.colour}
                strokeWidth={2}
              />
            </View>

            <View style={styles.trendTextContainer}>
              <View style={styles.trendTitleRow}>
                <Text
                  style={[
                    styles.trendTitle,
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

              <Text style={styles.trendMessage}>
                {trend.message}
              </Text>
            </View>
          </View>

          <SectionHeader
            title="Recent wellbeing journey"
            description="Showing up to seven of your most recent daily reflections."
            icon={ChartLine}
          />

          <WarmCard style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                Estimated stress level
              </Text>

              <Text style={styles.chartSubtitle}>
                0% represents the lowest estimate and
                100% the highest.
              </Text>
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
                          stroke="#E8E0D8"
                          strokeWidth="1"
                        />

                        <SvgText
                          x={leftPadding - 9}
                          y={y + 4}
                          fontSize="11"
                          fill={Colors.textSecondary}
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
                          stroke={Colors.surface}
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
                          fill={Colors.textSecondary}
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
          </WarmCard>

          <View style={styles.encouragementCard}>
            <View style={styles.encouragementIcon}>
              <CheckCircle2
                size={27}
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

          <View style={styles.reminderCard}>
            <Leaf
              size={23}
              color={Colors.primaryDark}
              strokeWidth={1.9}
            />

            <Text style={styles.reminderText}>
              Trends are intended to support personal
              reflection. They are not a clinical
              assessment or diagnosis.
            </Text>
          </View>

          <AppButton
            title="View Your Journey"
            onPress={() =>
              navigation.navigate('History')
            }
          />
        </>
      ) : null}

      <AppButton
        title="Return to Dashboard"
        icon={Home}
        variant="secondary"
        onPress={() =>
          navigation.navigate('Home')
        }
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

  latestCard: {
    alignItems: 'center',
  },

  latestLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  latestCircle: {
    width: 155,
    height: 155,
    borderRadius: 78,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },

  latestScore: {
    fontSize: 44,
    fontWeight: '700',
    marginTop: 3,
  },

  categoryBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: Typography.subheading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: Spacing.lg,
  },

  statisticWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  statisticCard: {
    minHeight: 155,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    ...Shadows.card,
  },

  averageIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F2EC',
    marginBottom: Spacing.sm,
  },

  highIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCEFEA',
    marginBottom: Spacing.sm,
  },

  lowIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF6EF',
    marginBottom: Spacing.sm,
  },

  totalIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBF5E8',
    marginBottom: Spacing.sm,
  },

  statisticLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
  },

  statisticValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },

  trendCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  trendIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  trendTextContainer: {
    flex: 1,
  },

  trendTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 6,
  },

  trendTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    paddingRight: Spacing.sm,
  },

  trendBadge: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  trendBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  trendMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  chartCard: {
    paddingHorizontal: Spacing.sm,
  },

  chartHeader: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
  },

  chartSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
  },

  encouragementCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F4FAF5',
    borderWidth: 1,
    borderColor: '#C9DFC9',
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  encouragementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4F0E6',
    marginRight: Spacing.md,
  },

  encouragementText: {
    flex: 1,
  },

  encouragementTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#54785C',
    marginBottom: 5,
  },

  encouragementMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  reminderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EDF5F2',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  reminderText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: Spacing.md,
  },
});