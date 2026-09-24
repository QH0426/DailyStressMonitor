import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BatteryMedium,
  BedDouble,
  ChartLine,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  History,
  Home,
  Info,
  Leaf,
  Lightbulb,
  Meh,
  MessageCircleHeart,
  Minus,
  MoonStar,
  NotebookText,
  ShieldCheck,
  Smile,
  Sparkles,
  TriangleAlert,
  Waves,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';

import { getStressEntries } from '../database/database';

import {
  getFactorBreakdown,
  getMainContributors,
  getPositiveFactors,
  getSuggestions,
} from '../services/resultAnalysis';

import { getStressCategory } from '../services/stressCalculation';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';

const resultBackgroundImage =
  require('../../assets/images/pexels-jplenio-1103970.jpg');

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
    Icon: Waves,
    colour: '#B56D57',
    background: '#FBEDE8',
  },

  'very-low': {
    label: 'Very low',
    Icon: HeartHandshake,
    colour: '#A9574A',
    background: '#F9E7E3',
  },
};

function getFactorIcon(key) {
  const icons = {
    anxiety: Waves,
    panic: TriangleAlert,
    sleep: MoonStar,
    workload: ClipboardList,
    energy: BatteryMedium,
  };

  return icons[key] || Leaf;
}

function getSuggestionIcon(suggestion) {
  const lowerSuggestion =
    suggestion.toLowerCase();

  if (
    lowerSuggestion.includes('sleep') ||
    lowerSuggestion.includes('evening') ||
    lowerSuggestion.includes('rest')
  ) {
    return BedDouble;
  }

  if (
    lowerSuggestion.includes('breathing') ||
    lowerSuggestion.includes('grounding')
  ) {
    return Waves;
  }

  if (
    lowerSuggestion.includes('professional') ||
    lowerSuggestion.includes('someone you trust')
  ) {
    return MessageCircleHeart;
  }

  if (
    lowerSuggestion.includes('movement') ||
    lowerSuggestion.includes('break')
  ) {
    return ArrowRight;
  }

  return Lightbulb;
}

function getInfluenceInformation(factor) {
  if (!factor || !factor.weight) {
    return {
      label: 'Low influence',
      colour: '#54785C',
      background: '#EDF6EF',
    };
  }

  const influencePercentage =
    (factor.impact / factor.weight) * 100;

  if (influencePercentage >= 75) {
    return {
      label: 'High influence',
      colour: '#A05E4B',
      background: '#FCEFEA',
    };
  }

  if (influencePercentage >= 40) {
    return {
      label: 'Moderate influence',
      colour: '#9A7740',
      background: '#FBF5E8',
    };
  }

  return {
    label: 'Low influence',
    colour: '#54785C',
    background: '#EDF6EF',
  };
}

export default function ResultScreen({
  route,
  navigation,
}) {
  const {
    score,
    answers,
    mood = '',
    note = '',
  } = route.params;

  const { width } = useWindowDimensions();
  const isWide = width >= 850;

  const [previousEntry, setPreviousEntry] =
    useState(null);

  const [
    isLoadingComparison,
    setIsLoadingComparison,
  ] = useState(true);

  const category =
    getStressCategory(score);

  const factorBreakdown =
    getFactorBreakdown(answers);

  const mainContributors =
    getMainContributors(answers);

  const positiveFactors =
    getPositiveFactors(answers);

  const suggestions =
    getSuggestions(answers);

  const selectedMood =
    moodDetails[mood] || null;

  const SelectedMoodIcon =
    selectedMood?.Icon;

  const mainChallenge =
    mainContributors[0] || null;

  const mainStrength =
    positiveFactors[0] || null;

  useEffect(() => {
    async function loadPreviousEntry() {
      try {
        const entries =
          await getStressEntries();

        const versionTwoEntries =
          entries.filter(
            (entry) =>
              entry.questionnaireVersion === 2
          );

        if (versionTwoEntries.length > 1) {
          setPreviousEntry(
            versionTwoEntries[1]
          );
        } else {
          setPreviousEntry(null);
        }
      } catch (error) {
        console.error(
          'Unable to load previous reflection:',
          error
        );

        setPreviousEntry(null);
      } finally {
        setIsLoadingComparison(false);
      }
    }

    loadPreviousEntry();
  }, []);

  function getFactorColour(factor) {
    if (factor.type === 'positive') {
      return '#5F8F68';
    }

    if (factor.value >= 4) {
      return '#B56D57';
    }

    if (factor.value === 3) {
      return '#A47E3B';
    }

    return Colors.primaryDark;
  }

  function getComparisonInformation() {
    if (!previousEntry) {
      return {
        Icon: ChartLine,
        title:
          'Your wellbeing journey is beginning',
        message:
          'Complete another reflection to begin comparing changes over time.',
        colour: Colors.primaryDark,
        background: '#EDF5F2',
      };
    }

    const difference =
      Number(score) -
      Number(previousEntry.score);

    if (difference <= -5) {
      return {
        Icon: ArrowDownRight,
        title:
          'Lower than your previous reflection',
        message: `${Math.abs(
          difference
        )}% lower than your previous estimate.`,
        colour: '#54785C',
        background: '#EDF6EF',
      };
    }

    if (difference >= 5) {
      return {
        Icon: ArrowUpRight,
        title:
          'Higher than your previous reflection',
        message:
          `${difference}% higher than your previous estimate.`,
        colour: '#A05E4B',
        background: '#FCEFEA',
      };
    }

    return {
      Icon: Minus,
      title:
        'Similar to your previous reflection',
      message:
        'Your latest estimate is relatively stable.',
      colour: '#8B6D35',
      background: '#FBF5E8',
    };
  }

  const comparison =
    getComparisonInformation();

  const ComparisonIcon =
    comparison.Icon;

  return (
    <ImageBackground
      source={resultBackgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.backgroundOverlay}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={
            styles.container
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.summaryCard}>
              <View
                style={[
                  styles.summaryMainRow,
                  !isWide &&
                    styles.summaryMainRowMobile,
                ]}
              >
                <View
                  style={styles.scoreSection}
                >
                  <View
                    style={[
                      styles.scoreCircle,
                      {
                        borderColor:
                          category.colour,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.score,
                        {
                          color:
                            category.colour,
                        },
                      ]}
                    >
                      {score}%
                    </Text>
                  </View>

                  <View
                    style={
                      styles.scoreTextContainer
                    }
                  >
                    <Text
                      style={
                        styles.smallUpperLabel
                      }
                    >
                      TODAY'S ESTIMATED STRESS
                      LEVEL
                    </Text>

                    <View
                      style={[
                        styles.categoryBadge,
                        {
                          backgroundColor:
                            `${category.colour}16`,
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
                        {category.label} stress
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.categoryMessage
                      }
                    >
                      {category.message}
                    </Text>
                  </View>
                </View>

                {isWide ? (
                  <View
                    style={
                      styles.verticalDivider
                    }
                  />
                ) : null}

                {selectedMood &&
                SelectedMoodIcon ? (
                  <View
                    style={
                      styles.topInfoSection
                    }
                  >
                    <View
                      style={[
                        styles.topInfoIcon,
                        {
                          backgroundColor:
                            selectedMood.background,
                        },
                      ]}
                    >
                      <SelectedMoodIcon
                        size={27}
                        color={
                          selectedMood.colour
                        }
                        strokeWidth={1.8}
                      />
                    </View>

                    <Text
                      style={
                        styles.topInfoLabel
                      }
                    >
                      Mood
                    </Text>

                    <Text
                      style={[
                        styles.topInfoValue,
                        {
                          color:
                            selectedMood.colour,
                        },
                      ]}
                    >
                      {selectedMood.label}
                    </Text>
                  </View>
                ) : null}

                {isWide ? (
                  <View
                    style={
                      styles.verticalDivider
                    }
                  />
                ) : null}

                <View
                  style={
                    styles.trendSummarySection
                  }
                >
                  <View
                    style={[
                      styles.topInfoIcon,
                      {
                        backgroundColor:
                          comparison.background,
                      },
                    ]}
                  >
                    <ComparisonIcon
                      size={26}
                      color={
                        comparison.colour
                      }
                      strokeWidth={1.9}
                    />
                  </View>

                  <Text
                    style={
                      styles.topInfoLabel
                    }
                  >
                    Compared with last time
                  </Text>

                  {isLoadingComparison ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.primary}
                    />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.trendSummaryTitle,
                          {
                            color:
                              comparison.colour,
                          },
                        ]}
                      >
                        {comparison.title}
                      </Text>

                      <Text
                        style={
                          styles.trendSummaryMessage
                        }
                      >
                        {comparison.message}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {note ? (
              <View style={styles.noteStrip}>
                <NotebookText
                  size={20}
                  color="#8B6D35"
                  strokeWidth={1.9}
                />

                <View
                  style={
                    styles.noteTextContainer
                  }
                >
                  <Text
                    style={
                      styles.noteHeading
                    }
                  >
                    Today’s reflection
                  </Text>

                  <Text
                    style={styles.noteText}
                    numberOfLines={2}
                  >
                    “{note}”
                  </Text>
                </View>
              </View>
            ) : null}

            <View
              style={
                styles.explanationHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.sectionEyebrow
                  }
                >
                  WHY THIS SCORE?
                </Text>

                <Text
                  style={
                    styles.sectionTitleLarge
                  }
                >
                  What shaped today’s estimate?
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  Your result combines five
                  self-reported wellbeing
                  indicators. Each factor has a
                  different weighting in the
                  estimate.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.factorGrid,
                isWide &&
                  styles.factorGridWide,
              ]}
            >
              {factorBreakdown.map(
                (factor) => {
                  const factorColour =
                    getFactorColour(factor);

                  const FactorIcon =
                    getFactorIcon(
                      factor.key
                    );

                  const influence =
                    getInfluenceInformation(
                      factor
                    );

                  return (
                    <View
                      key={factor.key}
                      style={[
                        styles.factorCard,
                        isWide &&
                          styles.factorCardWide,
                      ]}
                    >
                      <View
                        style={
                          styles.factorTopRow
                        }
                      >
                        <View
                          style={[
                            styles.factorIcon,
                            {
                              backgroundColor:
                                `${factorColour}14`,
                            },
                          ]}
                        >
                          <FactorIcon
                            size={21}
                            color={
                              factorColour
                            }
                            strokeWidth={1.9}
                          />
                        </View>

                        <Text
                          style={
                            styles.factorWeight
                          }
                        >
                          {factor.weight}% weight
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.factorLabel
                        }
                      >
                        {factor.label}
                      </Text>

                      <View
                        style={
                          styles.factorRatingRow
                        }
                      >
                        <Text
                          style={[
                            styles.factorValue,
                            {
                              color:
                                factorColour,
                            },
                          ]}
                        >
                          {factor.value}/5
                        </Text>

                        <View
                          style={[
                            styles.influenceBadge,
                            {
                              backgroundColor:
                                influence.background,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.influenceText,
                              {
                                color:
                                  influence.colour,
                              },
                            ]}
                          >
                            {influence.label}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={
                          styles.factorDescription
                        }
                      >
                        {factor.description}
                      </Text>

                      <View
                        style={
                          styles.contributionRow
                        }
                      >
                        <Text
                          style={
                            styles.contributionLabel
                          }
                        >
                          Contribution
                        </Text>

                        <Text
                          style={
                            styles.contributionValue
                          }
                        >
                          {factor.impact.toFixed(
                            1
                          )}{' '}
                          / {factor.weight}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.factorBarBackground
                        }
                      >
                        <View
                          style={[
                            styles.factorBarFill,
                            {
                              width: `${
                                factor.weight > 0
                                  ? Math.min(
                                      100,
                                      (factor.impact /
                                        factor.weight) *
                                        100
                                    )
                                  : 0
                              }%`,
                              backgroundColor:
                                factorColour,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            <View
              style={styles.howScoreCard}
            >
              <View
                style={styles.howScoreIcon}
              >
                <Info
                  size={22}
                  color={Colors.primaryDark}
                  strokeWidth={1.9}
                />
              </View>

              <View
                style={styles.howScoreText}
              >
                <Text
                  style={styles.howScoreTitle}
                >
                  How this estimate works
                </Text>

                <Text
                  style={
                    styles.howScoreDescription
                  }
                >
                  Anxiety contributes up to 25%
                  of the estimate. Panic/overwhelm,
                  sleep and daily responsibilities
                  each contribute up to 20%, while
                  energy contributes up to 15%.
                  For sleep and energy, lower
                  ratings increase the estimated
                  stress contribution. For anxiety,
                  panic and responsibilities,
                  higher ratings increase it.
                </Text>

                <Text
                  style={
                    styles.howScoreNote
                  }
                >
                  The percentage is designed for
                  personal reflection and trend
                  monitoring, not as a clinical
                  measurement.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.overviewRow,
                !isWide &&
                  styles.overviewRowMobile,
              ]}
            >
              <View
                style={[
                  styles.overviewCard,
                  styles.challengeCard,
                ]}
              >
                <View
                  style={
                    styles.overviewIconRow
                  }
                >
                  <View
                    style={
                      styles.challengeIcon
                    }
                  >
                    <TriangleAlert
                      size={21}
                      color="#A05E4B"
                    />
                  </View>

                  <Text
                    style={
                      styles.challengeLabel
                    }
                  >
                    Main challenge today
                  </Text>
                </View>

                <Text
                  style={
                    styles.challengeValue
                  }
                >
                  {mainChallenge
                    ? mainChallenge.label
                    : 'No strong challenge'}
                </Text>

                {mainChallenge ? (
                  <Text
                    style={
                      styles.overviewDescription
                    }
                  >
                    {
                      mainChallenge.description
                    }
                  </Text>
                ) : null}
              </View>

              <View
                style={[
                  styles.overviewCard,
                  styles.strengthCard,
                ]}
              >
                <View
                  style={
                    styles.overviewIconRow
                  }
                >
                  <View
                    style={
                      styles.strengthIcon
                    }
                  >
                    <CheckCircle2
                      size={21}
                      color="#54785C"
                    />
                  </View>

                  <Text
                    style={
                      styles.strengthLabel
                    }
                  >
                    Supporting factor
                  </Text>
                </View>

                <Text
                  style={
                    styles.strengthValue
                  }
                >
                  {mainStrength
                    ? mainStrength.label
                    : 'Keep reflecting'}
                </Text>

                {mainStrength ? (
                  <Text
                    style={
                      styles.overviewDescription
                    }
                  >
                    {
                      mainStrength.description
                    }
                  </Text>
                ) : null}
              </View>
            </View>

            <View
              style={styles.suggestionsCard}
            >
              <View
                style={
                  styles.suggestionHeader
                }
              >
                <View
                  style={
                    styles.lightbulbIcon
                  }
                >
                  <Lightbulb
                    size={22}
                    color="#8B6D35"
                  />
                </View>

                <View>
                  <Text
                    style={
                      styles.suggestionTitle
                    }
                  >
                    Small things that may help
                  </Text>

                  <Text
                    style={
                      styles.suggestionSubtitle
                    }
                  >
                    Based on today’s answers
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.suggestionList,
                  isWide &&
                    styles.suggestionListWide,
                ]}
              >
                {suggestions
                  .slice(0, 2)
                  .map(
                    (
                      suggestion,
                      index
                    ) => {
                      const SuggestionIcon =
                        getSuggestionIcon(
                          suggestion
                        );

                      return (
                        <View
                          key={`${suggestion}-${index}`}
                          style={
                            styles.suggestionItem
                          }
                        >
                          <View
                            style={
                              styles.suggestionIcon
                            }
                          >
                            <SuggestionIcon
                              size={18}
                              color="#8B6D35"
                            />
                          </View>

                          <Text
                            style={
                              styles.suggestionText
                            }
                          >
                            {suggestion}
                          </Text>
                        </View>
                      );
                    }
                  )}
              </View>
            </View>

            <View
              style={styles.safetyCard}
            >
              <ShieldCheck
                size={21}
                color={Colors.primaryDark}
                strokeWidth={1.9}
              />

              <Text
                style={styles.safetyText}
              >
                This estimate uses five
                self-reported wellbeing
                indicators for personal
                reflection only. It is not a
                clinical assessment, diagnosis
                or medical advice.
              </Text>
            </View>

            <View
              style={
                styles.personalChallengeCard
              }
            >
              <View
                style={
                  styles.personalChallengeIcon
                }
              >
                <Sparkles
                  size={25}
                  color={Colors.primaryDark}
                  strokeWidth={1.9}
                />
              </View>

              <View
                style={
                  styles.personalChallengeText
                }
              >
                <Text
                  style={
                    styles.personalChallengeTitle
                  }
                >
                  Your personalised wellbeing
                  challenge
                </Text>

                <Text
                  style={
                    styles.personalChallengeDescription
                  }
                >
                  Try an activity selected using
                  today’s stress result and your
                  Positive Profile.
                </Text>
              </View>

              <View
                style={
                  styles.personalChallengeButton
                }
              >
                <AppButton
                  title="Try My Challenge"
                  icon={Sparkles}
                  onPress={() =>
                    navigation.navigate(
                      'Challenge',
                      { score }
                    )
                  }
                />
              </View>
            </View>

            <View
              style={[
                styles.actionRow,
                !isWide &&
                  styles.actionRowMobile,
              ]}
            >
              <View
                style={styles.actionButton}
              >
                <AppButton
                  title="Journey"
                  icon={History}
                  onPress={() =>
                    navigation.navigate(
                      'History'
                    )
                  }
                />
              </View>

              <View
                style={styles.actionButton}
              >
                <AppButton
                  title="Trends"
                  icon={ChartLine}
                  variant="sage"
                  onPress={() =>
                    navigation.navigate(
                      'Progress'
                    )
                  }
                />
              </View>

              <View
                style={styles.actionButton}
              >
                <AppButton
                  title="Dashboard"
                  icon={Home}
                  variant="secondary"
                  onPress={() =>
                    navigation.navigate(
                      'Home'
                    )
                  }
                />
              </View>
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

  backgroundOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(247,244,239,0.28)',
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
    maxWidth: 1250,
    alignSelf: 'center',
  },

  summaryCard: {
    backgroundColor:
      'rgba(232,241,244,0.93)',
    borderWidth: 1,
    borderColor:
      'rgba(196,218,225,0.95)',
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  summaryMainRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  summaryMainRowMobile: {
    flexDirection: 'column',
  },

  scoreSection: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scoreCircle: {
    width: 102,
    height: 102,
    borderRadius: 51,
    borderWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    backgroundColor:
      'rgba(255,255,255,0.48)',
  },

  score: {
    fontSize: 31,
    fontWeight: '700',
  },

  scoreTextContainer: {
    flex: 1,
  },

  smallUpperLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: Colors.textSecondary,
    marginBottom: 6,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 6,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },

  categoryMessage: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  verticalDivider: {
    width: 1,
    backgroundColor: '#C8DADF',
    marginHorizontal: Spacing.md,
  },

  topInfoSection: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },

  trendSummarySection: {
    flex: 1.2,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },

  topInfoIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  topInfoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 3,
  },

  topInfoValue: {
    fontSize: 17,
    fontWeight: '600',
  },

  trendSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 3,
  },

  trendSummaryMessage: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  noteStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(250,239,224,0.94)',
    borderWidth: 1,
    borderColor: '#E5CFAE',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  noteTextContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },

  noteHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B6D35',
    marginBottom: 2,
  },

  noteText: {
    fontSize: 13,
    color: '#6B5432',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  explanationHeader: {
    alignSelf: 'flex-start',
    backgroundColor:
      'rgba(235,244,241,0.94)',
    borderWidth: 1,
    borderColor:
      'rgba(205,226,219,0.95)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  sectionTitleLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },

  sectionDescription: {
    maxWidth: 700,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  factorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: Spacing.md,
  },

  factorGridWide: {
    flexWrap: 'nowrap',
  },

  factorCard: {
    width: '50%',
    backgroundColor:
      'rgba(239,245,242,0.94)',
    borderWidth: 4,
    borderColor:
      'rgba(247,244,239,0.50)',
    borderRadius: 19,
    padding: 14,
    ...Shadows.card,
  },

  factorCardWide: {
    flex: 1,
    width: 'auto',
  },

  factorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  factorIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  factorWeight: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  factorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  factorRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 5,
  },

  factorValue: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 7,
  },

  influenceBadge: {
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  influenceText: {
    fontSize: 9,
    fontWeight: '700',
  },

  factorDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    minHeight: 16,
    marginBottom: 9,
  },

  contributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  contributionLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
  },

  contributionValue: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.text,
  },

  factorBarBackground: {
    height: 6,
    backgroundColor: '#D9E2DF',
    borderRadius: 4,
    overflow: 'hidden',
  },

  factorBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  howScoreCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor:
      'rgba(226,240,236,0.95)',
    borderWidth: 1,
    borderColor: '#BDD9D0',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  howScoreIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4E8E1',
    marginRight: Spacing.md,
  },

  howScoreText: {
    flex: 1,
  },

  howScoreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 5,
  },

  howScoreDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 5,
  },

  howScoreNote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#61736C',
    lineHeight: 17,
  },

  overviewRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: Spacing.md,
  },

  overviewRowMobile: {
    flexDirection: 'column',
    marginHorizontal: 0,
  },

  overviewCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 17,
    padding: Spacing.md,
    marginHorizontal: 5,
    ...Shadows.card,
  },

  challengeCard: {
    backgroundColor:
      'rgba(250,232,225,0.95)',
    borderColor: '#E2B9AB',
  },

  strengthCard: {
    backgroundColor:
      'rgba(229,241,231,0.95)',
    borderColor: '#BED8C2',
  },

  overviewIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  challengeIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4D7CD',
    marginRight: 8,
  },

  strengthIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEBDD',
    marginRight: 8,
  },

  challengeLabel: {
    fontSize: 11,
    color: '#A16A5A',
  },

  challengeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E513F',
    marginBottom: 3,
  },

  strengthLabel: {
    fontSize: 11,
    color: '#66866D',
  },

  strengthValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#54785C',
    marginBottom: 3,
  },

  overviewDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  suggestionsCard: {
    backgroundColor:
      'rgba(249,236,213,0.95)',
    borderWidth: 1,
    borderColor: '#E4CAA0',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  lightbulbIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1DEB7',
    marginRight: Spacing.sm,
  },

  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B5432',
  },

  suggestionSubtitle: {
    fontSize: 11,
    color: '#8B7657',
  },

  suggestionList: {
    flexDirection: 'column',
  },

  suggestionListWide: {
    flexDirection: 'row',
  },

  suggestionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    paddingRight: Spacing.md,
  },

  suggestionIcon: {
    width: 31,
    height: 31,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1DEB7',
    marginRight: 8,
  },

  suggestionText: {
    flex: 1,
    fontSize: 11,
    color: '#6B5432',
    lineHeight: 17,
  },

  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(225,239,235,0.95)',
    borderWidth: 1,
    borderColor: '#BFD8D0',
    borderRadius: 15,
    padding: 11,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  safetyText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginLeft: Spacing.sm,
  },

  personalChallengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(235,244,241,0.96)',
    borderWidth: 1,
    borderColor: '#C9DFD8',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  personalChallengeIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCECE7',
    marginRight: Spacing.md,
  },

  personalChallengeText: {
    flex: 1,
    paddingRight: Spacing.md,
  },

  personalChallengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  personalChallengeDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  personalChallengeButton: {
    minWidth: 190,
  },

  actionRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },

  actionRowMobile: {
    flexDirection: 'column',
    marginHorizontal: 0,
  },

  actionButton: {
    flex: 1,
    paddingHorizontal: 5,
  },
});