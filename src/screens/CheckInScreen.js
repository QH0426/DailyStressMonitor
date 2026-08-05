import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getTodayStressEntry,
  saveStressEntry,
} from '../database/database';

import { calculateStressScore } from '../services/stressCalculation';
import questionnaireData from '../services/questionnaireData';

export default function CheckInScreen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingToday, setIsCheckingToday] = useState(true);
  const [todayEntry, setTodayEntry] = useState(null);

  const currentQuestion = questionnaireData[currentQuestionIndex];
  const selectedValue = answers[currentQuestion.id];

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    currentQuestionIndex === questionnaireData.length - 1;

  useEffect(() => {
    async function checkTodayEntry() {
      try {
        const existingEntry = await getTodayStressEntry();
        setTodayEntry(existingEntry);
      } catch (error) {
        console.error(
          'Unable to check today’s stress entry:',
          error
        );
      } finally {
        setIsCheckingToday(false);
      }
    }

    checkTodayEntry();
  }, []);

  function selectAnswer(value) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: value,
    }));
  }

  function showMessage(title, message) {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  }

  function formatTodayEntryDate(dateValue) {
    return new Date(dateValue).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async function goToNextQuestion() {
    if (!selectedValue) {
      showMessage(
        'Answer required',
        'Please select an answer before continuing.'
      );
      return;
    }

    if (isLastQuestion) {
      if (isSaving) {
        return;
      }

      try {
        setIsSaving(true);

        const existingTodayEntry =
          await getTodayStressEntry();

        if (existingTodayEntry) {
          setTodayEntry(existingTodayEntry);

          showMessage(
            'Check-in already completed',
            'You already have a main check-in saved for today.'
          );

          return;
        }

        const score = calculateStressScore(answers);

        await saveStressEntry(score, answers);

        navigation.replace('Result', {
          score,
          answers,
        });
      } catch (error) {
        console.error('Unable to save check-in:', error);

        showMessage(
          'Save failed',
          'The check-in could not be saved. Please try again.'
        );
      } finally {
        setIsSaving(false);
      }

      return;
    }

    setCurrentQuestionIndex(
      (previousIndex) => previousIndex + 1
    );
  }

  function goToPreviousQuestion() {
    if (!isFirstQuestion && !isSaving) {
      setCurrentQuestionIndex(
        (previousIndex) => previousIndex - 1
      );
    }
  }

  const progressPercentage =
    ((currentQuestionIndex + 1) /
      questionnaireData.length) *
    100;

  if (isCheckingToday) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Checking today’s daily entry...
        </Text>
      </View>
    );
  }

  if (todayEntry) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.completedContainer}
      >
        <View style={styles.completedCard}>
          <Text style={styles.completedIcon}>✓</Text>

          <Text style={styles.completedTitle}>
            Today’s check-in is complete
          </Text>

          <Text style={styles.completedText}>
            You already have one main daily check-in saved for
            today.
          </Text>

          <View style={styles.savedResultCard}>
            <Text style={styles.savedResultLabel}>
              Today’s saved score
            </Text>

            <Text style={styles.savedResultScore}>
              {todayEntry.score}%
            </Text>

            <Text style={styles.savedResultDate}>
              Saved {formatTodayEntryDate(todayEntry.date)}
            </Text>
          </View>

          <Text style={styles.completedExplanation}>
            Limiting the application to one main result per day
            keeps the history and progress graph consistent.
          </Text>
        </View>

        <Pressable
          style={styles.primaryFullButton}
          onPress={() => navigation.navigate('History')}
          accessibilityRole="button"
          accessibilityLabel="View today’s saved check-in in stress history"
        >
          <Text style={styles.primaryButtonText}>
            View Stress History
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryFullButton}
          onPress={() => navigation.navigate('Progress')}
          accessibilityRole="button"
          accessibilityLabel="View stress progress and statistics"
        >
          <Text style={styles.secondaryButtonText}>
            View Stress Progress
          </Text>
        </Pressable>

        <Pressable
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Return to the home dashboard"
        >
          <Text style={styles.homeButtonText}>
            Return Home
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.progressText}>
        Question {currentQuestionIndex + 1} of{' '}
        {questionnaireData.length}
      </Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.title}>Daily Check-in</Text>

      <Text style={styles.description}>
        Select the answer that best describes how you feel today.
      </Text>

      <View style={styles.card}>
        <Text style={styles.question}>
          {currentQuestion.question}
        </Text>

        {currentQuestion.options.map((option) => {
          const isSelected =
            selectedValue === option.value;

          return (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                isSelected &&
                  styles.selectedOption,
                isSaving &&
                  styles.disabledOption,
              ]}
              onPress={() =>
                selectAnswer(option.value)
              }
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityState={{
                selected: isSelected,
                disabled: isSaving,
              }}
              accessibilityLabel={`${option.label}, rating ${option.value} out of 5`}
            >
              <Text style={styles.emoji}>
                {option.emoji}
              </Text>

              <Text
                style={[
                  styles.optionText,
                  isSelected &&
                    styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>

              <Text
                style={[
                  styles.optionValue,
                  isSelected &&
                    styles.selectedOptionText,
                ]}
              >
                {option.value}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[
            styles.secondaryButton,
            (isFirstQuestion || isSaving) &&
              styles.disabledButton,
          ]}
          onPress={goToPreviousQuestion}
          disabled={isFirstQuestion || isSaving}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              (isFirstQuestion || isSaving) &&
                styles.disabledButtonText,
            ]}
          >
            Previous
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.primaryButton,
            isSaving && styles.savingButton,
          ]}
          onPress={goToNextQuestion}
          disabled={isSaving}
        >
          <Text style={styles.primaryButtonText}>
            {isSaving
              ? 'Saving...'
              : isLastQuestion
                ? 'Complete Check-in'
                : 'Next'}
          </Text>
        </Pressable>
      </View>
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

  loadingContainer: {
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

  completedContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
  },

  completedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  completedIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 64,
    marginBottom: 16,
  },

  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },

  completedText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 20,
  },

  savedResultCard: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
  },

  savedResultLabel: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 6,
  },

  savedResultScore: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 6,
  },

  savedResultDate: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
  },

  completedExplanation: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    textAlign: 'center',
  },

  primaryFullButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    marginBottom: 12,
  },

  secondaryFullButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F766E',
    borderRadius: 12,
    marginBottom: 12,
  },

  homeButton: {
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
  },

  homeButtonText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: 'bold',
  },

  progressText: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#DCE7F8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
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

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 28,
    marginBottom: 20,
  },

  option: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  selectedOption: {
    backgroundColor: '#E8F0FF',
    borderColor: '#2563EB',
  },

  disabledOption: {
    opacity: 0.65,
  },

  emoji: {
    fontSize: 23,
    marginRight: 12,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
  },

  optionValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#64748B',
  },

  selectedOptionText: {
    color: '#2563EB',
    fontWeight: 'bold',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },

  secondaryButton: {
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },

  disabledButton: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },

  disabledButtonText: {
    color: '#94A3B8',
  },

  primaryButton: {
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
  },

  savingButton: {
    backgroundColor: '#64748B',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});