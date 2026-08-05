import { StyleSheet, Text, View } from 'react-native';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

export default function SectionHeader({
  title,
  description,
  icon: Icon,
  iconColour = Colors.primaryDark,
  iconBackground = '#E9F2EC',
}) {
  return (
    <View style={styles.container}>
      {Icon ? (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: iconBackground,
            },
          ]}
        >
          <Icon
            size={25}
            color={iconColour}
            strokeWidth={1.9}
          />
        </View>
      ) : null}

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        {description ? (
          <Text style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: Typography.heading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
  },

  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});