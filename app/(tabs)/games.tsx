import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const GAMES = [
  {
    id: 'matching',
    title: 'Letter Matching',
    description: 'Match Bulgarian letters with their Latin sounds',
    image: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=800',
    difficulty: 'Easy',
  },
  {
    id: 'wordBuilder',
    title: 'Word Builder',
    description: 'Build Bulgarian words from individual letters',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800',
    difficulty: 'Medium',
  },
  {
    id: 'flashCards',
    title: 'Flash Cards',
    description: 'Practice with digital flash cards',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800',
    difficulty: 'Easy',
  },
  {
    id: 'translation',
    title: 'Translation Challenge',
    description: 'Translate common phrases between Bulgarian and English',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    difficulty: 'Hard',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    // In a full implementation, this would navigate to the specific game screen
    // router.push(`/games/${game.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Games</Text>
        <Text style={styles.subtitle}>Choose a game to practice Bulgarian</Text>
      </View>

      <View style={styles.gamesGrid}>
        {GAMES.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => handleGameSelect(game)}>
            <Image source={{ uri: game.image }} style={styles.gameImage} />
            <View style={styles.gameInfo}>
              <View style={styles.gameHeader}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: game.difficulty === 'Easy' ? '#d1fae5' : 
                                   game.difficulty === 'Medium' ? '#fef3c7' : 
                                   '#fee2e2' }
                ]}>
                  <Text style={[
                    styles.difficultyText,
                    { color: game.difficulty === 'Easy' ? '#059669' :
                             game.difficulty === 'Medium' ? '#d97706' :
                             '#dc2626' }
                  ]}>{game.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.gameDescription}>{game.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedGame && (
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>
            {selectedGame.title} is coming soon!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
  },
  gamesGrid: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameImage: {
    width: '100%',
    height: 200,
  },
  gameInfo: {
    padding: 16,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  gameDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    lineHeight: 20,
  },
  comingSoon: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});