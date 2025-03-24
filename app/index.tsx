import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Book, Calculator } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { 
  withSpring, 
  useAnimatedStyle, 
  useSharedValue,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';

const LEARNING_SECTIONS = [
  {
    id: 'alphabet',
    title: 'Alphabet Practice',
    description: 'Master the Bulgarian alphabet through interactive lessons and exercises',
    icon: Book,
    color: '#D01C1F',
    gradient: ['#FF4B4B', '#D01C1F']
  },
  {
    id: 'numbers',
    title: 'Number Practice',
    description: 'Learn Bulgarian numbers with engaging practice sessions and real-world examples',
    icon: Calculator,
    color: '#009B74',
    gradient: ['#00C795', '#009B74']
  }
];

const AnimatedTouchable = Reanimated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useSharedValue(0);
  const heroScale = useSharedValue(1.05);

  useEffect(() => {
    fadeAnim.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { 
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1)
      })
    );
    
    heroScale.value = withSequence(
      withTiming(1.05, { duration: 0 }),
      withTiming(1, {
        duration: 1200,
        easing: Easing.bezier(0.4, 0, 0.2, 1)
      })
    );
  }, []);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: heroScale.value }]
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ 
      translateY: withSpring(fadeAnim.value * 0, {
        damping: 20,
        stiffness: 90
      })
    }]
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Reanimated.View style={[styles.heroContainer, heroAnimatedStyle]}>
        <View style={styles.flagContainer}>
          <View style={styles.flagStripe1} />
          <View style={styles.flagStripe2} />
          <View style={styles.flagStripe3} />
        </View>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.title}>Learn Bulgarian</Text>
          <Text style={styles.subtitle}>Start your language journey today</Text>
        </LinearGradient>
      </Reanimated.View>

      <Reanimated.View style={[styles.content, contentAnimatedStyle]}>
        <Text style={styles.sectionTitle}>Learning Sections</Text>
        
        {LEARNING_SECTIONS.map((section) => (
          <AnimatedTouchable
            key={section.id}
            style={[styles.sectionCard]}
            onPress={() => router.push(`/${section.id}`)}
          >
            <LinearGradient
              colors={section.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <section.icon color="white" size={24} />
            </LinearGradient>
            <View style={styles.sectionInfo}>
              <Text style={styles.sectionName}>{section.title}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
          </AnimatedTouchable>
        ))}
      </Reanimated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroContainer: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  flagContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  flagStripe1: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flagStripe2: {
    flex: 1,
    backgroundColor: '#009B74',
  },
  flagStripe3: {
    flex: 1,
    backgroundColor: '#D01C1F',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    paddingTop: 64,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 40,
    color: '#FFFFFF',
    marginBottom: 8,
    textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 28,
    color: '#1E293B',
    marginBottom: 24,
  },
  sectionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
});