import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  ArrowLeft,
  ArrowRight,
  ChartLine,
  Check,
  ClipboardCheck,
  FileText,
  Frown,
  Home,
  Leaf,
  Meh,
  ShieldCheck,
  Smile,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';

import {
  getTodayStressEntry,
  saveStressEntry,
} from '../database/database';

import {
  calculateStressScore,
  getStressCategory,
} from '../services/stressCalculation';

import questionnaireData from '../services/questionnaireData';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

const questionImages = [
  require('../../assets/images/pexels-tara-winstead-8407046.jpg'),
  require('../../assets/images/pexels-vie-studio-7006364.jpg'),
  require('../../assets/images/pexels-julicamph-24536432.jpg'),
  require('../../assets/images/pexels-wr-heustis-310270240-13913991.jpg'),
  require('../../assets/images/pexels-aboodi-19664328.jpg'),
];

const diaryImage =
  require('../../assets/images/pexels-natalie-grishina-62197976-8086416.jpg');

const completedBackgroundImage =
  require('../../assets/images/pexels-nomundodejr-32041165.jpg');

const checkInBackgroundImage =
  require('../../assets/images/pexels-bosichong-28616279.jpg');

const moodOptions = [
  {
    value: 'very-good',
    label: 'Very good',
    Icon: Smile,
    colour: '#4D8B68',
    background: '#EDF6EF',
  },
  {
    value: 'good',
    label: 'Good',
    Icon: Smile,
    colour: Colors.primaryDark,
    background: '#EDF7F5',
  },
  {
    value: 'neutral',
    label: 'Neutral',
    Icon: Meh,
    colour: '#A47E3B',
    background: '#FBF5E8',
  },
  {
    value: 'low',
    label: 'Low',
    Icon: Frown,
    colour: '#B36A55',
    background: '#FCEFEA',
  },
  {
    value: 'very-low',
    label: 'Very low',
    Icon: Frown,
    colour: '#A05E4B',
    background: '#FBECE9',
  },
];

export default function CheckInScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 850;

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

  const currentQuestionImage =
    questionImages[
      currentQuestionIndex % questionImages.length
    ];

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

  /*
    LOADING
  */

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

  /*
    ALREADY COMPLETED TODAY
  */

  if (todayEntry) {
    const savedStressCategory =
      getStressCategory(Number(todayEntry.score));

    // Match the saved mood to the same icon and colours
    // used when the mood was originally selected.
    const savedMoodOption =
      moodOptions.find(
        (option) => option.value === todayEntry.mood
      ) || null;

    const SavedMoodIcon =
      savedMoodOption?.Icon || Meh;

    return (
      <ImageBackground
        source={completedBackgroundImage}
        style={styles.completedBackground}
        resizeMode="cover"
      >
        <View style={styles.completedOverlay}>
          <ScrollView
            contentContainerStyle={
              styles.completedContainer
            }
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.completedWrapper}>
              <View style={styles.completedTopLabel}>
                <Leaf
                  size={17}
                  color={Colors.primaryDark}
                  strokeWidth={1.9}
                />

                <Text
                  style={
                    styles.completedTopLabelText
                  }
                >
                  DAILY WELLBEING
                </Text>
              </View>

              <View style={styles.completedCard}>
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
                    TODAY’S ESTIMATED STRESS LEVEL
                  </Text>

                  <Text style={styles.savedResultScore}>
                    {todayEntry.score}%
                  </Text>

                  <View
                    style={styles.savedCategoryBadge}
                  >
                    <Text
                      style={[
                        styles.savedCategoryText,
                        {
                          color:
                            savedStressCategory.colour,
                        },
                      ]}
                    >
                      Stress category:{' '}
                      {savedStressCategory.label}
                    </Text>
                  </View>

                  {todayEntry.mood ? (
                    <View
                      style={[
                        styles.savedMoodBadge,
                        savedMoodOption && {
                          backgroundColor:
                            savedMoodOption.background,
                          borderColor:
                            savedMoodOption.colour,
                        },
                      ]}
                    >
                      <SavedMoodIcon
                        size={17}
                        color={
                          savedMoodOption?.colour ||
                          Colors.primaryDark
                        }
                        strokeWidth={1.9}
                      />

                      <Text
                        style={[
                          styles.savedContextText,
                          savedMoodOption && {
                            color:
                              savedMoodOption.colour,
                          },
                        ]}
                      >
                        Mood:{' '}
                        {todayEntry.mood
                          .replaceAll('-', ' ')
                          .replace(
                            /\b\w/g,
                            (letter) =>
                              letter.toUpperCase()
                          )}
                      </Text>
                    </View>
                  ) : null}

                  <Text style={styles.savedResultDate}>
                    Saved{' '}
                    {formatTodayEntryDate(
                      todayEntry.date
                    )}
                  </Text>
                </View>

                <View
                  style={styles.completedMessageCard}
                >
                  <ShieldCheck
                    size={21}
                    color={Colors.primaryDark}
                    strokeWidth={1.9}
                  />

                  <Text
                    style={
                      styles.completedExplanation
                    }
                  >
                    One main reflection per day keeps
                    your history and wellbeing trends
                    clear and consistent.
                  </Text>
                </View>
              </View>

              <View
                style={styles.completedActionsHeader}
              >
                <Text
                  style={styles.completedActionsTitle}
                >
                  Continue your wellbeing journey
                </Text>

                <Text
                  style={
                    styles.completedActionsSubtitle
                  }
                >
                  Review your reflections or explore
                  how your wellbeing is changing over
                  time.
                </Text>
              </View>

              <View
                style={[
                  styles.completedButtons,
                  isWide &&
                    styles.completedButtonsWide,
                ]}
              >
                <View
                  style={styles.completedButtonItem}
                >
                  <AppButton
                    title="View Your Journey"
                    icon={ClipboardCheck}
                    onPress={() =>
                      navigation.navigate('History')
                    }
                  />
                </View>

                <View
                  style={styles.completedButtonItem}
                >
                  <AppButton
                    title="View Wellbeing Trends"
                    icon={ChartLine}
                    variant="sage"
                    onPress={() =>
                      navigation.navigate('Progress')
                    }
                  />
                </View>

                <View
                  style={styles.completedButtonItem}
                >
                  <AppButton
                    title="Return Home"
                    icon={Home}
                    variant="secondary"
                    onPress={() =>
                      navigation.navigate('Home')
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

  /*
    MOOD + DAILY NOTE
  */

  if (checkInStage === 'context') {
    return (
      <ImageBackground
        source={checkInBackgroundImage}
        style={styles.checkInBackground}
        resizeMode="cover"
      >
        <View style={styles.checkInOverlay}>
          <ScrollView
            style={styles.transparentScreen}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentWrapper}>
              <View style={styles.pageIntro}>
                <View style={styles.introIcon}>
                  <Leaf
                    size={26}
                    color={Colors.primaryDark}
                    strokeWidth={1.9}
                  />
                </View>

                <View style={styles.pageIntroText}>
                  <Text style={styles.pageTitle}>
                    How are you feeling today?
                  </Text>

                  <Text style={styles.pageSubtitle}>
                    Take a quiet moment to reflect
                    before continuing.
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.contextHero,
                  isWide && styles.contextHeroWide,
                ]}
              >
                <View
                  style={[
                    styles.contextImageContainer,
                    isWide &&
                      styles.contextImageContainerWide,
                  ]}
                >
                  <Image
                    source={diaryImage}
                    style={styles.contextImage}
                    resizeMode="cover"
                  />

                  <View
                    style={styles.contextImageOverlay}
                  />

                  <View style={styles.imageCaption}>
                    <Text
                      style={styles.imageCaptionSmall}
                    >
                      DAILY REFLECTION
                    </Text>

                    <Text
                      style={styles.imageCaptionMain}
                    >
                      Your thoughts matter.
                    </Text>

                    <Text
                      style={styles.imageCaptionText}
                    >
                      Take a moment to notice how
                      today has felt for you.
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.contextContent,
                    isWide &&
                      styles.contextContentWide,
                  ]}
                >
                  <View style={styles.contextSection}>
                    <Text
                      style={styles.contextEyebrow}
                    >
                      STEP 1
                    </Text>

                    <Text style={styles.contextTitle}>
                      Choose today’s mood
                    </Text>

                    <Text style={styles.contextHelp}>
                      Your mood adds useful personal
                      context but does not change the
                      calculated stress level.
                    </Text>

                    <Text style={styles.moodQuestion}>
                      How are you feeling today?
                    </Text>

                    <Text
                      style={styles.moodInstruction}
                    >
                      Choose the option that feels
                      closest to your mood right now.
                    </Text>

                    <View style={styles.moodGrid}>
                      {moodOptions.map(
                        (moodOption) => {
                          const MoodIcon =
                            moodOption.Icon;

                          const isSelected =
                            selectedMood ===
                            moodOption.value;

                          return (
                            <Pressable
                              key={moodOption.value}
                              style={({ pressed }) => [
                                styles.moodCard,
                                isSelected &&
                                  styles.selectedMoodCard,
                                isSelected && {
                                  borderColor:
                                    moodOption.colour,
                                  backgroundColor:
                                    moodOption.background,
                                },
                                pressed &&
                                  styles.pressedMoodCard,
                              ]}
                              onPress={() =>
                                setSelectedMood(
                                  moodOption.value
                                )
                              }
                            >
                              <View
                                style={[
                                  styles.moodIconCircle,
                                  {
                                    backgroundColor:
                                      moodOption.background,
                                  },
                                  isSelected && {
                                    borderColor:
                                      moodOption.colour,
                                  },
                                ]}
                              >
                                <MoodIcon
                                  size={30}
                                  color={
                                    moodOption.colour
                                  }
                                  strokeWidth={1.8}
                                />
                              </View>

                              <Text
                                style={[
                                  styles.moodLabel,
                                  {
                                    color:
                                      moodOption.colour,
                                  },
                                ]}
                              >
                                {moodOption.label}
                              </Text>

                              <View
                                style={[
                                  styles.moodSelectionDot,
                                  isSelected && {
                                    borderColor:
                                      moodOption.colour,
                                    backgroundColor:
                                      moodOption.colour,
                                  },
                                ]}
                              >
                                {isSelected ? (
                                  <Check
                                    size={12}
                                    color={Colors.white}
                                    strokeWidth={2.5}
                                  />
                                ) : null}
                              </View>
                            </Pressable>
                          );
                        }
                      )}
                    </View>
                  </View>

                  <View style={styles.noteSection}>
                    <View style={styles.noteHeader}>
                      <View style={styles.noteIcon}>
                        <FileText
                          size={22}
                          color="#8B6D35"
                          strokeWidth={1.9}
                        />
                      </View>

                      <View
                        style={styles.noteHeadingText}
                      >
                        <Text style={styles.noteTitle}>
                          Optional daily reflection
                        </Text>

                        <Text style={styles.noteHelp}>
                          Add anything that may have
                          influenced your mood or
                          stress today.
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

                    <Text
                      style={styles.characterCount}
                    >
                      {dailyNote.length}/300 characters
                    </Text>
                  </View>

                  <View style={styles.contextButtons}>
                    <AppButton
                      title="Continue to Questions"
                      icon={ArrowRight}
                      onPress={
                        continueToQuestionnaire
                      }
                    />

                    <AppButton
                      title="Cancel and Return Home"
                      icon={Home}
                      variant="secondary"
                      onPress={() =>
                        navigation.navigate('Home')
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }

  /*
    FIVE QUESTIONS
  */

  return (
    <ImageBackground
      source={checkInBackgroundImage}
      style={styles.checkInBackground}
      resizeMode="cover"
    >
      <View style={styles.questionBackgroundOverlay}>
        <ScrollView
          style={styles.transparentScreen}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.questionTopRow}>
              <View
                style={styles.questionTitleContainer}
              >
                <Text
                  style={styles.questionPageLabel}
                >
                  DAILY REFLECTION
                </Text>

                <Text
                  style={styles.questionPageTitle}
                >
                  Check in with yourself
                </Text>
              </View>

              <View style={styles.numberBadge}>
                <Text style={styles.questionNumber}>
                  {currentQuestionIndex + 1}
                  <Text
                    style={styles.questionNumberTotal}
                  >
                    /{questionnaireData.length}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.questionProgressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  Question {currentQuestionIndex + 1} of{' '}
                  {questionnaireData.length}
                </Text>

                <Text
                  style={
                    styles.progressPercentageText
                  }
                >
                  {Math.round(progressPercentage)}%
                </Text>
              </View>

              <View
                style={styles.progressBackground}
              >
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

            <View
              style={[
                styles.questionLayout,
                isWide && styles.questionLayoutWide,
              ]}
            >
              <View
                style={[
                  styles.questionVisual,
                  isWide &&
                    styles.questionVisualWide,
                ]}
              >
                <Image
                  source={currentQuestionImage}
                  style={styles.questionImage}
                  resizeMode="cover"
                />

                <View
                  style={styles.questionImageOverlay}
                />

                <View
                  style={
                    styles.questionVisualMessage
                  }
                >
                  <Text
                    style={styles.visualMessageSmall}
                  >
                    A MOMENT FOR YOU
                  </Text>

                  <Text
                    style={styles.visualMessageMain}
                  >
                    There is no right or wrong answer.
                  </Text>

                  <Text
                    style={styles.visualMessageText}
                  >
                    Choose the response that feels
                    closest to your experience today.
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.questionCard,
                  isWide && styles.questionCardWide,
                ]}
              >
                <View
                  style={styles.questionHeadingRow}
                >
                  <View style={styles.questionIcon}>
                    <ClipboardCheck
                      size={24}
                      color={Colors.primaryDark}
                      strokeWidth={1.9}
                    />
                  </View>

                  <View
                    style={
                      styles.questionHeadingText
                    }
                  >
                    <Text
                      style={
                        styles.questionSmallHeading
                      }
                    >
                      Your daily reflection
                    </Text>

                    <Text
                      style={
                        styles.questionInstruction
                      }
                    >
                      Select one answer below.
                    </Text>
                  </View>
                </View>

                <Text style={styles.question}>
                  {currentQuestion.question}
                </Text>

                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map(
                    (option) => {
                      const isSelected =
                        selectedValue ===
                        option.value;

                      return (
                        <Pressable
                          key={option.value}
                          style={({ pressed }) => [
                            styles.option,
                            isSelected &&
                              styles.selectedOption,
                            pressed &&
                              styles.pressedOption,
                            isSaving &&
                              styles.disabledOption,
                          ]}
                          onPress={() =>
                            selectAnswer(option.value)
                          }
                          disabled={isSaving}
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
                </View>

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
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  checkInBackground: {
    flex: 1,
    width: '100%',
  },

  checkInOverlay: {
    flex: 1,
    backgroundColor: 'rgba(247,244,239,0.38)',
  },

  questionBackgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(247,244,239,0.42)',
  },

  transparentScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  screen: {
    flex: 1,
    backgroundColor: '#F7F4EF',
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

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },

  loadingIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
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

  completedBackground: {
    flex: 1,
    width: '100%',
  },

  completedOverlay: {
    flex: 1,
    backgroundColor: 'rgba(247,244,239,0.18)',
  },

  completedContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    paddingVertical: 42,
  },

  completedWrapper: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },

  completedTopLabel: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232,242,238,0.94)',
    borderWidth: 1,
    borderColor: '#C6DDD5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  completedTopLabelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.primaryDark,
    marginLeft: 7,
  },

  completedCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(238,246,242,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(199,220,211,0.95)',
    borderRadius: 30,
    padding: 34,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  completedIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: '#DCEBDD',
    borderWidth: 1,
    borderColor: '#C4DDC8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },

  completedTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 7,
  },

  completedText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 520,
    marginBottom: Spacing.lg,
  },

  savedResultCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(226,240,236,0.96)',
    borderWidth: 1,
    borderColor: '#BDD9D0',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  savedResultLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primaryDark,
    marginBottom: 7,
  },

  savedResultScore: {
    fontSize: 58,
    fontWeight: '700',
    color: Colors.primaryDark,
    lineHeight: 68,
    marginBottom: 6,
  },

  savedCategoryBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: '#C9DED7',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 9,
  },

  savedCategoryText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  savedMoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: '#C9DED7',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 9,
  },

  savedContextText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 6,
  },

  savedResultDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  completedMessageCard: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249,236,213,0.95)',
    borderWidth: 1,
    borderColor: '#E4CAA0',
    borderRadius: 17,
    padding: Spacing.md,
  },

  completedExplanation: {
    flex: 1,
    fontSize: 13,
    color: '#6B6256',
    lineHeight: 19,
    marginLeft: Spacing.sm,
  },

  completedActionsHeader: {
    alignItems: 'center',
    backgroundColor: 'rgba(232,242,238,0.93)',
    borderWidth: 1,
    borderColor: '#C4DCD3',
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  completedActionsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 3,
  },

  completedActionsSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 550,
  },

  completedButtons: {
    gap: Spacing.sm,
  },

  completedButtonsWide: {
    flexDirection: 'row',
  },

  completedButtonItem: {
    flex: 1,
  },

  pageIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232,242,238,0.94)',
    borderWidth: 1,
    borderColor: '#C4DDD4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  pageIntroText: {
    flexShrink: 1,
  },

  introIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEBE5',
    marginRight: Spacing.md,
  },

  pageTitle: {
    fontSize: Typography.heading,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },

  pageSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  contextHero: {
    backgroundColor: 'rgba(244,247,243,0.92)',
    borderWidth: 1,
    borderColor: '#CEDDD3',
    borderRadius: 28,
    overflow: 'hidden',
    ...Shadows.card,
  },

  contextHeroWide: {
    flexDirection: 'row',
    minHeight: 650,
  },

  contextImageContainer: {
    minHeight: 330,
    position: 'relative',
    overflow: 'hidden',
  },

  contextImageContainerWide: {
    width: '40%',
    minHeight: 650,
  },

  contextImage: {
    position: 'absolute',
    width: '112%',
    height: '100%',
    left: '-4%',
    top: 0,
  },

  contextImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(80,65,50,0.06)',
  },

  imageCaption: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 22,
    backgroundColor: 'rgba(250,240,220,0.93)',
    borderWidth: 1,
    borderColor: 'rgba(229,207,171,0.85)',
    borderRadius: 18,
    padding: Spacing.md,
  },

  imageCaptionSmall: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#8B6D35',
    marginBottom: 5,
  },

  imageCaptionMain: {
    fontSize: 19,
    fontWeight: '700',
    color: '#493F36',
    marginBottom: 5,
  },

  imageCaptionText: {
    fontSize: 13,
    color: '#756C62',
    lineHeight: 19,
  },

  contextContent: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(238,245,241,0.82)',
  },

  contextContentWide: {
    width: '60%',
    padding: 34,
    justifyContent: 'center',
  },

  contextSection: {
    backgroundColor: 'rgba(230,242,236,0.94)',
    borderWidth: 1,
    borderColor: '#C3DDD0',
    borderRadius: 22,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  contextEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primaryDark,
    marginBottom: 6,
  },

  contextTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  contextHelp: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: Spacing.md,
  },

  moodQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  moodInstruction: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },

  moodCard: {
    width: '20%',
    minHeight: 125,
    padding: 10,
    borderWidth: 5,
    borderColor: 'rgba(230,242,236,0.75)',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  selectedMoodCard: {
    borderWidth: 2,
    ...Shadows.card,
  },

  pressedMoodCard: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  moodIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 9,
  },

  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  moodSelectionDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 21,
    height: 21,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#D7D2CB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  noteSection: {
    backgroundColor: 'rgba(250,239,218,0.95)',
    borderWidth: 1,
    borderColor: '#E4CAA0',
    borderRadius: 22,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },

  noteIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1DEB7',
    marginRight: Spacing.md,
  },

  noteHeadingText: {
    flex: 1,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  noteHelp: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  noteInput: {
    minHeight: 115,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1.5,
    borderColor: '#E1C89C',
    borderRadius: 16,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 23,
  },

  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },

  contextButtons: {
    gap: Spacing.sm,
  },

  questionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(232,242,238,0.94)',
    borderWidth: 1,
    borderColor: '#C4DDD4',
    borderRadius: 20,
    padding: 15,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  questionTitleContainer: {
    flex: 1,
  },

  questionPageLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primaryDark,
    marginBottom: 4,
  },

  questionPageTitle: {
    fontSize: Typography.heading,
    fontWeight: '700',
    color: Colors.text,
  },

  numberBadge: {
    minWidth: 72,
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(214,232,225,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },

  questionNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  questionNumberTotal: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  questionProgressCard: {
    backgroundColor: 'rgba(226,240,236,0.95)',
    borderWidth: 1,
    borderColor: '#BDD9D0',
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  progressText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primaryDark,
  },

  progressPercentageText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#CFE2DC',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },

  questionLayout: {
    backgroundColor: 'rgba(242,246,242,0.93)',
    borderWidth: 1,
    borderColor: '#CBDDD2',
    borderRadius: 28,
    overflow: 'hidden',
    ...Shadows.card,
  },

  questionLayoutWide: {
    flexDirection: 'row',
    minHeight: 610,
  },

  questionVisual: {
    minHeight: 300,
    position: 'relative',
    overflow: 'hidden',
  },

  questionVisualWide: {
    width: '38%',
    minHeight: 610,
  },

  questionImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  questionImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40,50,45,0.08)',
  },

  questionVisualMessage: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 22,
    backgroundColor: 'rgba(232,242,238,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(196,221,212,0.90)',
    borderRadius: 18,
    padding: Spacing.md,
  },

  visualMessageSmall: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primaryDark,
    marginBottom: 5,
  },

  visualMessageMain: {
    fontSize: 18,
    fontWeight: '700',
    color: '#354B43',
    marginBottom: 5,
  },

  visualMessageText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  questionCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(239,245,241,0.90)',
  },

  questionCardWide: {
    width: '62%',
    padding: 34,
    justifyContent: 'center',
  },

  questionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  questionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEBE5',
    marginRight: Spacing.md,
  },

  questionHeadingText: {
    flex: 1,
  },

  questionSmallHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 2,
  },

  questionInstruction: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  question: {
    fontSize: 23,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 31,
    marginBottom: Spacing.lg,
  },

  optionsContainer: {
    marginBottom: Spacing.sm,
  },

  option: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,239,222,0.82)',
    borderWidth: 1.5,
    borderColor: '#E5CFAB',
    borderRadius: 17,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },

  selectedOption: {
    backgroundColor: 'rgba(220,238,231,0.98)',
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
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1DEBF',
    marginRight: Spacing.md,
  },

  selectedOptionNumber: {
    backgroundColor: Colors.primary,
  },

  optionNumberText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7B674A',
  },

  selectedOptionNumberText: {
    color: Colors.white,
  },

  optionText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },

  selectedOptionText: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  optionCheck: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D4BE98',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.60)',
  },

  selectedOptionCheck: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },

  halfButton: {
    flex: 1,
  },
});