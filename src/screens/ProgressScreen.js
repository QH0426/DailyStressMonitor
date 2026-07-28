import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import Svg, {
  Circle,
  G,
  Line,
  Polyline,
  Text as SvgText,
} from 'react-native-svg';

import { getStressEntries } from '../database/database';
import { getStatistics } from '../services/statistics';
import { getStressCategory } from '../services/stressCalculation';

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
      console.error('Unable to load progress data:', error);

      setErrorMessage(
        'Your progress information could not be loaded. Please try again.'
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
    Math.max(width - 68, 280),
    700
  );

  const chartHeight = 280;

  const leftPadding = 48;
  const rightPadding = 24;
  const topPadding = 28;
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
    const date = new Date(dateValue);

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
  }

  const graphPoints = recentEntries
    .map((entry, index) => {
      const x = getPointX(index);
      const y = getPointY(entry.score);

      return `${x},${y}`;
    })
    .join(' ');

  if (isLoading) {
    return (
      <View style={styles.centreContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading your progress...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Stress Progress
      </Text>

      <Text style={styles.description}>
        Review changes in your estimated stress scores over recent check-ins.
      </Text>

      {errorMessage ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadProgressData}
          >
            <Text style={styles.retryButtonText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!errorMessage && entries.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📈</Text>

          <Text style={styles.emptyTitle}>
            No progress data available
          </Text>

          <Text style={styles.emptyText}>
            Complete a daily check-in to begin monitoring your stress trend.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate('CheckIn')
            }
          >
            <Text style={styles.primaryButtonText}>
              Start Daily Check-in
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!errorMessage && entries.length > 0 ? (
        <>
          <View style={styles.latestCard}>
            <Text style={styles.latestLabel}>
              Latest estimated score
            </Text>

            <Text
              style={[
                styles.latestScore,
                {
                  color: latestCategory.colour,
                },
              ]}
            >
              {statistics.latestScore}%
            </Text>

            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor:
                    latestCategory.colour,
                },
              ]}
            >
              <Text style={styles.categoryText}>
                {latestCategory.label} stress
              </Text>
            </View>
          </View>

          <View style={styles.statisticsGrid}>
            <View style={styles.statisticCard}>
              <Text style={styles.statisticLabel}>
                Average
              </Text>

              <Text style={styles.statisticValue}>
                {statistics.averageScore}%
              </Text>
            </View>

            <View style={styles.statisticCard}>
              <Text style={styles.statisticLabel}>
                Highest
              </Text>

              <Text style={styles.statisticValue}>
                {statistics.highestScore}%
              </Text>
            </View>

            <View style={styles.statisticCard}>
              <Text style={styles.statisticLabel}>
                Lowest
              </Text>

              <Text style={styles.statisticValue}>
                {statistics.lowestScore}%
              </Text>
            </View>

            <View style={styles.statisticCard}>
              <Text style={styles.statisticLabel}>
                Check-ins
              </Text>

              <Text style={styles.statisticValue}>
                {statistics.totalEntries}
              </Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              Recent stress trend
            </Text>

            <Text style={styles.chartDescription}>
              Showing up to seven recent check-ins.
            </Text>

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
                          stroke="#E2E8F0"
                          strokeWidth="1"
                        />

                        <SvgText
                          x={leftPadding - 8}
                          y={y + 4}
                          fontSize="11"
                          fill="#64748B"
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
                    stroke="#2563EB"
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
                          r="7"
                          fill={category.colour}
                          stroke="#FFFFFF"
                          strokeWidth="3"
                        />

                        <SvgText
                          x={x}
                          y={y - 13}
                          fontSize="11"
                          fontWeight="bold"
                          fill={category.colour}
                          textAnchor="middle"
                        >
                          {entry.score}%
                        </SvgText>

                        <SvgText
                          x={x}
                          y={
                            chartHeight -
                            18
                          }
                          fontSize="10"
                          fill="#64748B"
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
          </View>

          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>
              Understanding the graph
            </Text>

            <Text style={styles.noticeText}>
              The graph shows estimated stress scores based on your
              self-reported answers. It is intended for personal trend
              monitoring and is not a clinical assessment.
            </Text>
          </View>
        </>
      ) : null}

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate('History')
        }
      >
        <Text style={styles.secondaryButtonText}>
          View Full History
        </Text>
      </Pressable>

      <Pressable
        style={styles.homeButton}
        onPress={() =>
          navigation.navigate('Home')
        }
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
    alignItems: 'center',
    justifyContent: 'center',
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

  latestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  latestLabel: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },

  latestScore: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  categoryBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 12,
  },

  statisticCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  statisticLabel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#64748B',
  },

  statisticValue: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingTop: 5,
    paddingBottom: 16,
    textAlign: 'center',
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 10,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  chartTitle: {
    alignSelf: 'flex-start',
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
    marginBottom: 5,
  },

  chartDescription: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
    marginBottom: 18,
  },

  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
  },

  noticeCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },

  noticeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },

  noticeText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 21,
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    marginBottom: 12,
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  homeButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
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