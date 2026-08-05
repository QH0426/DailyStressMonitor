import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getFactorBreakdown,
  getMainContributors,
  getPositiveFactors,
  getSuggestions,
} from '../services/resultAnalysis';

import { getStressCategory } from '../services/stressCalculation';

export default function ResultScreen({ route, navigation }) {
  const { score, answers } = route.params;

  const category = getStressCategory(score);
  const factorBreakdown = getFactorBreakdown(answers);
  const mainContributors = getMainContributors(answers);
  const positiveFactors = getPositiveFactors(answers);
  const suggestions = getSuggestions(answers);

  function getBarWidth(value) {
    return `${(Number(value) / 5) * 100}%`;
  }

  function getFactorColour(factor) {
    if (factor.type === 'positive') {
      return '#0F766E';
    }

    if (factor.value >= 4) {
      return '#EA580C';
    }

    if (factor.value === 3) {
      return '#F59E0B';
    }

    return '#2563EB';
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Today’s Stress Result
      </Text>

      <Text style={styles.description}>
        This estimated result is based on your self-reported answers.
      </Text>

      <View style={styles.resultCard}>
        <Text style={styles.scoreLabel}>
          Estimated stress score
        </Text>

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

        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: category.colour,
            },
          ]}
        >
          <Text style={styles.categoryText}>
            {category.label} stress
          </Text>
        </View>

        <Text style={styles.message}>
          {category.message}
        </Text>
      </View>

      <View style={styles.explanationCard}>
        <Text style={styles.sectionTitle}>
          What influenced this estimate?
        </Text>

        <Text style={styles.sectionDescription}>
          The factors below show your selected ratings. They do not
          identify a medical cause or diagnosis.
        </Text>

        {factorBreakdown.map((factor) => {
          const factorColour = getFactorColour(factor);

          return (
            <View
              key={factor.key}
              style={styles.factorContainer}
            >
              <View style={styles.factorHeader}>
                <Text style={styles.factorLabel}>
                  {factor.label}
                </Text>

                <Text
                  style={[
                    styles.factorRating,
                    {
                      color: factorColour,
                    },
                  ]}
                >
                  {factor.description} ({factor.value}/5)
                </Text>
              </View>

              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: getBarWidth(factor.value),
                      backgroundColor: factorColour,
                    },
                  ]}
                />
              </View>

              <Text style={styles.factorExplanation}>
                {factor.type === 'positive'
                  ? 'A stronger rating in this area reduces the estimated stress score.'
                  : 'A stronger rating in this area increases the estimated stress score.'}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.contributorCard}>
        <Text style={styles.sectionTitle}>
          Main contributing factors
        </Text>

        <Text style={styles.sectionDescription}>
          These factors had the largest calculated contribution to this
          prototype estimate.
        </Text>

        {mainContributors.length > 0 ? (
          mainContributors.map((factor, index) => (
            <View
              key={factor.key}
              style={styles.listRow}
            >
              <View style={styles.numberBadge}>
                <Text style={styles.numberBadgeText}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.listTextContainer}>
                <Text style={styles.listTitle}>
                  {factor.label}
                </Text>

                <Text style={styles.listDescription}>
                  {factor.description}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptySectionText}>
            No strong contributing factors were identified from today’s
            responses.
          </Text>
        )}
      </View>

      <View style={styles.positiveCard}>
        <Text style={styles.positiveTitle}>
          Positive supporting factors
        </Text>

        {positiveFactors.length > 0 ? (
          positiveFactors.map((factor) => (
            <View
              key={factor.key}
              style={styles.positiveRow}
            >
              <Text style={styles.positiveBullet}>✓</Text>

              <Text style={styles.positiveText}>
                {factor.label}: {factor.description}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.positiveText}>
            No strong positive supporting factors were identified in
            today’s responses.
          </Text>
        )}
      </View>

      <View style={styles.suggestionsCard}>
        <Text style={styles.suggestionsTitle}>
          General wellbeing suggestions
        </Text>

        <Text style={styles.suggestionsIntroduction}>
          These are general self-care ideas selected from your answers.
          They are not medical treatment recommendations.
        </Text>

        {suggestions.map((suggestion, index) => (
          <View
            key={`${suggestion}-${index}`}
            style={styles.suggestionRow}
          >
            <Text style={styles.suggestionBullet}>•</Text>

            <Text style={styles.suggestionText}>
              {suggestion}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>
          Important
        </Text>

        <Text style={styles.noticeText}>
          This application is intended for personal self-monitoring
          only. The percentage is generated from a short prototype
          questionnaire and is not clinically validated. It does not
          provide a diagnosis, treatment or professional medical advice.
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('History')}
        accessibilityRole="button"
        accessibilityLabel="View saved stress history"
      >
        <Text style={styles.primaryButtonText}>
          View Stress History
        </Text>
      </Pressable>

      <Pressable
        style={styles.progressButton}
        onPress={() => navigation.navigate('Progress')}
        accessibilityRole="button"
        accessibilityLabel="View stress progress and statistics"
      >
        <Text style={styles.progressButtonText}>
          View Stress Progress
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Home')}
        accessibilityRole="button"
        accessibilityLabel="Return to the home dashboard"
      >
        <Text style={styles.secondaryButtonText}>
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

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 26,
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  scoreLabel: {
    fontSize: 17,
    color: '#475569',
    marginBottom: 12,
  },

  score: {
    fontSize: 66,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  categoryBadge: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
  },

  categoryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 17,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 25,
  },

  explanationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },

  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    marginBottom: 18,
  },

  factorContainer: {
    marginBottom: 18,
  },

  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  factorLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    paddingRight: 10,
  },

  factorRating: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  barBackground: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: 5,
  },

  factorExplanation: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 6,
  },

  contributorCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },

  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  numberBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  listTextContainer: {
    flex: 1,
  },

  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9A3412',
  },

  listDescription: {
    fontSize: 14,
    color: '#7C2D12',
    marginTop: 2,
  },

  emptySectionText: {
    fontSize: 14,
    color: '#7C2D12',
    lineHeight: 21,
  },

  positiveCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },

  positiveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 12,
  },

  positiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  positiveBullet: {
    color: '#059669',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },

  positiveText: {
    flex: 1,
    fontSize: 15,
    color: '#065F46',
    lineHeight: 22,
  },

  suggestionsCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },

  suggestionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },

  suggestionsIntroduction: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 21,
    marginBottom: 14,
  },

  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  suggestionBullet: {
    color: '#2563EB',
    fontSize: 20,
    marginRight: 10,
  },

  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: '#1E40AF',
    lineHeight: 22,
  },

  noticeCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },

  noticeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 8,
  },

  noticeText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 21,
  },

  primaryButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    marginBottom: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  progressButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 12,
    marginBottom: 12,
  },

  progressButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  secondaryButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: 'bold',
  },
});