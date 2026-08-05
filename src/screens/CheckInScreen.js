import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  Home,
  Leaf,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';
import MoodSelector from '../components/MoodSelector';
import SectionHeader from '../components/SectionHeader';
import WarmCard from '../components/WarmCard';

import {
  getTodayStressEntry,
  saveStressEntry,
} from '../database/database';

import { calculateStressScore } from '../services/stressCalculation';
import questionnaireData from '../services/questionnaireData';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

export default function CheckInScreen({ navigation }) {
  const [checkInStage, setCheckInStage] =
    useState('context');

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] = useState({});
  const [selectedMood, setSelectedMood] = useState('');
  const [dailyNote, setDailyNote] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingToday, setIsCheckingToday] =
    useState(true);

  const [todayEntry, setTodayEntry] = useState(null);

  const currentQuestion =
    questionnaireData[currentQuestionIndex];

  const selectedValue =
    answers[currentQuestion.id];

  const isFirstQuestion =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex ===
    questionnaireData.length - 1;

  useEffect(() => {
    async function checkTodayEntry() {
      try {
        const existingEntry =
          await getTodayStressEntry();

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

  function showMessage(title, message) {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  }

  function formatTodayEntryDate(dateValue) {
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

  function continueToQuestionnaire() {
    if (!selectedMood) {
      showMessage(
        'Mood required',
        'Please select the option that best describes how you feel today.'
      );

      return;
    }

    setCheckInStage('questions');
  }

  function selectAnswer(value) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: value,
    }));
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
            'Reflection already completed',
            'You already have one main daily reflection saved for today.'
          );

          return;
        }

        const score =
          calculateStressScore(answers);

        await saveStressEntry(
          score,
          answers,
          selectedMood,
          dailyNote
        );

        navigation.replace('Result', {
          score,
          answers,
          mood: selectedMood,
          note: dailyNote.trim(),
        });
      } catch (error) {
        console.error(
          'Unable to save check-in:',
          error
        );

        showMessage(
          'Save failed',
          'Your reflection could not be saved. Please try again.'
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
    if (isFirstQuestion) {
      setCheckInStage('context');
      return;
    }

    if (!isSaving) {
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
        <View style={styles.loadingIcon}>
          <Leaf
            size={31}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />
        </View>

        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text style={styles.loadingText}>
          Preparing today’s reflection...
        </Text>
      </View>
    );
  }

  if (todayEntry) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={
          styles.completedContainer
        }
        showsVerticalScrollIndicator={false}
      >
        <WarmCard style={styles.completedCard}>
          <View style={styles.completedIcon}>
            <Check
              size={38}
              color="#54785C"
              strokeWidth={2.2}
            />
          </View>

          <Text style={styles.completedTitle}>
            Today’s reflection is complete
          </Text>

          <Text style={styles.completedText}>
            You already have one main wellbeing
            reflection saved for today.
          </Text>

          <View style={styles.savedResultCard}>
            <Text style={styles.savedResultLabel}>
              Today’s stress level
            </Text>

            <Text style={styles.savedResultScore}>
              {todayEntry.score}%
            </Text>

            {todayEntry.mood ? (
              <Text style={styles.savedContextText}>
                Mood:{' '}
                {todayEntry.mood.replaceAll(
                  '-',
                  ' '
                )}
              </Text>
            ) : null}

            <Text style={styles.savedResultDate}>
              Saved{' '}
              {formatTodayEntryDate(
                todayEntry.date
              )}
            </Text>
          </View>

          <Text style={styles.completedExplanation}>
            One main reflection per day keeps your
            history and wellbeing trends clear and
            consistent.
          </Text>
        </WarmCard>

        <AppButton
          title="View Your Journey"
          icon={ClipboardCheck}
          onPress={() =>
            navigation.navigate('History')
          }
        />

        <AppButton
          title="View Wellbeing Trends"
          variant="sage"
          onPress={() =>
            navigation.navigate('Progress')
          }
        />

        <AppButton
          title="Return Home"
          icon={Home}
          variant="secondary"
          onPress={() =>
            navigation.navigate('Home')
          }
        />
      </ScrollView>
    );
  }

  if (checkInStage === 'context') {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="How are you feeling today?"
          description="Take a quiet moment to reflect before continuing."
          icon={Leaf}
        />

        <WarmCard>
          <Text style={styles.contextTitle}>
            Choose today’s mood
          </Text>

          <Text style={styles.contextHelp}>
            Your mood adds useful personal context
            but does not change the calculated stress
            level.
          </Text>

          <MoodSelector
            selectedMood={selectedMood}
            onSelect={setSelectedMood}
          />
        </WarmCard>

        <WarmCard
          backgroundColor="#FFF9EE"
          borderColor="#ECDDBE"
        >
          <View style={styles.noteHeader}>
            <View style={styles.noteIcon}>
              <FileText
                size={23}
                color="#8B6D35"
                strokeWidth={1.9}
              />
            </View>

            <View style={styles.noteHeadingText}>
              <Text style={styles.contextTitle}>
                Optional daily reflection
              </Text>

              <Text style={styles.contextHelp}>
                Write anything that may have
                influenced your mood or stress today.
              </Text>
            </View>
          </View>

          <TextInput
            style={styles.noteInput}
            value={dailyNote}
            onChangeText={setDailyNote}
            placeholder="For example: Busy day at work, poor sleep or an important event."
            placeholderTextColor="#A49B91"
            multiline
            maxLength={300}
            textAlignVertical="top"
            accessibilityLabel="Optional daily reflection note"
          />

          <Text style={styles.characterCount}>
            {dailyNote.length}/300 characters
          </Text>
        </WarmCard>

        <AppButton
          title="Continue to Questions"
          icon={ArrowRight}
          onPress={continueToQuestionnaire}
        />

        <AppButton
          title="Cancel and Return Home"
          icon={Home}
          variant="secondary"
          onPress={() =>
            navigation.navigate('Home')
          }
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.questionProgressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of{' '}
            {questionnaireData.length}
          </Text>

          <Text style={styles.progressPercentageText}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>

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
      </View>

      <SectionHeader
        title="Your daily reflection"
        description="Choose the answer that feels closest to your experience today."
        icon={ClipboardCheck}
      />

      <WarmCard>
        <Text style={styles.question}>
          {currentQuestion.question}
        </Text>

        {currentQuestion.options.map(
          (option) => {
            const isSelected =
              selectedValue === option.value;

            return (
              <Pressable
                key={option.value}
                style={({ pressed }) => [
                  styles.option,
                  isSelected &&
                    styles.selectedOption,
                  pressed && styles.pressedOption,
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
                <View
                  style={[
                    styles.optionNumber,
                    isSelected &&
                      styles.selectedOptionNumber,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionNumberText,
                      isSelected &&
                        styles.selectedOptionNumberText,
                    ]}
                  >
                    {option.value}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.optionText,
                    isSelected &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>

                <View
                  style={[
                    styles.optionCheck,
                    isSelected &&
                      styles.selectedOptionCheck,
                  ]}
                >
                  {isSelected ? (
                    <Check
                      size={15}
                      color={Colors.white}
                      strokeWidth={2.4}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          }
        )}
      </WarmCard>

      <View style={styles.buttonRow}>
        <AppButton
          title="Previous"
          icon={ArrowLeft}
          variant="secondary"
          onPress={goToPreviousQuestion}
          disabled={isSaving}
          style={styles.halfButton}
        />

        <AppButton
          title={
            isSaving
              ? 'Saving...'
              : isLastQuestion
                ? 'Complete'
                : 'Next'
          }
          icon={
            isLastQuestion
              ? Check
              : ArrowRight
          }
          onPress={goToNextQuestion}
          disabled={isSaving}
          style={styles.halfButton}
        />
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

  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },

  loadingIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
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

  completedContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  completedCard: {
    alignItems: 'center',
  },

  completedIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDF6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },

  completedTitle: {
    fontSize: Typography.heading,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  completedText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: Spacing.lg,
  },

  savedResultCard: {
    width: '100%',
    backgroundColor: '#EDF5F2',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 18,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  savedResultLabel: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },

  savedResultScore: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },

  savedContextText: {
    fontSize: 14,
    color: Colors.text,
    textTransform: 'capitalize',
    marginBottom: Spacing.xs,
  },

  savedResultDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  completedExplanation: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
  },

  contextTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  contextHelp: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: Spacing.md,
  },

  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  noteIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E9CE',
    marginRight: Spacing.md,
  },

  noteHeadingText: {
    flex: 1,
  },

  noteInput: {
    minHeight: 125,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: '#E6D5B5',
    borderRadius: 16,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 23,
  },

  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },

  questionProgressCard: {
    backgroundColor: '#EDF5F2',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryDark,
  },

  progressPercentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
  },

  progressBackground: {
    height: 9,
    backgroundColor: '#D6E6E1',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },

  question: {
    fontSize: 21,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 29,
    marginBottom: Spacing.lg,
  },

  option: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFAF7',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 17,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },

  selectedOption: {
    backgroundColor: '#EDF5F2',
    borderColor: Colors.primary,
    borderWidth: 2,
    ...Shadows.card,
  },

  pressedOption: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  disabledOption: {
    opacity: 0.55,
  },

  optionNumber: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1ECE5',
    marginRight: Spacing.md,
  },

  selectedOptionNumber: {
    backgroundColor: Colors.primary,
  },

  optionNumberText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  selectedOptionNumberText: {
    color: Colors.white,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },

  selectedOptionText: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  optionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedOptionCheck: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  halfButton: {
    flex: 1,
  },
});