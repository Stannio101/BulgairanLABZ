import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Volume2, Check, X, ArrowRight, Shuffle, Chrome as Home, Circle as XCircle } from 'lucide-react-native';

// Updated compound sounds handling
const COMPOUND_SOUNDS = {
  'я': 'ya',
  'ю': 'yu',
  'щ': 'sht',
  'ь': '',  // Silent letter
  'й': 'y',
  'дж': 'dzh',
  'дз': 'dz',
  'ж': 'zh',
  'ш': 'sh',
  'ч': 'ch',
  'ц': 'ts'
};

const WORDS = [
  { bulgarian: 'ягода', sounds: ['ya', 'g', 'o', 'd', 'a'], translation: 'strawberry', difficulty: 'easy' },
  { bulgarian: 'юни', sounds: ['yu', 'n', 'i'], translation: 'June', difficulty: 'easy' },
  { bulgarian: 'щастие', sounds: ['sht', 'a', 's', 't', 'i', 'e'], translation: 'happiness', difficulty: 'medium' },
  { bulgarian: 'майка', sounds: ['m', 'a', 'y', 'k', 'a'], translation: 'mother', difficulty: 'easy' },
  { bulgarian: 'приятел', sounds: ['p', 'r', 'i', 'ya', 't', 'e', 'l'], translation: 'friend', difficulty: 'medium' },
  { bulgarian: 'жена', sounds: ['zh', 'e', 'n', 'a'], translation: 'woman', difficulty: 'easy' },
  { bulgarian: 'шал', sounds: ['sh', 'a', 'l'], translation: 'scarf', difficulty: 'easy' },
  { bulgarian: 'чанта', sounds: ['ch', 'a', 'n', 't', 'a'], translation: 'bag', difficulty: 'easy' },
  { bulgarian: 'цвете', sounds: ['ts', 'v', 'e', 't', 'e'], translation: 'flower', difficulty: 'medium' }
];

export default function LetterMatchingScreen() {
  const router = useRouter();
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedSounds, setSelectedSounds] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ visible: false, correct: false });
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    shuffleWords();
  }, []);

  const shuffleWords = () => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    setWords(shuffled);
  };

  const currentWord = words[currentWordIndex] || WORDS[0];

  const handleSoundSelect = (sound) => {
    if (selectedSounds.length < currentWord.sounds.length) {
      setSelectedSounds([...selectedSounds, sound]);
    }
  };

  const handleSoundRemove = (indexToRemove) => {
    setSelectedSounds(selectedSounds.filter((_, index) => index !== indexToRemove));
  };

  const checkAnswer = () => {
    const isCorrect = selectedSounds.join('') === currentWord.sounds.join('');
    if (isCorrect) {
      setScore(score + 1);
    }
    setFeedback({ visible: true, correct: isCorrect });
    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSelectedSounds([]);
      setFeedback({ visible: false, correct: false });
      setShowNextButton(false);
    } else {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    shuffleWords();
    setCurrentWordIndex(0);
    setSelectedSounds([]);
    setIsComplete(false);
    setScore(0);
    setFeedback({ visible: false, correct: false });
    setShowNextButton(false);
  };

  // Get available sounds for the current word
  const availableSounds = [...new Set(currentWord.sounds)].sort(() => Math.random() - 0.5);

  const correctAnswer = currentWord.sounds.join('');

  const renderGameContent = () => (
    <View style={styles.gameContainer}>
      <View style={styles.wordCard}>
        <View style={styles.difficultyBadge}>
          <Text style={[
            styles.difficultyText,
            { color: currentWord.difficulty === 'easy' ? '#059669' :
                     currentWord.difficulty === 'medium' ? '#d97706' :
                     '#dc2626' }
          ]}>
            {currentWord.difficulty.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.bulgarianWord}>{currentWord.bulgarian}</Text>
        <Text style={styles.translation}>"{currentWord.translation}"</Text>
      </View>

      <View style={styles.selectedSoundsContainer}>
        {selectedSounds.map((sound, index) => (
          <View key={index} style={styles.selectedSound}>
            <Text style={styles.soundText}>{sound}</Text>
            <TouchableOpacity
              onPress={() => handleSoundRemove(index)}
              style={styles.removeSound}
            >
              <XCircle size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {feedback.visible && (
        <View style={[styles.feedback, feedback.correct ? styles.correctFeedback : styles.incorrectFeedback]}>
          {feedback.correct ? (
            <>
              <Check color="#059669" size={24} />
              <Text style={[styles.feedbackText, styles.correctText]}>
                Excellent! You got it right!
              </Text>
            </>
          ) : (
            <>
              <X color="#dc2626" size={24} />
              <Text style={[styles.feedbackText, styles.incorrectText]}>
                Keep practicing! The correct answer is "{correctAnswer}"
              </Text>
            </>
          )}
        </View>
      )}

      <View style={styles.soundsGrid}>
        {availableSounds.map((sound, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.soundButton,
              selectedSounds.includes(sound) && styles.soundButtonDisabled
            ]}
            onPress={() => handleSoundSelect(sound)}
            disabled={selectedSounds.includes(sound) || feedback.visible}
          >
            <Text style={styles.soundButtonText}>{sound}</Text>
            <Volume2 size={16} color={selectedSounds.includes(sound) ? '#94a3b8' : '#2563eb'} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionButtons}>
        {!feedback.visible && selectedSounds.length > 0 && (
          <TouchableOpacity
            style={styles.checkButton}
            onPress={checkAnswer}
          >
            <Check size={20} color="#fff" />
            <Text style={styles.checkButtonText}>Check Answer</Text>
          </TouchableOpacity>
        )}

        {showNextButton && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next Word</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsCard}>
        <Text style={styles.resultsTitle}>Game Complete!</Text>
        <Text style={styles.resultsScore}>
          You scored {score} out of {words.length}
        </Text>
        <Text style={styles.resultsFeedback}>
          {score === words.length ? 'Perfect score! Amazing work! 🎉' :
           score >= words.length * 0.7 ? 'Great job! Keep practicing! 👏' :
           'Keep learning! You\'ll get better! 💪'}
        </Text>
        <View style={styles.resultButtons}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={resetGame}
          >
            <Shuffle size={20} color="#fff" />
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/')}
          >
            <Home size={20} color="#fff" />
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.homeIcon}
            onPress={() => router.push('/')}
          >
            <Home size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.title}>Letter Matching</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progress}>
            Word {currentWordIndex + 1} of {words.length}
          </Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>
      </View>

      {isComplete ? renderResults() : renderGameContent()}
    </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIcon: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  progress: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
  },
  score: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
  },
  gameContainer: {
    padding: 20,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    position: 'relative',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  bulgarianWord: {
    fontSize: 40,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  translation: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    fontStyle: 'italic',
  },
  selectedSoundsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedSound: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginRight: 8,
  },
  removeSound: {
    padding: 4,
  },
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    
    marginBottom: 20,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 80,
    justifyContent: 'center',
  },
  soundButtonDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  soundButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
    marginRight: 8,
  },
  actionButtons: {
    gap: 12,
  },
  checkButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  correctFeedback: {
    backgroundColor: '#d1fae5',
  },
  incorrectFeedback: {
    backgroundColor: '#fee2e2',
  },
  feedbackText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginLeft: 8,
  },
  correctText: {
    color: '#059669',
  },
  incorrectText: {
    color: '#dc2626',
  },
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  resultsScore: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  resultsFeedback: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  resultButtons: {
    width: '100%',
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playAgainButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
  homeButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
});