import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

const variants = {
  primary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    textColor: Colors.white,
  },

  secondary: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    textColor: Colors.primaryDark,
  },

  sage: {
    backgroundColor: '#EAF2E9',
    borderColor: '#C8DCC8',
    textColor: '#54785C',
  },

  sand: {
    backgroundColor: '#FBF5E8',
    borderColor: '#E9D8B4',
    textColor: '#7A633B',
  },

  danger: {
    backgroundColor: '#FBECE9',
    borderColor: '#E6B5AA',
    textColor: '#A95847',
  },
};

export default function AppButton({
  title,
  onPress,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  style,
}) {
  const selectedVariant =
    variants[variant] || variants.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            selectedVariant.backgroundColor,
          borderColor: selectedVariant.borderColor,
        },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
    >
      <View style={styles.content}>
        {Icon ? (
          <Icon
            size={21}
            color={selectedVariant.textColor}
            strokeWidth={2}
          />
        ) : null}

        <Text
          style={[
            styles.text,
            {
              color: selectedVariant.textColor,
            },
            Icon && styles.textWithIcon,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderWidth: 1.5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: Typography.button,
    fontWeight: '600',
    textAlign: 'center',
  },

  textWithIcon: {
    marginLeft: Spacing.sm,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.5,
  },
});