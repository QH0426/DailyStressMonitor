import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  Annoyed,
  Check,
  Frown,
  Laugh,
  Meh,
  Smile,
} from 'lucide-react-native';

import Colors from '../theme/colors';
import Shadows from '../theme/shadows';
import Spacing from '../theme/spacing';

const moodOptions = [
  {
    value: 'very-good',
    label: 'Very good',
    Icon: Laugh,
    colour: '#5F8F68',
    background: '#EAF4EC',
    message:
      'It is lovely to hear that you are feeling positive today.',
  },

  {
    value: 'good',
    label: 'Good',
    Icon: Smile,
    colour: Colors.primaryDark,
    background: '#EAF5F2',
    message:
      'You seem to be having a positive day. Take a moment to appreciate it.',
  },

  {
    value: 'neutral',
    label: 'Neutral',
    Icon: Meh,
    colour: '#9A7740',
    background: '#FBF4E6',
    message:
      'Some days feel steady and balanced. That is completely okay.',
  },

  {
    value: 'low',
    label: 'Low',
    Icon: Frown,
    colour: '#B56D57',
    background: '#FBEDE8',
    message:
      'Thank you for checking in. Let us gently explore how today has felt.',
  },

  {
    value: 'very-low',
    label: 'Very low',
    Icon: Annoyed,
    colour: '#A9574A',
    background: '#F9E7E3',
    message:
      'Thank you for taking time to reflect. You do not have to manage difficult feelings alone.',
  },
];

export default function MoodSelector({
  selectedMood,
  onSelect,
}) {
  const { width } = useWindowDimensions();

  const isWide = width >= 900;

  const selectedOption = moodOptions.find(
    (mood) => mood.value === selectedMood
  );

  const SelectedMoodIcon =
    selectedOption?.Icon;

  return (
    <View>
      <Text style={styles.questionText}>
        How are you feeling today?
      </Text>

      <Text style={styles.questionHelp}>
        Choose the option that feels closest to your mood right now.
      </Text>

      <View
        style={[
          styles.grid,
          isWide && styles.gridWide,
        ]}
      >
        {moodOptions.map((mood) => {
          const isSelected =
            selectedMood === mood.value;

          const MoodIcon = mood.Icon;

          return (
            <Pressable
              key={mood.value}
              style={({ pressed }) => [
                styles.moodCard,

                isWide
                  ? styles.moodCardWide
                  : styles.moodCardMobile,

                {
                  backgroundColor: isSelected
                    ? mood.background
                    : Colors.surface,

                  borderColor: isSelected
                    ? mood.colour
                    : Colors.border,
                },

                isSelected &&
                  styles.selectedCard,

                pressed &&
                  styles.pressedCard,
              ]}
              onPress={() =>
                onSelect(mood.value)
              }
              accessibilityRole="button"
              accessibilityLabel={`${mood.label} mood`}
              accessibilityState={{
                selected: isSelected,
              }}
            >
              {isSelected ? (
                <View
                  style={[
                    styles.checkBadge,
                    {
                      backgroundColor:
                        mood.colour,
                    },
                  ]}
                >
                  <Check
                    size={13}
                    color={Colors.white}
                    strokeWidth={3}
                  />
                </View>
              ) : null}

              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor:
                      `${mood.colour}14`,
                  },
                ]}
              >
                <MoodIcon
                  size={34}
                  color={mood.colour}
                  strokeWidth={1.8}
                />
              </View>

              <Text
                style={[
                  styles.moodLabel,
                  {
                    color: mood.colour,
                  },
                ]}
              >
                {mood.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedOption &&
      SelectedMoodIcon ? (
        <View
          style={[
            styles.messageCard,
            {
              backgroundColor:
                selectedOption.background,

              borderColor:
                `${selectedOption.colour}45`,
            },
          ]}
        >
          <View
            style={[
              styles.messageIconCircle,
              {
                backgroundColor:
                  `${selectedOption.colour}12`,
              },
            ]}
          >
            <SelectedMoodIcon
              size={24}
              color={
                selectedOption.colour
              }
              strokeWidth={1.9}
            />
          </View>

          <View
            style={
              styles.messageTextContainer
            }
          >
            <Text
              style={[
                styles.messageTitle,
                {
                  color:
                    selectedOption.colour,
                },
              ]}
            >
              Feeling{' '}
              {selectedOption.label.toLowerCase()}
            </Text>

            <Text
              style={styles.messageText}
            >
              {selectedOption.message}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  questionHelp: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },

  gridWide: {
    flexWrap: 'nowrap',
  },

  moodCard: {
    minHeight: 125,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    position: 'relative',
  },

  moodCardWide: {
    flex: 1,
  },

  moodCardMobile: {
    width: '47%',
  },

  selectedCard: {
    borderWidth: 2,
    ...Shadows.card,
  },

  pressedCard: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  moodLabel: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },

  messageIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  messageTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },

  messageText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
});