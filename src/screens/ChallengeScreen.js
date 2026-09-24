import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CheckCircle2,
  Heart,
  Play,
  Sparkles,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';
import SectionHeader from '../components/SectionHeader';
import WarmCard from '../components/WarmCard';

import {
  getChallengeFeedback,
  getPositiveProfile,
  saveChallengeFeedback,
} from '../services/firestoreService';

import {
  getPersonalisedChallenge,
} from '../services/challengeLogic';

import {
  analyseHelpfulActivities,
} from '../services/helpfulActivities';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';

export default function ChallengeScreen({
  navigation,
  route,
}) {
  const score =
    route.params?.score ?? 0;

  const [
    challenge,
    setChallenge,
  ] = useState(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    selectedFeedback,
    setSelectedFeedback,
  ] = useState('');

  const [
    isSavingFeedback,
    setIsSavingFeedback,
  ] = useState(false);

  const [
    feedbackSaved,
    setFeedbackSaved,
  ] = useState(false);

  const [
    feedbackError,
    setFeedbackError,
  ] = useState('');

  const [
    activityCompleted,
    setActivityCompleted,
  ] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, []);

  useEffect(() => {
    if (
      route.params?.activityCompleted
    ) {
      setActivityCompleted(true);
    }
  }, [
    route.params?.activityCompleted,
  ]);

  async function loadChallenge() {
    try {
      setIsLoading(true);

      const [
        profile,
        feedbackEntries,
      ] = await Promise.all([
        getPositiveProfile(),
        getChallengeFeedback(),
      ]);

      const helpfulActivities =
        analyseHelpfulActivities(
          feedbackEntries
        );

      const selectedChallenge =
        getPersonalisedChallenge(
          score,
          profile,
          helpfulActivities
        );

      setChallenge(
        selectedChallenge
      );
    } catch (error) {
      console.error(
        'Unable to load challenge:',
        error
      );

      const selectedChallenge =
        getPersonalisedChallenge(
          score,
          null,
          null
        );

      setChallenge(
        selectedChallenge
      );
    } finally {
      setIsLoading(false);
    }
  }

  function startActivity() {
    navigation.navigate(
      'WellbeingGame',
      {
        challenge,
        score,
      }
    );
  }

  async function handleFeedback(
    feedback
  ) {
    if (
      isSavingFeedback ||
      feedbackSaved ||
      !activityCompleted
    ) {
      return;
    }

    try {
      setSelectedFeedback(
        feedback
      );

      setIsSavingFeedback(true);
      setFeedbackError('');

      await saveChallengeFeedback({
        score,
        stressLevel:
          challenge?.stressLevel,
        challengeType:
          challenge?.type,
        challengeTitle:
          challenge?.title,
        profileSource:
          challenge?.profileSource,
        feedback,
      });

      setFeedbackSaved(true);
    } catch (error) {
      console.error(
        'Unable to save challenge feedback:',
        error
      );

      setFeedbackError(
        'Your feedback could not be saved. Please try again.'
      );

      setSelectedFeedback('');
    } finally {
      setIsSavingFeedback(false);
    }
  }

  if (isLoading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text
          style={styles.loadingText}
        >
          Preparing your
          activity...
        </Text>
      </View>
    );
  }

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
        title="Your Personalised Challenge"
        description="A simple wellbeing activity selected using today's stress result, your Positive Profile and your previous activity feedback."
        icon={Sparkles}
      />

      <WarmCard
        backgroundColor="#EDF5F2"
        borderColor="#D2E5DF"
      >
        <View
          style={styles.scoreRow}
        >
          <View
            style={
              styles.scoreCircle
            }
          >
            <Text
              style={
                styles.scoreNumber
              }
            >
              {score}%
            </Text>
          </View>

          <View
            style={
              styles.scoreText
            }
          >
            <Text
              style={
                styles.scoreLabel
              }
            >
              Today's stress level
            </Text>

            <Text
              style={
                styles.stressLevel
              }
            >
              {
                challenge?.stressLevel
              }
            </Text>
          </View>
        </View>
      </WarmCard>

      <View
        style={
          styles.challengeCard
        }
      >
        <View
          style={
            styles.iconContainer
          }
        >
          <Heart
            size={27}
            color={
              Colors.primaryDark
            }
            strokeWidth={1.9}
          />
        </View>

        <Text
          style={
            styles.challengeType
          }
        >
          {challenge?.type}
        </Text>

        <Text
          style={
            styles.challengeTitle
          }
        >
          {challenge?.title}
        </Text>

        <Text
          style={
            styles.challengeMessage
          }
        >
          {challenge?.message}
        </Text>

        {challenge?.profileSource !==
        'General' ? (
          <View
            style={
              styles.personalisedNote
            }
          >
            <Text
              style={
                styles.personalisedNoteTitle
              }
            >
              Why this was chosen
            </Text>

            <Text
              style={
                styles.personalisedNoteText
              }
            >
              This activity uses
              information from your
              Positive Profile:{' '}
              {
                challenge?.profileSource
              }.
            </Text>

            {challenge?.previousFeedbackMessage ? (
              <View
                style={
                  styles.previousFeedbackRow
                }
              >
                <CheckCircle2
                  size={18}
                  color="#54785C"
                  strokeWidth={1.9}
                />

                <Text
                  style={
                    styles.previousFeedbackText
                  }
                >
                  {
                    challenge
                      .previousFeedbackMessage
                  }
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {challenge?.showSupportInformation ? (
        <View
          style={
            styles.supportCard
          }
        >
          <Text
            style={
              styles.supportTitle
            }
          >
            A little extra support
          </Text>

          <Text
            style={
              styles.supportText
            }
          >
            A very high result is
            based on your
            self-reported answers
            and is not a medical
            diagnosis. If you feel
            overwhelmed or
            concerned about how you
            are feeling, consider
            speaking with someone
            you trust or an
            appropriate healthcare
            professional.
          </Text>
        </View>
      ) : null}

      <View
        style={
          styles.activityCard
        }
      >
        <View
          style={
            styles.activityHeader
          }
        >
          <View
            style={
              styles.activityIcon
            }
          >
            {activityCompleted ? (
              <CheckCircle2
                size={24}
                color="#54785C"
                strokeWidth={2}
              />
            ) : (
              <Play
                size={23}
                color={
                  Colors.primaryDark
                }
                strokeWidth={2}
              />
            )}
          </View>

          <View
            style={
              styles.activityHeaderText
            }
          >
            <Text
              style={
                styles.activityLabel
              }
            >
              INTERACTIVE ACTIVITY
            </Text>

            <Text
              style={
                styles.activityTitle
              }
            >
              {activityCompleted
                ? 'Activity completed'
                : 'Ready to begin?'}
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.activityDescription
          }
        >
          {activityCompleted
            ? 'You have completed this wellbeing activity. You can now share how you feel below.'
            : 'Complete the short personalised activity first. Afterwards, return here and tell us how you feel.'}
        </Text>

        {!activityCompleted ? (
          <AppButton
            title="Start My Activity"
            icon={Play}
            onPress={
              startActivity
            }
            accessibilityLabel="Start personalised wellbeing activity"
          />
        ) : (
          <View
            style={
              styles.completedMessage
            }
          >
            <CheckCircle2
              size={20}
              color="#54785C"
              strokeWidth={2}
            />

            <Text
              style={
                styles.completedMessageText
              }
            >
              Completed — feedback
              is now available.
            </Text>
          </View>
        )}
      </View>

      <View
        style={
          styles.feedbackCard
        }
      >
        <Text
          style={
            styles.feedbackLabel
          }
        >
          AFTER THE ACTIVITY
        </Text>

        <Text
          style={
            styles.feedbackQuestion
          }
        >
          {
            challenge?.feedbackQuestion
          }
        </Text>

        <Text
          style={
            styles.feedbackDescription
          }
        >
          {activityCompleted
            ? 'Choose the answer that best reflects how you feel now.'
            : 'Complete the activity first. Your feedback options will then become available.'}
        </Text>

        <View
          style={
            styles.feedbackOptions
          }
        >
          {challenge?.feedbackOptions?.map(
            (option) => {
              const isSelected =
                selectedFeedback ===
                option;

              const isDisabled =
                isSavingFeedback ||
                feedbackSaved ||
                !activityCompleted;

              return (
                <Pressable
                  key={option}
                  style={({
                    pressed,
                  }) => [
                    styles.feedbackOption,

                    isSelected &&
                      styles.feedbackOptionSelected,

                    isDisabled &&
                      styles.feedbackOptionDisabled,

                    pressed &&
                      !isDisabled &&
                      styles.feedbackOptionPressed,
                  ]}
                  onPress={() =>
                    handleFeedback(
                      option
                    )
                  }
                  disabled={
                    isDisabled
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    option
                  }
                >
                  <Text
                    style={[
                      styles.feedbackOptionText,

                      isSelected &&
                        styles.feedbackOptionTextSelected,

                      isDisabled &&
                        styles.feedbackOptionTextDisabled,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {isSavingFeedback ? (
          <View
            style={
              styles.savingRow
            }
          >
            <ActivityIndicator
              size="small"
              color={
                Colors.primary
              }
            />

            <Text
              style={
                styles.savingText
              }
            >
              Saving your
              feedback...
            </Text>
          </View>
        ) : null}

        {feedbackSaved ? (
          <View
            style={
              styles.savedMessage
            }
          >
            <CheckCircle2
              size={21}
              color="#54785C"
              strokeWidth={2}
            />

            <View
              style={
                styles.savedMessageText
              }
            >
              <Text
                style={
                  styles.savedTitle
                }
              >
                Feedback saved
              </Text>

              <Text
                style={
                  styles.savedDescription
                }
              >
                Your response has
                been saved and can
                help identify which
                activities you find
                most supportive
                over time.
              </Text>
            </View>
          </View>
        ) : null}

        {feedbackError ? (
          <Text
            style={
              styles.errorText
            }
          >
            {feedbackError}
          </Text>
        ) : null}
      </View>

      <AppButton
        title="Return to Results"
        variant="secondary"
        onPress={() =>
          navigation.goBack()
        }
        accessibilityLabel="Return to stress results"
      />
    </ScrollView>
  );
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

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
      padding: Spacing.lg,
    },

    loadingText: {
      fontSize: 15,
      color:
        Colors.textSecondary,
      marginTop: Spacing.md,
    },

    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    scoreCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#DDECE7',
      marginRight: Spacing.md,
    },

    scoreNumber: {
      fontSize: 22,
      fontWeight: '700',
      color:
        Colors.primaryDark,
    },

    scoreText: {
      flex: 1,
    },

    scoreLabel: {
      fontSize: 13,
      color:
        Colors.textSecondary,
      marginBottom: 4,
    },

    stressLevel: {
      fontSize: 21,
      fontWeight: '600',
      color: Colors.text,
    },

    challengeCard: {
      backgroundColor:
        '#FFFDFC',
      borderWidth: 1,
      borderColor: '#E5DED5',
      borderRadius: 22,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },

    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#F0E3DE',
      marginBottom: Spacing.md,
    },

    challengeType: {
      fontSize: 13,
      fontWeight: '600',
      color:
        Colors.primaryDark,
      marginBottom: 6,
    },

    challengeTitle: {
      fontSize: 21,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: Spacing.sm,
    },

    challengeMessage: {
      fontSize: 15,
      color:
        Colors.textSecondary,
      lineHeight: 23,
    },

    personalisedNote: {
      marginTop: Spacing.lg,
      padding: Spacing.md,
      borderRadius: 15,
      backgroundColor:
        '#F4FAF5',
      borderWidth: 1,
      borderColor: '#C9DFC9',
    },

    personalisedNoteTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#54785C',
      marginBottom: 5,
    },

    personalisedNoteText: {
      fontSize: 13,
      color:
        Colors.textSecondary,
      lineHeight: 19,
    },

    previousFeedbackRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: Spacing.sm,
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor:
        '#D7E8DA',
    },

    previousFeedbackText: {
      flex: 1,
      fontSize: 12,
      color: '#54785C',
      lineHeight: 18,
      marginLeft: Spacing.sm,
    },

    supportCard: {
      backgroundColor:
        '#FBF5E8',
      borderWidth: 1,
      borderColor: '#E9D8B4',
      borderRadius: 17,
      padding: Spacing.md,
      marginBottom: Spacing.lg,
    },

    supportTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#7A633B',
      marginBottom: 6,
    },

    supportText: {
      fontSize: 13,
      color:
        Colors.textSecondary,
      lineHeight: 20,
    },

    activityCard: {
      backgroundColor:
        '#F4FAF7',
      borderWidth: 1,
      borderColor: '#C9DFC9',
      borderRadius: 22,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },

    activityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },

    activityIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#E2EFE8',
      marginRight: Spacing.md,
    },

    activityHeaderText: {
      flex: 1,
    },

    activityLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      color:
        Colors.primaryDark,
      marginBottom: 4,
    },

    activityTitle: {
      fontSize: 19,
      fontWeight: '700',
      color: Colors.text,
    },

    activityDescription: {
      fontSize: 14,
      color:
        Colors.textSecondary,
      lineHeight: 21,
      marginBottom: Spacing.md,
    },

    completedMessage: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#E8F3EB',
      borderRadius: 14,
      padding: Spacing.md,
    },

    completedMessageText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: '#54785C',
      marginLeft: Spacing.sm,
    },

    feedbackCard: {
      backgroundColor:
        '#FFFDFC',
      borderWidth: 1,
      borderColor: '#D8E4DF',
      borderRadius: 22,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },

    feedbackLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      color:
        Colors.primaryDark,
      marginBottom: 7,
    },

    feedbackQuestion: {
      fontSize: 19,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: 6,
    },

    feedbackDescription: {
      fontSize: 13,
      color:
        Colors.textSecondary,
      lineHeight: 19,
      marginBottom: Spacing.md,
    },

    feedbackOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -4,
    },

    feedbackOption: {
      minWidth: 145,
      flexGrow: 1,
      borderWidth: 1,
      borderColor: '#C9DAD4',
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      margin: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#F8FBFA',
    },

    feedbackOptionSelected: {
      borderColor:
        Colors.primary,
      backgroundColor:
        '#E3F0EC',
    },

    feedbackOptionDisabled: {
      opacity: 0.45,
      backgroundColor:
        '#F2F3F2',
    },

    feedbackOptionPressed: {
      opacity: 0.72,
    },

    feedbackOptionText: {
      fontSize: 13,
      fontWeight: '500',
      color: Colors.text,
      textAlign: 'center',
    },

    feedbackOptionTextSelected: {
      color:
        Colors.primaryDark,
      fontWeight: '700',
    },

    feedbackOptionTextDisabled: {
      color: '#888F8C',
    },

    savingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.md,
    },

    savingText: {
      fontSize: 13,
      color:
        Colors.textSecondary,
      marginLeft: Spacing.sm,
    },

    savedMessage: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor:
        '#EDF6EF',
      borderWidth: 1,
      borderColor: '#C6DDCB',
      borderRadius: 15,
      padding: Spacing.md,
      marginTop: Spacing.md,
    },

    savedMessageText: {
      flex: 1,
      marginLeft: Spacing.sm,
    },

    savedTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#54785C',
      marginBottom: 3,
    },

    savedDescription: {
      fontSize: 12,
      color:
        Colors.textSecondary,
      lineHeight: 18,
    },

    errorText: {
      fontSize: 13,
      color: '#A9574A',
      lineHeight: 19,
      marginTop: Spacing.md,
    },
  });