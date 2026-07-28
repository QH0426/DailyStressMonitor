import { useState } from 'react';

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { saveStressEntry } from '../database/database';
import { calculateStressScore } from '../services/stressCalculation';
import questionnaireData from '../services/questionnaireData';

export default function CheckInScreen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = questionnaireData[currentQuestionIndex];
  const selectedValue = answers[currentQuestion.id];

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    currentQuestionIndex === questionnaireData.length - 1;

  function selectAnswer(value) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: value,
    }));
  }

  function showMessage(title, message) {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
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

        const score = calculateStressScore(answers);

        console.log('Questionnaire answers:', answers);
        console.log('Calculated stress score:', score);

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

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
  }

  function goToPreviousQuestion() {
    if (!isFirstQuestion && !isSaving) {
      setCurrentQuestionIndex((previousIndex) => previousIndex - 1);
    }
  }

  const progressPercentage =
    ((currentQuestionIndex + 1) / questionnaireData.length) * 100;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.progressText}>
        Question {currentQuestionIndex + 1} of {questionnaireData.length}
      </Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressPercentage}%` },
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
          const isSelected = selectedValue === option.value;

          return (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                isSaving && styles.disabledOption,
              ]}
              onPress={() => selectAnswer(option.value)}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityState={{
                selected: isSelected,
                disabled: isSaving,
              }}
              accessibilityLabel={`${option.label}, rating ${option.value} out of 5`}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>

              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>

              <Text
                style={[
                  styles.optionValue,
                  isSelected && styles.selectedOptionText,
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
            (isFirstQuestion || isSaving) && styles.disabledButton,
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