import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Book, Calculator } from 'lucide-react-native';

const LEARNING_SECTIONS = [
  {
    id: 'alphabet',
    title: 'Alphabet Practice',
    description: 'Learn and practice the Bulgarian alphabet',
    icon: Book,
    color: '#2563eb',
  },
  {
    id: 'numbers',
    title: 'Number Practice',
    description: 'Learn and practice Bulgarian numbers',
    icon: Calculator,
    color: '#059669',
  }
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>Iva has a nice pussy </Text>
          <Text style={styles.subtitle}>Start your language journey today</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Learning Sections</Text>
        
        {LEARNING_SECTIONS.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={styles.sectionCard}
            onPress={() => router.push(`/${section.id}`)}
          >
            <View style={[styles.iconContainer, { backgroundColor: section.color }]}>
              <section.icon color="white" size={24} />
            </View>
            <View style={styles.sectionInfo}>
              <Text style={styles.sectionName}>{section.title}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#64748b',
  },
});