import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Frown,
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
    Icon: Smile,
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
    Icon: Frown,
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
  const selectedOption = moodOptions.find(
    (mood) => mood.value === selectedMood
  );

  const SelectedMoodIcon = selectedOption?.Icon;

  return (
    <View>
      <View style={styles.grid}>
        {moodOptions.map((mood) => {
          const isSelected =
            selectedMood === mood.value;

          const MoodIcon = mood.Icon;

          return (
            <Pressable
              key={mood.value}
              style={({ pressed }) => [
                styles.moodCard,
                {
                  backgroundColor: mood.background,
                  borderColor: isSelected
                    ? mood.colour
                    : Colors.border,
                },
                isSelected && styles.selectedCard,
                pressed && styles.pressedCard,
              ]}
              onPress={() => onSelect(mood.value)}
              accessibilityRole="button"
              accessibilityLabel={`${mood.label} mood`}
              accessibilityState={{
                selected: isSelected,
              }}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: `${mood.colour}18`,
                  },
                ]}
              >
                <MoodIcon
                  size={38}
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

              <View
                style={[
                  styles.selectionIndicator,
                  {
                    borderColor: mood.colour,
                    backgroundColor: isSelected
                      ? mood.colour
                      : 'transparent',
                  },
                ]}
              >
                {isSelected ? (
                  <Text style={styles.checkMark}>
                    ✓
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {selectedOption && SelectedMoodIcon ? (
        <View
          style={[
            styles.messageCard,
            {
              backgroundColor:
                selectedOption.background,
              borderColor:
                `${selectedOption.colour}55`,
            },
          ]}
        >
          <SelectedMoodIcon
            size={25}
            color={selectedOption.colour}
            strokeWidth={1.9}
          />

          <View style={styles.messageTextContainer}>
            <Text
              style={[
                styles.messageTitle,
                {
                  color: selectedOption.colour,
                },
              ]}
            >
              Feeling{' '}
              {selectedOption.label.toLowerCase()}
            </Text>

            <Text style={styles.messageText}>
              {selectedOption.message}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.helpText}>
          Select the option that feels closest to
          how you feel today.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  moodCard: {
    width: '50%',
    minHeight: 156,
    borderWidth: 1.5,
    borderRadius: 22,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderColor: Colors.border,
  },

  selectedCard: {
    borderWidth: 2.5,
    transform: [{ scale: 1.02 }],
    ...Shadows.card,
  },

  pressedCard: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },

  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkMark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },

  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.md,
    marginTop: Spacing.sm,
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

  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});