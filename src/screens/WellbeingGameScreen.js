import {
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  CheckCircle2,
  Heart,
  Sparkles,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';
import SectionHeader from '../components/SectionHeader';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';

export default function WellbeingGameScreen({
  navigation,
  route,
}) {
  const challenge =
    route.params?.challenge || null;

  const score =
    route.params?.score ?? 0;

  const profileSource =
    challenge?.profileSource || 'General';

  const [step, setStep] =
    useState(0);

  const [
    answers,
    setAnswers,
  ] = useState([
    '',
    '',
    '',
  ]);

  const activity =
    getActivityForChallenge(
      profileSource,
      challenge
    );

  function updateAnswer(
    answerIndex,
    value
  ) {
    setAnswers(
      (currentAnswers) => {
        const updatedAnswers = [
          ...currentAnswers,
        ];

        updatedAnswers[
          answerIndex
        ] = value;

        return updatedAnswers;
      }
    );
  }

  function moveToNextStep() {
    if (
      step <
      activity.steps.length - 1
    ) {
      setStep(step + 1);
      return;
    }

    setStep(
      activity.steps.length
    );
  }

  function returnToChallenge() {
    navigation.navigate(
      'Challenge',
      {
        score,
        activityCompleted: true,
      }
    );
  }

  const activityCompleted =
    step >=
    activity.steps.length;

  if (activityCompleted) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <SectionHeader
          title="Activity Complete"
          description="You have completed your personalised wellbeing activity."
          icon={CheckCircle2}
        />

        <View
          style={
            styles.completedCard
          }
        >
          <View
            style={
              styles.completedIcon
            }
          >
            <CheckCircle2
              size={42}
              color="#54785C"
              strokeWidth={1.8}
            />
          </View>

          <Text
            style={
              styles.completedTitle
            }
          >
            Well done
          </Text>

          <Text
            style={
              styles.completedText
            }
          >
            Take a moment to notice
            how you feel now.
          </Text>

          <Text
            style={
              styles.completedReminder
            }
          >
            Your next step is to
            return to your challenge
            and share your own
            feedback about how the
            activity felt.
          </Text>

          <AppButton
            title="Give My Feedback"
            onPress={
              returnToChallenge
            }
          />
        </View>
      </ScrollView>
    );
  }

  const currentStep =
    activity.steps[step];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
    >
      <SectionHeader
        title={activity.title}
        description={
          activity.description
        }
        icon={Sparkles}
      />

      <View
        style={
          styles.progressCard
        }
      >
        <Text
          style={
            styles.progressLabel
          }
        >
          STEP {step + 1} OF{' '}
          {activity.steps.length}
        </Text>

        <View
          style={
            styles.progressTrack
          }
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((step + 1) /
                    activity.steps
                      .length) *
                  100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <View
        style={
          styles.activityCard
        }
      >
        <View
          style={
            styles.activityIcon
          }
        >
          <Heart
            size={28}
            color={
              Colors.primaryDark
            }
            strokeWidth={1.8}
          />
        </View>

        <Text
          style={
            styles.stepTitle
          }
        >
          {currentStep.title}
        </Text>

        <Text
          style={
            styles.stepText
          }
        >
          {
            currentStep.instruction
          }
        </Text>

        {currentStep.type ===
        'input' ? (
          <TextInput
            style={styles.input}
            value={answers[step]}
            onChangeText={(
              value
            ) =>
              updateAnswer(
                step,
                value
              )
            }
            placeholder={
              currentStep.placeholder
            }
            placeholderTextColor="#8A8A8A"
            multiline
            textAlignVertical="top"
          />
        ) : null}

        {currentStep.type ===
        'choice' ? (
          <View
            style={
              styles.choiceContainer
            }
          >
            {currentStep.options.map(
              (option) => {
                const selected =
                  answers[step] ===
                  option;

                return (
                  <Pressable
                    key={option}
                    style={({
                      pressed,
                    }) => [
                      styles.choiceButton,

                      selected &&
                        styles.choiceButtonSelected,

                      pressed &&
                        styles.choiceButtonPressed,
                    ]}
                    onPress={() =>
                      updateAnswer(
                        step,
                        option
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.choiceText,

                        selected &&
                          styles.choiceTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>
        ) : null}
      </View>

      <View
        style={
          styles.navigationRow
        }
      >
        {step > 0 ? (
          <View
            style={
              styles.navigationButton
            }
          >
            <AppButton
              title="Previous"
              variant="secondary"
              onPress={() =>
                setStep(step - 1)
              }
            />
          </View>
        ) : null}

        <View
          style={
            styles.navigationButton
          }
        >
          <AppButton
            title={
              step ===
              activity.steps
                .length -
                1
                ? 'Complete Activity'
                : 'Next'
            }
            onPress={
              moveToNextStep
            }
          />
        </View>
      </View>

      <Text
        style={
          styles.disclaimer
        }
      >
        This activity is designed
        for personal wellbeing
        reflection. It is not a
        medical assessment or
        treatment.
      </Text>
    </ScrollView>
  );
}

function getActivityForChallenge(
  profileSource,
  challenge
) {
  if (
    profileSource ===
    'Calming place'
  ) {
    return {
      title:
        '3–2–1 Calming Place',

      description:
        'Use your personal calming place to gently focus your attention.',

      steps: [
        {
          type: 'input',

          title:
            '3 things you can see',

          instruction:
            'Imagine yourself in your calming place. Write three things you can picture seeing there.',

          placeholder:
            'For example: trees, water, sunlight...',
        },

        {
          type: 'input',

          title:
            '2 things you can hear',

          instruction:
            'Now think about two sounds you might hear in that place.',

          placeholder:
            'For example: waves, birds...',
        },

        {
          type: 'input',

          title:
            '1 thing you can feel',

          instruction:
            'Finally, think of one physical feeling you associate with that place.',

          placeholder:
            'For example: warm sunshine...',
        },
      ],
    };
  }

  if (
    profileSource ===
    'Favourite music'
  ) {
    return {
      title: 'Music Reset',

      description:
        'Take a short personalised pause with music you enjoy.',

      steps: [
        {
          type: 'choice',

          title:
            'Choose your moment',

          instruction:
            `Your Positive Profile says you enjoy ${
              challenge
                ?.profileSource ===
              'Favourite music'
                ? 'your favourite music'
                : 'music'
            }. How would you like to use it right now?`,

          options: [
            'Listen quietly',
            'Close my eyes and listen',
            'Focus on the lyrics or sound',
          ],
        },

        {
          type: 'input',

          title:
            'Notice one detail',

          instruction:
            'While thinking about or listening to the music, notice one detail you particularly enjoy.',

          placeholder:
            'Write one thing you noticed...',
        },

        {
          type: 'input',

          title:
            'Notice the moment',

          instruction:
            'Write a few words about how you feel at this moment. There is no right or wrong answer.',

          placeholder:
            'How do you feel right now?',
        },
      ],
    };
  }

  if (
    profileSource ===
    'Important person'
  ) {
    return {
      title:
        'Positive Connection',

      description:
        'Use a positive personal connection as a short wellbeing activity.',

      steps: [
        {
          type: 'input',

          title:
            'Think of a positive moment',

          instruction:
            'Think about the important person from your Positive Profile. Write one positive moment you remember sharing with them.',

          placeholder:
            'A positive moment...',
        },

        {
          type: 'input',

          title:
            'What made it meaningful?',

          instruction:
            'What made that moment important or enjoyable for you?',

          placeholder:
            'What made it meaningful?',
        },

        {
          type: 'choice',

          title:
            'Choose a small positive action',

          instruction:
            'If it feels appropriate, choose one simple action you could take.',

          options: [
            'Send them a message',
            'Talk to them later',
            'Simply keep the positive memory',
          ],
        },
      ],
    };
  }

  if (
    profileSource ===
    'Happy memory'
  ) {
    return {
      title:
        'Positive Memory',

      description:
        'Spend a short moment reconnecting with a positive memory.',

      steps: [
        {
          type: 'input',

          title:
            'Picture the memory',

          instruction:
            'Think about the happy memory from your Positive Profile. What is the first detail you remember?',

          placeholder:
            'Something you remember...',
        },

        {
          type: 'input',

          title:
            'What made you happy?',

          instruction:
            'Write one thing that made this memory positive for you.',

          placeholder:
            'What made it positive?',
        },

        {
          type: 'input',

          title:
            'Take something from it',

          instruction:
            'Is there one feeling, person or experience from this memory that you would like to carry into today?',

          placeholder:
            'One positive thing...',
        },
      ],
    };
  }

  if (
    profileSource ===
    'Favourite activity'
  ) {
    return {
      title:
        'Enjoyable Activity',

      description:
        'Reconnect with something you personally enjoy.',

      steps: [
        {
          type: 'input',

          title:
            'Think about the activity',

          instruction:
            'What do you enjoy most about this activity?',

          placeholder:
            'What you enjoy...',
        },

        {
          type: 'choice',

          title:
            'Make a small plan',

          instruction:
            'Choose a realistic way to make some space for this activity.',

          options: [
            'A few minutes today',
            'Later this week',
            'Plan it for the weekend',
          ],
        },

        {
          type: 'input',

          title:
            'Your positive reason',

          instruction:
            'Write one reason why making time for this activity matters to you.',

          placeholder:
            'Why it matters...',
        },
      ],
    };
  }

  if (
    profileSource ===
    'Achievement'
  ) {
    return {
      title:
        'Something I Am Proud Of',

      description:
        'Use one of your achievements as a positive reflection.',

      steps: [
        {
          type: 'input',

          title:
            'Remember your achievement',

          instruction:
            'Think about the achievement saved in your Positive Profile. What did you do to achieve it?',

          placeholder:
            'Something you did...',
        },

        {
          type: 'input',

          title:
            'Recognise your strength',

          instruction:
            'What personal strength helped you?',

          placeholder:
            'For example: patience, effort...',
        },

        {
          type: 'input',

          title:
            'Use that strength today',

          instruction:
            'How could that same strength help you today?',

          placeholder:
            'One small way...',
        },
      ],
    };
  }

  if (
    profileSource ===
    'Looking forward to'
  ) {
    return {
      title:
        'Something Positive Ahead',

      description:
        'Spend a moment focusing on something you are looking forward to.',

      steps: [
        {
          type: 'input',

          title: 'Picture it',

          instruction:
            'What part of this future event or experience are you most looking forward to?',

          placeholder:
            'What you are looking forward to...',
        },

        {
          type: 'input',

          title:
            'Why does it matter?',

          instruction:
            'What makes this something positive for you?',

          placeholder:
            'Why it matters...',
        },

        {
          type: 'choice',

          title:
            'Keep the positive focus',

          instruction:
            'Choose one simple way to keep this positive thought with you today.',

          options: [
            'Write myself a reminder',
            'Tell someone about it',
            'Take a moment to picture it again later',
          ],
        },
      ],
    };
  }

  return {
    title: 'Positive Pause',

    description:
      'A short activity to support personal reflection.',

    steps: [
      {
        type: 'input',

        title:
          'Notice something positive',

        instruction:
          'Write one thing that went well today or something that made you smile.',

        placeholder:
          'Something positive...',
      },

      {
        type: 'input',

        title:
          'Why did it matter?',

        instruction:
          'Write a few words about why this moment was meaningful to you.',

        placeholder:
          'Why it mattered...',
      },

      {
        type: 'choice',

        title:
          'Choose your next small step',

        instruction:
          'Choose one simple thing you would like to do next.',

        options: [
          'Take a short break',
          'Do something I enjoy',
          'Connect with someone',
        ],
      },
    ],
  };
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        Colors.background,
    },

    container: {
      flexGrow: 1,

      padding: Spacing.lg,

      paddingBottom:
        Spacing.xxl,
    },

    progressCard: {
      backgroundColor:
        '#EDF5F2',

      borderWidth: 1,

      borderColor:
        '#D2E5DF',

      borderRadius: 18,

      padding: Spacing.md,

      marginBottom:
        Spacing.lg,
    },

    progressLabel: {
      fontSize: 11,

      fontWeight: '700',

      letterSpacing: 1,

      color:
        Colors.primaryDark,

      marginBottom:
        Spacing.sm,
    },

    progressTrack: {
      height: 8,

      borderRadius: 4,

      backgroundColor:
        '#D5E3DF',

      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',

      borderRadius: 4,

      backgroundColor:
        Colors.primary,
    },

    activityCard: {
      backgroundColor:
        '#FFFDFC',

      borderWidth: 1,

      borderColor:
        '#E5DED5',

      borderRadius: 22,

      padding: Spacing.lg,

      marginBottom:
        Spacing.lg,
    },

    activityIcon: {
      width: 54,

      height: 54,

      borderRadius: 18,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        '#F0E3DE',

      marginBottom:
        Spacing.md,
    },

    stepTitle: {
      fontSize: 21,

      fontWeight: '700',

      color: Colors.text,

      marginBottom:
        Spacing.sm,
    },

    stepText: {
      fontSize: 15,

      color:
        Colors.textSecondary,

      lineHeight: 23,

      marginBottom:
        Spacing.lg,
    },

    input: {
      minHeight: 110,

      borderWidth: 1,

      borderColor:
        '#C9DAD4',

      borderRadius: 15,

      backgroundColor:
        '#F8FBFA',

      padding: Spacing.md,

      fontSize: 14,

      color: Colors.text,
    },

    choiceContainer: {
      width: '100%',
    },

    choiceButton: {
      borderWidth: 1,

      borderColor:
        '#C9DAD4',

      borderRadius: 14,

      paddingHorizontal:
        Spacing.md,

      paddingVertical: 14,

      marginBottom:
        Spacing.sm,

      backgroundColor:
        '#F8FBFA',
    },

    choiceButtonSelected: {
      borderColor:
        Colors.primary,

      backgroundColor:
        '#E3F0EC',
    },

    choiceButtonPressed: {
      opacity: 0.75,
    },

    choiceText: {
      fontSize: 14,

      color: Colors.text,

      textAlign: 'center',
    },

    choiceTextSelected: {
      color:
        Colors.primaryDark,

      fontWeight: '700',
    },

    navigationRow: {
      flexDirection: 'row',

      marginHorizontal: -5,

      marginBottom:
        Spacing.lg,
    },

    navigationButton: {
      flex: 1,

      paddingHorizontal: 5,
    },

    disclaimer: {
      fontSize: 12,

      color:
        Colors.textSecondary,

      lineHeight: 18,

      textAlign: 'center',

      paddingHorizontal:
        Spacing.md,
    },

    completedCard: {
      backgroundColor:
        '#FFFDFC',

      borderWidth: 1,

      borderColor:
        '#C9DFC9',

      borderRadius: 22,

      padding: Spacing.xl,

      alignItems: 'center',
    },

    completedIcon: {
      width: 78,

      height: 78,

      borderRadius: 39,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        '#EDF6EF',

      marginBottom:
        Spacing.md,
    },

    completedTitle: {
      fontSize: 24,

      fontWeight: '700',

      color: Colors.text,

      marginBottom:
        Spacing.sm,
    },

    completedText: {
      fontSize: 16,

      color: Colors.text,

      textAlign: 'center',

      marginBottom:
        Spacing.sm,
    },

    completedReminder: {
      fontSize: 14,

      color:
        Colors.textSecondary,

      lineHeight: 21,

      textAlign: 'center',

      marginBottom:
        Spacing.lg,
    },
  });