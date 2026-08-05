import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  ChartLine,
  CheckCircle2,
  CircleGauge,
  ClipboardList,
  HeartHandshake,
  History,
  Home,
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
import SectionHeader from '../components/SectionHeader';
import WarmCard from '../components/WarmCard';

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
import Typography from '../theme/typography';

const moodDetails = {
  'very-good': {
    label: 'Very good',
    Icon: Smile,
    colour: '#5F8F68',
    background: '#EAF4EC',
    message:
      'It is lovely to hear that you are feeling positive today.',
  },

  good: {
    label: 'Good',
    Icon: Smile,
    colour: Colors.primaryDark,
    background: '#EAF5F2',
    message:
      'You seem to be having a positive day. Take a moment to appreciate it.',
  },

  neutral: {
    label: 'Neutral',
    Icon: Meh,
    colour: '#9A7740',
    background: '#FBF4E6',
    message:
      'Some days feel steady and balanced. That is completely okay.',
  },

  low: {
    label: 'Low',
    Icon: Waves,
    colour: '#B56D57',
    background: '#FBEDE8',
    message:
      'Thank you for checking in. Let us gently explore how today has felt.',
  },

  'very-low': {
    label: 'Very low',
    Icon: HeartHandshake,
    colour: '#A9574A',
    background: '#F9E7E3',
    message:
      'Thank you for taking time to reflect. You do not have to manage difficult feelings alone.',
  },
};

function getFactorIcon(key) {
  const icons = {
    stress: CircleGauge,
    anxiety: Waves,
    panic: TriangleAlert,
    sleep: MoonStar,
    workload: ClipboardList,
    energy: Sparkles,
    lifestyle: Leaf,
  };

  return icons[key] || Leaf;
}

function getSuggestionIcon(suggestion) {
  const lowerSuggestion = suggestion.toLowerCase();

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

export default function ResultScreen({ route, navigation }) {
  const {
    score,
    answers,
    mood = '',
    note = '',
  } = route.params;

  const [previousEntry, setPreviousEntry] = useState(null);
  const [isLoadingComparison, setIsLoadingComparison] =
    useState(true);

  const category = getStressCategory(score);
  const factorBreakdown = getFactorBreakdown(answers);
  const mainContributors = getMainContributors(answers);
  const positiveFactors = getPositiveFactors(answers);
  const suggestions = getSuggestions(answers);

  const selectedMood = moodDetails[mood] || null;
  const SelectedMoodIcon = selectedMood?.Icon;

  useEffect(() => {
    async function loadPreviousEntry() {
      try {
        const entries = await getStressEntries();

        if (entries.length > 1) {
          setPreviousEntry(entries[1]);
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

  function getFactorBarWidth(value) {
    return `${(Number(value) / 5) * 100}%`;
  }

  function getComparisonInformation() {
    if (!previousEntry) {
      return {
        Icon: Sparkles,
        title: 'Your wellbeing journey is beginning',
        message:
          'Continue completing daily reflections to see how your stress level changes over time.',
        colour: Colors.primaryDark,
        background: '#EDF5F2',
        border: '#D2E5DF',
      };
    }

    const difference =
      Number(score) - Number(previousEntry.score);

    if (difference <= -5) {
      return {
        Icon: ArrowDownRight,
        title: 'Your stress level has reduced',
        message: `Your latest estimate is ${Math.abs(
          difference
        )}% lower than your previous reflection.`,
        colour: '#54785C',
        background: '#EDF6EF',
        border: '#C9DFC9',
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
      };
    }

    return {
      Icon: Minus,
      title: 'Your stress level is stable',
      message:
        'Your latest estimate is similar to your previous reflection.',
      colour: '#8B6D35',
      background: '#FBF5E8',
      border: '#EAD9B4',
    };
  }

  const comparison = getComparisonInformation();
  const ComparisonIcon = comparison.Icon;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeIcon}>
        <Leaf
          size={34}
          color={Colors.primaryDark}
          strokeWidth={1.8}
        />
      </View>

      <Text style={styles.pageTitle}>
        Today’s Wellbeing Summary
      </Text>

      <Text style={styles.pageIntroduction}>
        Thank you for taking a moment to check in with yourself today.
      </Text>

      <WarmCard style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>
          Estimated stress level
        </Text>

        <View
          style={[
            styles.scoreCircle,
            {
              borderColor: category.colour,
            },
          ]}
        >
          <Leaf
            size={30}
            color={category.colour}
            strokeWidth={1.8}
          />

          <Text
            style={[
              styles.score,
              {
                color: category.colour,
              },
            ]}
          >
            {score}%
          </Text>
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

        <Text style={styles.categoryMessage}>
          {category.message}
        </Text>
      </WarmCard>

      {selectedMood && SelectedMoodIcon ? (
        <WarmCard
          backgroundColor={selectedMood.background}
          borderColor={`${selectedMood.colour}55`}
        >
          <View style={styles.contextHeader}>
            <View
              style={[
                styles.contextIcon,
                {
                  backgroundColor:
                    `${selectedMood.colour}18`,
                },
              ]}
            >
              <SelectedMoodIcon
                size={32}
                color={selectedMood.colour}
                strokeWidth={1.8}
              />
            </View>

            <View style={styles.contextText}>
              <Text style={styles.contextSmallLabel}>
                Today’s mood
              </Text>

              <Text
                style={[
                  styles.contextTitle,
                  {
                    color: selectedMood.colour,
                  },
                ]}
              >
                Feeling {selectedMood.label.toLowerCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.contextMessage}>
            {selectedMood.message}
          </Text>
        </WarmCard>
      ) : null}

      {note ? (
        <WarmCard
          backgroundColor="#FFF9EE"
          borderColor="#ECDDBE"
        >
          <View style={styles.noteHeader}>
            <View style={styles.noteIcon}>
              <NotebookText
                size={25}
                color="#8B6D35"
                strokeWidth={1.9}
              />
            </View>

            <View style={styles.noteHeadingContainer}>
              <Text style={styles.noteHeading}>
                Today’s reflection
              </Text>

              <Text style={styles.noteSubheading}>
                A personal note from your day
              </Text>
            </View>
          </View>

          <Text style={styles.noteText}>
            “{note}”
          </Text>
        </WarmCard>
      ) : null}

      <SectionHeader
        title="Today’s insight"
        description="A simple comparison with your previous reflection."
        icon={Sparkles}
        iconColour={comparison.colour}
        iconBackground={comparison.background}
      />

      <View
        style={[
          styles.insightCard,
          {
            backgroundColor: comparison.background,
            borderColor: comparison.border,
          },
        ]}
      >
        {isLoadingComparison ? (
          <View style={styles.comparisonLoading}>
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />

            <Text style={styles.comparisonLoadingText}>
              Preparing your personal insight...
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.insightIcon,
                {
                  backgroundColor:
                    `${comparison.colour}18`,
                },
              ]}
            >
              <ComparisonIcon
                size={27}
                color={comparison.colour}
                strokeWidth={2}
              />
            </View>

            <View style={styles.insightTextContainer}>
              <Text
                style={[
                  styles.insightTitle,
                  {
                    color: comparison.colour,
                  },
                ]}
              >
                {comparison.title}
              </Text>

              <Text style={styles.insightMessage}>
                {comparison.message}
              </Text>
            </View>
          </>
        )}
      </View>

      <SectionHeader
        title="What shaped today’s estimate?"
        description="Your answers are shown below to make the calculation easier to understand."
        icon={CircleGauge}
      />

      <WarmCard>
        {factorBreakdown.map((factor) => {
          const factorColour =
            getFactorColour(factor);

          const FactorIcon =
            getFactorIcon(factor.key);

          return (
            <View
              key={factor.key}
              style={styles.factorContainer}
            >
              <View style={styles.factorHeader}>
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
                    color={factorColour}
                    strokeWidth={1.9}
                  />
                </View>

                <View style={styles.factorTextContainer}>
                  <Text style={styles.factorLabel}>
                    {factor.label}
                  </Text>

                  <Text
                    style={[
                      styles.factorDescription,
                      {
                        color: factorColour,
                      },
                    ]}
                  >
                    {factor.description} · {factor.value}/5
                  </Text>
                </View>
              </View>

              <View style={styles.factorBarBackground}>
                <View
                  style={[
                    styles.factorBarFill,
                    {
                      width: getFactorBarWidth(
                        factor.value
                      ),
                      backgroundColor: factorColour,
                    },
                  ]}
                />
              </View>

              <Text style={styles.factorHelp}>
                {factor.type === 'positive'
                  ? 'A stronger response in this area supports a lower estimated stress level.'
                  : 'A stronger response in this area contributes more to the estimated stress level.'}
              </Text>
            </View>
          );
        })}
      </WarmCard>

      <SectionHeader
        title="Today’s challenges"
        description="These factors made the largest calculated contribution to today’s estimate."
        icon={TriangleAlert}
        iconColour="#A05E4B"
        iconBackground="#FCEFEA"
      />

      <WarmCard
        backgroundColor="#FFF7F3"
        borderColor="#E8C5BA"
      >
        {mainContributors.length > 0 ? (
          mainContributors.map((factor, index) => {
            const FactorIcon =
              getFactorIcon(factor.key);

            return (
              <View
                key={factor.key}
                style={styles.challengeRow}
              >
                <View style={styles.challengeIcon}>
                  <FactorIcon
                    size={22}
                    color="#A05E4B"
                    strokeWidth={1.9}
                  />
                </View>

                <View style={styles.challengeText}>
                  <Text style={styles.challengeTitle}>
                    {index + 1}. {factor.label}
                  </Text>

                  <Text style={styles.challengeDescription}>
                    {factor.description}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyPositiveRow}>
            <CheckCircle2
              size={24}
              color="#54785C"
            />

            <Text style={styles.emptyPositiveText}>
              No strong challenges were identified from today’s responses.
            </Text>
          </View>
        )}
      </WarmCard>

      <SectionHeader
        title="Today’s strengths"
        description="Positive areas that may be supporting your wellbeing."
        icon={CheckCircle2}
        iconColour="#54785C"
        iconBackground="#EDF6EF"
      />

      <WarmCard
        backgroundColor="#F4FAF5"
        borderColor="#C9DFC9"
      >
        {positiveFactors.length > 0 ? (
          positiveFactors.map((factor) => {
            const FactorIcon =
              getFactorIcon(factor.key);

            return (
              <View
                key={factor.key}
                style={styles.strengthRow}
              >
                <View style={styles.strengthIcon}>
                  <FactorIcon
                    size={22}
                    color="#54785C"
                    strokeWidth={1.9}
                  />
                </View>

                <View style={styles.strengthText}>
                  <Text style={styles.strengthTitle}>
                    {factor.label}
                  </Text>

                  <Text style={styles.strengthDescription}>
                    {factor.description}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noStrengthText}>
            No strong positive supporting factors were identified today.
            This does not mean you are doing anything wrong—it simply
            reflects today’s selected answers.
          </Text>
        )}
      </WarmCard>

      <SectionHeader
        title="Small things that may help tomorrow"
        description="Gentle self-care ideas selected from your answers."
        icon={Lightbulb}
        iconColour="#8B6D35"
        iconBackground="#FBF5E8"
      />

      <WarmCard
        backgroundColor="#FFF9EE"
        borderColor="#ECDDBE"
      >
        {suggestions.map((suggestion, index) => {
          const SuggestionIcon =
            getSuggestionIcon(suggestion);

          return (
            <View
              key={`${suggestion}-${index}`}
              style={styles.suggestionRow}
            >
              <View style={styles.suggestionIcon}>
                <SuggestionIcon
                  size={22}
                  color="#8B6D35"
                  strokeWidth={1.9}
                />
              </View>

              <Text style={styles.suggestionText}>
                {suggestion}
              </Text>
            </View>
          );
        })}
      </WarmCard>

      <View style={styles.safetyCard}>
        <View style={styles.safetyIcon}>
          <ShieldCheck
            size={27}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />
        </View>

        <View style={styles.safetyTextContainer}>
          <Text style={styles.safetyTitle}>
            A gentle reminder
          </Text>

          <Text style={styles.safetyText}>
            This application supports personal reflection and
            self-monitoring. The percentage is generated from a short
            prototype questionnaire and is not clinically validated. It
            does not provide a diagnosis, treatment or professional
            medical advice.
          </Text>
        </View>
      </View>

      <AppButton
        title="View Your Journey"
        icon={History}
        onPress={() =>
          navigation.navigate('History')
        }
      />

      <AppButton
        title="View Wellbeing Trends"
        icon={ChartLine}
        variant="sage"
        onPress={() =>
          navigation.navigate('Progress')
        }
      />

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

  welcomeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#E9F2EC',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: '650',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  pageIntroduction: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: Spacing.xl,
  },

  scoreCard: {
    alignItems: 'center',
  },

  scoreLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  scoreCircle: {
    width: 165,
    height: 165,
    borderRadius: 83,
    borderWidth: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },

  score: {
    fontSize: 48,
    fontWeight: '700',
    marginTop: 3,
  },

  categoryBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginBottom: Spacing.md,
  },

  categoryText: {
    fontSize: 17,
    fontWeight: '600',
  },

  categoryMessage: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },

  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  contextIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  contextText: {
    flex: 1,
  },

  contextSmallLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 3,
  },

  contextTitle: {
    fontSize: 19,
    fontWeight: '600',
  },

  contextMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginTop: Spacing.md,
  },

  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  noteIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E9CE',
    marginRight: Spacing.md,
  },

  noteHeadingContainer: {
    flex: 1,
  },

  noteHeading: {
    fontSize: 19,
    fontWeight: '600',
    color: '#6B5432',
    marginBottom: 3,
  },

  noteSubheading: {
    fontSize: 13,
    color: '#8B7657',
  },

  noteText: {
    fontSize: 16,
    color: '#6B5432',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  comparisonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  comparisonLoadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
  },

  insightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
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

  factorContainer: {
    marginBottom: Spacing.lg,
  },

  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  factorIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  factorTextContainer: {
    flex: 1,
  },

  factorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },

  factorDescription: {
    fontSize: 13,
    fontWeight: '500',
  },

  factorBarBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EEE8E1',
    overflow: 'hidden',
  },

  factorBarFill: {
    height: '100%',
    borderRadius: 5,
  },

  factorHelp: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.xs,
  },

  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  challengeIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7E4DE',
    marginRight: Spacing.md,
  },

  challengeText: {
    flex: 1,
  },

  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E513F',
    marginBottom: 3,
  },

  challengeDescription: {
    fontSize: 14,
    color: '#A16A5A',
  },

  emptyPositiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  emptyPositiveText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginLeft: Spacing.md,
  },

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  strengthIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4F0E6',
    marginRight: Spacing.md,
  },

  strengthText: {
    flex: 1,
  },

  strengthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#54785C',
    marginBottom: 3,
  },

  strengthDescription: {
    fontSize: 14,
    color: '#66866D',
  },

  noStrengthText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },

  suggestionIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E9CE',
    marginRight: Spacing.md,
  },

  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: '#6B5432',
    lineHeight: 22,
  },

  safetyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EDF5F2',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  safetyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDECE7',
    marginRight: Spacing.md,
  },

  safetyTextContainer: {
    flex: 1,
  },

  safetyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 5,
  },

  safetyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
});