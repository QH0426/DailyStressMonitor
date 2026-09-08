import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Database,
  HeartHandshake,
  Info,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';
import SectionHeader from '../components/SectionHeader';
import WarmCard from '../components/WarmCard';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';
import Typography from '../theme/typography';

export default function InformationScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Privacy & Information"
        description="Your reflections belong to you. This page explains how the application works and how your information is currently stored."
        icon={ShieldCheck}
      />

      <WarmCard
        backgroundColor="#EDF5F2"
        borderColor="#D2E5DF"
      >
        <View style={styles.cardHeader}>
          <View style={styles.tealIcon}>
            <Leaf
              size={25}
              color={Colors.primaryDark}
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.cardHeadingContainer}>
            <Text style={styles.cardTitle}>
              About Daily Stress Monitor
            </Text>

            <Text style={styles.cardSubtitle}>
              A calm space for personal reflection
            </Text>
          </View>
        </View>

        <Text style={styles.cardText}>
          Daily Stress Monitor helps adults reflect on changes in
          their estimated daily stress level, mood and wellbeing
          through short self-reported check-ins.
        </Text>

        <Text style={styles.secondaryText}>
          The application records answers relating to anxiety,
          panic-related symptoms, sleep, workload and energy.
        </Text>
      </WarmCard>

      <WarmCard
        backgroundColor="#FFF7F3"
        borderColor="#E8C5BA"
      >
        <View style={styles.cardHeader}>
          <View style={styles.coralIcon}>
            <Stethoscope
              size={25}
              color="#A05E4B"
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.cardHeadingContainer}>
            <Text style={styles.coralTitle}>
              Important wellbeing disclaimer
            </Text>

            <Text style={styles.cardSubtitle}>
              This is not a medical assessment
            </Text>
          </View>
        </View>

        <Text style={styles.cardText}>
          The application does not diagnose, prevent or treat a
          medical or mental health condition.
        </Text>

        <Text style={styles.secondaryText}>
          The percentage is an estimate produced by a short prototype
          questionnaire. It should not be interpreted as a clinical
          diagnosis, treatment recommendation or professional medical
          advice.
        </Text>
      </WarmCard>

      <WarmCard>
        <View style={styles.cardHeader}>
          <View style={styles.sandIcon}>
            <Info
              size={25}
              color="#8B6D35"
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.cardHeadingContainer}>
            <Text style={styles.cardTitle}>
              How the estimate works
            </Text>

            <Text style={styles.cardSubtitle}>
              A transparent prototype calculation
            </Text>
          </View>
        </View>

        <Text style={styles.cardText}>
          Anxiety, panic-related symptoms and workload increase the
          estimated stress level.
        </Text>

        <Text style={styles.secondaryText}>
          Positive responses relating to sleep and energy reduce the
          estimate. Mood and daily notes provide additional context
          but do not change the calculated percentage.
        </Text>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            The scoring weights and category thresholds are part of
            the prototype and have not been clinically validated.
          </Text>
        </View>
      </WarmCard>

      <WarmCard
        backgroundColor="#F4FAF5"
        borderColor="#C9DFC9"
      >
        <View style={styles.cardHeader}>
          <View style={styles.greenIcon}>
            <LockKeyhole
              size={25}
              color="#54785C"
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.cardHeadingContainer}>
            <Text style={styles.greenTitle}>
              Your privacy
            </Text>

            <Text style={styles.cardSubtitle}>
              Reflections are connected to your account
            </Text>
          </View>
        </View>

        <Text style={styles.cardText}>
          Access to saved reflections requires a signed-in user
          account using Firebase Authentication.
        </Text>

        <Text style={styles.secondaryText}>
          Reflections are stored in Cloud Firestore and are associated
          with the authenticated user's account. This allows saved
          reflections to be retrieved when the user signs in.
        </Text>
      </WarmCard>

      <WarmCard>
        <View style={styles.cardHeader}>
          <View style={styles.tealIcon}>
            <Database
              size={25}
              color={Colors.primaryDark}
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.cardHeadingContainer}>
            <Text style={styles.cardTitle}>
              Data retention and control
            </Text>

            <Text style={styles.cardSubtitle}>
              You can manage your saved reflections
            </Text>
          </View>
        </View>

        <Text style={styles.cardText}>
          Saved reflections remain in Cloud Firestore until they are
          removed by the user through the application.
        </Text>

        <Text style={styles.secondaryText}>
          The Your Journey screen allows you to remove one reflection
          or clear all saved reflections after confirmation.
        </Text>
      </WarmCard>

      <WarmCard
        backgroundColor="#FFF9EE"
        borderColor="#ECDDBE"
      >
        <View style={styles.cardHeader}>
          <View style={styles.sandIcon}>
            <HeartHandshake
              size={25}
              color="#8B6D35"
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.cardHeadingContainer}>
            <Text style={styles.sandTitle}>
              When to seek support
            </Text>

            <Text style={styles.cardSubtitle}>
              You do not have to manage distress alone
            </Text>
          </View>
        </View>

        <Text style={styles.cardText}>
          If you are worried about your wellbeing, experiencing
          persistent distress or finding daily activities difficult,
          consider contacting a qualified healthcare professional or
          an appropriate support service.
        </Text>

        <Text style={styles.secondaryText}>
          If you believe that you or another person is in immediate
          danger, contact the appropriate emergency service in your
          location.
        </Text>
      </WarmCard>

      <WarmCard>
        <View style={styles.cardHeader}>
          <View style={styles.tealIcon}>
            <UserRoundCheck
              size={25}
              color={Colors.primaryDark}
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.cardHeadingContainer}>
            <Text style={styles.cardTitle}>
              Intended users
            </Text>

            <Text style={styles.cardSubtitle}>
              Designed for adults aged 18 and over
            </Text>
          </View>
        </View>

        <Text style={styles.cardText}>
          This prototype is intended for general personal
          self-monitoring. It is not intended for clinical
          decision-making or emergency support.
        </Text>
      </WarmCard>

      <View style={styles.versionCard}>
        <View style={styles.versionIcon}>
          <ShieldCheck
            size={27}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />
        </View>

        <Text style={styles.versionTitle}>
          Daily Stress Monitor
        </Text>

        <Text style={styles.versionText}>
          Prototype version 1.0.0
        </Text>

        <Text style={styles.versionText}>
          Developed using React Native and Expo
        </Text>

        <Text style={styles.versionText}>
          Dissertation Project · 2026
        </Text>
      </View>

      <AppButton
        title="Return to Dashboard"
        variant="secondary"
        onPress={() => navigation.navigate('Home')}
        accessibilityLabel="Return to the home dashboard"
      />
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

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  cardHeadingContainer: {
    flex: 1,
  },

  tealIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDECE7',
    marginRight: Spacing.md,
  },

  coralIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7E4DE',
    marginRight: Spacing.md,
  },

  sandIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E9CE',
    marginRight: Spacing.md,
  },

  greenIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4F0E6',
    marginRight: Spacing.md,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  coralTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#A05E4B',
    marginBottom: 4,
  },

  greenTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#54785C',
    marginBottom: 4,
  },

  sandTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#8B6D35',
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  cardText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 23,
  },

  secondaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginTop: Spacing.md,
  },

  noticeBox: {
    backgroundColor: '#FBF5E8',
    borderWidth: 1,
    borderColor: '#EAD9B4',
    borderRadius: 15,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },

  noticeText: {
    fontSize: 13,
    color: '#7A633B',
    lineHeight: 20,
  },

  versionCard: {
    alignItems: 'center',
    backgroundColor: '#EDF5F2',
    borderWidth: 1,
    borderColor: '#D2E5DF',
    borderRadius: 22,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  versionIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDECE7',
    marginBottom: Spacing.md,
  },

  versionTitle: {
    fontSize: Typography.subheading,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },

  versionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
});