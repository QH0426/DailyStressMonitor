import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Heart,
  Music,
  Palmtree,
  Sparkles,
  Star,
  Users,
} from 'lucide-react-native';

import AppButton from '../components/AppButton';
import SectionHeader from '../components/SectionHeader';
import WarmCard from '../components/WarmCard';

import {
  getPositiveProfile,
  savePositiveProfile,
} from '../services/firestoreService';

import Colors from '../theme/colors';
import Spacing from '../theme/spacing';

export default function PositiveProfileScreen({
  navigation,
}) {
  const [importantPerson, setImportantPerson] =
    useState('');

  const [happyMemory, setHappyMemory] =
    useState('');

  const [calmingPlace, setCalmingPlace] =
    useState('');

  const [favouriteActivity, setFavouriteActivity] =
    useState('');

  const [favouriteMusic, setFavouriteMusic] =
    useState('');

  const [achievement, setAchievement] =
    useState('');

  const [lookingForwardTo, setLookingForwardTo] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setIsLoading(true);

      const savedProfile =
        await getPositiveProfile();

      if (savedProfile) {
        setImportantPerson(
          savedProfile.importantPerson || ''
        );

        setHappyMemory(
          savedProfile.happyMemory || ''
        );

        setCalmingPlace(
          savedProfile.calmingPlace || ''
        );

        setFavouriteActivity(
          savedProfile.favouriteActivity || ''
        );

        setFavouriteMusic(
          savedProfile.favouriteMusic || ''
        );

        setAchievement(
          savedProfile.achievement || ''
        );

        setLookingForwardTo(
          savedProfile.lookingForwardTo || ''
        );
      }
    } catch (error) {
      console.error(
        'Unable to load positive profile:',
        error
      );

      Alert.alert(
        'Unable to load profile',
        'Your positive profile could not be loaded. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    try {
      setIsSaving(true);

      await savePositiveProfile({
        importantPerson,
        happyMemory,
        calmingPlace,
        favouriteActivity,
        favouriteMusic,
        achievement,
        lookingForwardTo,
      });

      Alert.alert(
        'Profile saved',
        'Your positive profile has been saved.'
      );
    } catch (error) {
      console.error(
        'Unable to save positive profile:',
        error
      );

      Alert.alert(
        'Unable to save profile',
        'Your profile could not be saved. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading your positive profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <SectionHeader
        title="My Positive Profile"
        description="Tell the app about some of the people, places and activities that help you feel positive, supported or calm."
        icon={Heart}
      />

      <WarmCard
        backgroundColor="#EDF5F2"
        borderColor="#D2E5DF"
      >
        <View style={styles.introRow}>
          <View style={styles.introIcon}>
            <Sparkles
              size={25}
              color={Colors.primaryDark}
              strokeWidth={1.9}
            />
          </View>

          <View style={styles.introTextContainer}>
            <Text style={styles.cardTitle}>
              Make your experience personal
            </Text>

            <Text style={styles.cardText}>
              Your answers will later help the app
              choose wellbeing activities that are
              more meaningful to you.
            </Text>
          </View>
        </View>
      </WarmCard>

      <View style={styles.formCard}>
        <ProfileQuestion
          icon={Users}
          title="Someone important to you"
          description="Who makes you feel happy, supported or comfortable?"
          placeholder="For example: my family, my friend..."
          value={importantPerson}
          onChangeText={setImportantPerson}
        />

        <ProfileQuestion
          icon={Heart}
          title="A happy memory"
          description="Think of a memory that usually makes you smile."
          placeholder="For example: a family holiday..."
          value={happyMemory}
          onChangeText={setHappyMemory}
          multiline
        />

        <ProfileQuestion
          icon={Palmtree}
          title="A place that helps you feel calm"
          description="Where do you normally feel relaxed or comfortable?"
          placeholder="For example: the beach, a park..."
          value={calmingPlace}
          onChangeText={setCalmingPlace}
        />

        <ProfileQuestion
          icon={Sparkles}
          title="An activity you enjoy"
          description="What do you enjoy doing in your free time?"
          placeholder="For example: walking, cooking..."
          value={favouriteActivity}
          onChangeText={setFavouriteActivity}
        />

        <ProfileQuestion
          icon={Music}
          title="Music you enjoy"
          description="What music, artist or type of music helps you feel good?"
          placeholder="For example: relaxing music..."
          value={favouriteMusic}
          onChangeText={setFavouriteMusic}
        />

        <ProfileQuestion
          icon={Star}
          title="Something you are proud of"
          description="This can be a personal achievement, big or small."
          placeholder="For example: finishing a course..."
          value={achievement}
          onChangeText={setAchievement}
          multiline
        />

        <ProfileQuestion
          icon={Sparkles}
          title="Something you are looking forward to"
          description="What is something positive you are looking forward to?"
          placeholder="For example: seeing family..."
          value={lookingForwardTo}
          onChangeText={setLookingForwardTo}
          multiline
          isLast
        />
      </View>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyTitle}>
          Your personal profile
        </Text>

        <Text style={styles.privacyText}>
          This information is linked to your signed-in
          account and is used to personalise activities
          within the application.
        </Text>
      </View>

      <AppButton
        title={
          isSaving
            ? 'Saving...'
            : 'Save Positive Profile'
        }
        onPress={handleSave}
        disabled={isSaving}
        accessibilityLabel="Save positive profile"
      />

      <View style={styles.returnButton}>
        <AppButton
          title="Return to Dashboard"
          variant="secondary"
          onPress={() =>
            navigation.navigate('Home')
          }
          accessibilityLabel="Return to home dashboard"
        />
      </View>
    </ScrollView>
  );
}

function ProfileQuestion({
  icon: Icon,
  title,
  description,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  isLast = false,
}) {
  return (
    <View
      style={[
        styles.questionContainer,
        isLast && styles.lastQuestion,
      ]}
    >
      <View style={styles.questionHeader}>
        <View style={styles.questionIcon}>
          <Icon
            size={21}
            color={Colors.primaryDark}
            strokeWidth={1.9}
          />
        </View>

        <View style={styles.questionHeading}>
          <Text style={styles.questionTitle}>
            {title}
          </Text>

          <Text style={styles.questionDescription}>
            {description}
          </Text>
        </View>
      </View>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#99938A"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={
          multiline ? 'top' : 'center'
        }
        maxLength={250}
      />
    </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },

  loadingText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },

  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  introIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDECE7',
    marginRight: Spacing.md,
  },

  introTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },

  formCard: {
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#E5DED5',
    borderRadius: 22,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  questionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E9E3DC',
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  lastQuestion: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },

  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },

  questionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF5F2',
    marginRight: Spacing.md,
  },

  questionHeading: {
    flex: 1,
  },

  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  questionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D8D2CA',
    borderRadius: 14,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: Colors.text,
  },

  multilineInput: {
    minHeight: 82,
  },

  privacyNote: {
    backgroundColor: '#F4FAF5',
    borderWidth: 1,
    borderColor: '#C9DFC9',
    borderRadius: 17,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#54785C',
    marginBottom: 5,
  },

  privacyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  returnButton: {
    marginTop: Spacing.md,
  },
});