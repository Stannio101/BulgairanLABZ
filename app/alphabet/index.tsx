import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Reanimated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Volume2,
  GraduationCap,
  Book,
  ArrowLeft,
  Music,
  Check,
  X,
  Shuffle,
} from 'lucide-react-native';

const ALPHABET = [
  { letter: 'А', sound: 'a', example: { word: 'автобус', translation: 'bus', pronunciation: 'avtobus' }, color: ['#FF6B6B', '#EE5253'] },
  { letter: 'Б', sound: 'b', example: { word: 'баба', translation: 'grandmother', pronunciation: 'baba' }, color: ['#4ECDC4', '#45B7AF'] },
  { letter: 'В', sound: 'v', example: { word: 'вода', translation: 'water', pronunciation: 'voda' }, color: ['#FFD93D', '#F4C430'] },
  { letter: 'Г', sound: 'g', example: { word: 'град', translation: 'city', pronunciation: 'grad' }, color: ['#6C5CE7', '#5849BE'] },
  { letter: 'Д', sound: 'd', example: { word: 'дом', translation: 'home', pronunciation: 'dom' }, color: ['#A8E6CF', '#8CD3B5'] },
  { letter: 'Е', sound: 'e', example: { word: 'ехо', translation: 'echo', pronunciation: 'eho' }, color: ['#FF9F43', '#E67E22'] },
  { letter: 'Ж', sound: 'zh', example: { word: 'жена', translation: 'woman', pronunciation: 'zhena' }, color: ['#EE5A24', '#D63031'] },
  { letter: 'З', sound: 'z', example: { word: 'зъб', translation: 'tooth', pronunciation: 'zab' }, color: ['#A3CB38', '#8DAA2E'] },
  { letter: 'И', sound: 'i', example: { word: 'име', translation: 'name', pronunciation: 'ime' }, color: ['#FDA7DF', '#D980FA'] },
  { letter: 'Й', sound: 'y', example: { word: 'йога', translation: 'yoga', pronunciation: 'yoga' }, color: ['#1289A7', '#0E7490'] },
  { letter: 'К', sound: 'k', example: { word: 'куче', translation: 'dog', pronunciation: 'kuche' }, color: ['#F368E0', '#D147A3'] },
  { letter: 'Л', sound: 'l', example: { word: 'луна', translation: 'moon', pronunciation: 'luna' }, color: ['#00B894', '#009B7A'] },
  { letter: 'М', sound: 'm', example: { word: 'мама', translation: 'mother', pronunciation: 'mama' }, color: ['#FF6B81', '#EE5253'] },
  { letter: 'Н', sound: 'n', example: { word: 'нос', translation: 'nose', pronunciation: 'nos' }, color: ['#A8E6CF', '#8CD3B5'] },
  { letter: 'О', sound: 'o', example: { word: 'око', translation: 'eye', pronunciation: 'oko' }, color: ['#FFC312', '#F79F1F'] },
  { letter: 'П', sound: 'p', example: { word: 'път', translation: 'road', pronunciation: 'pat' }, color: ['#C4E538', '#A3CB38'] },
  { letter: 'Р', sound: 'r', example: { word: 'риба', translation: 'fish', pronunciation: 'riba' }, color: ['#12CBC4', '#0FADA8'] },
  { letter: 'С', sound: 's', example: { word: 'сън', translation: 'dream', pronunciation: 'san' }, color: ['#FDA7DF', '#D980FA'] },
  { letter: 'Т', sound: 't', example: { word: 'там', translation: 'there', pronunciation: 'tam' }, color: ['#ED4C67', '#B53471'] },
  { letter: 'У', sound: 'u', example: { word: 'ухо', translation: 'ear', pronunciation: 'uho' }, color: ['#F79F1F', '#EE5A24'] },
  { letter: 'Ф', sound: 'f', example: { word: 'филм', translation: 'movie', pronunciation: 'film' }, color: ['#A3CB38', '#8DAA2E'] },
  { letter: 'Х', sound: 'h', example: { word: 'хляб', translation: 'bread', pronunciation: 'hlyab' }, color: ['#1289A7', '#0E7490'] },
  { letter: 'Ц', sound: 'ts', example: { word: 'цвят', translation: 'color', pronunciation: 'tsvyat' }, color: ['#C4E538', '#A3CB38'] },
  { letter: 'Ч', sound: 'ch', example: { word: 'час', translation: 'hour', pronunciation: 'chas' }, color: ['#FDA7DF', '#D980FA'] },
  { letter: 'Ш', sound: 'sh', example: { word: 'шал', translation: 'scarf', pronunciation: 'shal' }, color: ['#ED4C67', '#B53471'] },
  { letter: 'Щ', sound: 'sht', example: { word: 'щастие', translation: 'happiness', pronunciation: 'shtastie' }, color: ['#F79F1F', '#EE5A24'] },
  { letter: 'Ъ', sound: 'a', example: { word: 'със', translation: 'with', pronunciation: 'sas' }, color: ['#A3CB38', '#8DAA2E'] },
  { letter: 'Ь', sound: '', example: { word: 'пять', translation: 'five', pronunciation: 'pyat' }, color: ['#1289A7', '#0E7490'] },
  { letter: 'Ю', sound: 'yu', example: { word: 'юни', translation: 'June', pronunciation: 'yuni' }, color: ['#C4E538', '#A3CB38'] },
  { letter: 'Я', sound: 'ya', example: { word: 'ягода', translation: 'strawberry', pronunciation: 'yagoda' }, color: ['#FDA7DF', '#D980FA'] }
];

const AnimatedTouchable = Reanimated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Reanimated.createAnimatedComponent(View);

export default function AlphabetLearning() {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<'learn' | 'practice'>('learn');
  const [selectedLetter, setSelectedLetter] = useState(ALPHABET[0]);
  const [practiceRange, setPracticeRange] = useState('0-10');
  const [currentPracticeLetter, setCurrentPracticeLetter] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({ visible: false, correct: false });
  const [practiceScore, setPracticeScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isRandomOrder, setIsRandomOrder] = useState(false);

  const letterScale = useSharedValue(1);
  const contentOpacity = useSharedValue(1);

  const handleLetterSelect = (letter: typeof ALPHABET[0]) => {
    contentOpacity.value = withTiming(0, { duration: 200 }, () => {
      setSelectedLetter(letter);
      letterScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withSpring(1)
      );
      contentOpacity.value = withTiming(1, { duration: 300 });
    });
  };

  const letterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: letterScale.value }],
    opacity: contentOpacity.value,
  }));

  const getPracticeLetters = () => {
    if (practiceRange === 'all') {
      return ALPHABET;
    }
    const [start, end] = practiceRange.split('-').map(Number);
    return ALPHABET.slice(start, end);
  };

  const initializePractice = () => {
    const letters = getPracticeLetters();
    const practiceLetters = isRandomOrder ? [...letters].sort(() => Math.random() - 0.5) : letters;
    setCurrentPracticeLetter(practiceLetters[0]);
    setUserAnswer('');
    setFeedback({ visible: false, correct: false });
    setPracticeScore(0);
    setTotalAttempts(0);
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.toLowerCase() === currentPracticeLetter.sound.toLowerCase();
    setFeedback({ visible: true, correct: isCorrect });
    
    if (isCorrect) {
      setPracticeScore(score => score + 1);
    }
    setTotalAttempts(attempts => attempts + 1);

    setTimeout(() => {
      const practiceLetters = getPracticeLetters();
      const currentIndex = practiceLetters.findIndex(l => l.letter === currentPracticeLetter.letter);
      
      if (currentIndex < practiceLetters.length - 1) {
        setCurrentPracticeLetter(practiceLetters[currentIndex + 1]);
      } else {
        setCurrentPracticeLetter(null);
      }
      
      setUserAnswer('');
      setFeedback({ visible: false, correct: false });
    }, 1500);
  };

  const renderLearnMode = () => (
    <View style={styles.learnContainer}>
      <AnimatedView style={[styles.letterDisplay, letterAnimatedStyle]}>
        <LinearGradient
          colors={selectedLetter.color}
          style={styles.letterBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.letterText}>{selectedLetter.letter}</Text>
          <TouchableOpacity style={styles.soundButton}>
            <Volume2 color="#fff" size={24} />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleWord}>{selectedLetter.example.word}</Text>
          <Text style={styles.exampleTranslation}>
            {selectedLetter.example.translation}
          </Text>
          <Text style={styles.pronunciation}>
            /{selectedLetter.example.pronunciation}/
          </Text>
        </View>
      </AnimatedView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.letterStrip}
        contentContainerStyle={styles.letterStripContent}
      >
        {ALPHABET.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.letterChip,
              selectedLetter.letter === letter.letter && styles.selectedChip,
            ]}
            onPress={() => handleLetterSelect(letter)}
          >
            <Text
              style={[
                styles.letterChipText,
                selectedLetter.letter === letter.letter && styles.selectedChipText,
              ]}
            >
              {letter.letter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPracticeMode = () => (
    <View style={styles.practiceContainer}>
      {!currentPracticeLetter ? (
        <View style={styles.practiceSettings}>
          <Text style={styles.settingsTitle}>Practice Settings</Text>
          
          <View style={styles.letterSelection}>
            <Text style={styles.settingsLabel}>Select Letters to Practice:</Text>
            <View style={styles.rangeButtons}>
              {['0-10', '11-20', 'all'].map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.rangeButton,
                    practiceRange === range && styles.rangeButtonActive
                  ]}
                  onPress={() => setPracticeRange(range)}
                >
                  <Text style={[
                    styles.rangeButtonText,
                    practiceRange === range && styles.rangeButtonTextActive
                  ]}>
                    {range === 'all' ? 'All Letters' : `Letters ${range}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.randomizeOption}>
            <Text style={styles.settingsLabel}>Randomize Order</Text>
            <TouchableOpacity
              style={[styles.randomizeButton, isRandomOrder && styles.randomizeButtonActive]}
              onPress={() => setIsRandomOrder(!isRandomOrder)}
            >
              <Shuffle size={20} color={isRandomOrder ? '#fff' : '#64748b'} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={initializePractice}
          >
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.practiceGame}>
          <View style={styles.scoreBoard}>
            <Text style={styles.scoreText}>Score: {practiceScore}/{totalAttempts}</Text>
          </View>

          <View style={styles.letterDisplay}>
            <LinearGradient
              colors={currentPracticeLetter.color}
              style={styles.letterBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.letterText}>{currentPracticeLetter.letter}</Text>
            </LinearGradient>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.promptText}>What sound does this letter make?</Text>
            <TextInput
              style={styles.input}
              value={userAnswer}
              onChangeText={setUserAnswer}
              onSubmitEditing={checkAnswer}
              placeholder="Type the sound..."
              placeholderTextColor="#64748b"
              autoCapitalize="none"
            />

            {feedback.visible && (
              <View style={[
                styles.feedback,
                feedback.correct ? styles.correctFeedback : styles.incorrectFeedback
              ]}>
                {feedback.correct ? (
                  <Check size={20} color="#059669" />
                ) : (
                  <X size={20} color="#dc2626" />
                )}
                <Text style={[
                  styles.feedbackText,
                  { color: feedback.correct ? '#059669' : '#dc2626' }
                ]}>
                  {feedback.correct ? 'Correct!' : `The correct sound is "${currentPracticeLetter.sound}"`}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.checkButton}
              onPress={checkAnswer}
              disabled={!userAnswer || feedback.visible}
            >
              <Text style={styles.checkButtonText}>Check Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Learn the Alphabet</Text>
        <TouchableOpacity style={styles.soundToggle}>
          <Music size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, currentMode === 'learn' && styles.activeModeButton]}
          onPress={() => setCurrentMode('learn')}
        >
          <Book
            size={20}
            color={currentMode === 'learn' ? '#fff' : '#64748b'}
          />
          <Text
            style={[
              styles.modeButtonText,
              currentMode === 'learn' && styles.activeModeButtonText,
            ]}
          >
            Learn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, currentMode === 'practice' && styles.activeModeButton]}
          onPress={() => setCurrentMode('practice')}
        >
          <GraduationCap
            size={20}
            color={currentMode === 'practice' ? '#fff' : '#64748b'}
          />
          <Text
            style={[
              styles.modeButtonText,
              currentMode === 'practice' && styles.activeModeButtonText,
            ]}
          >
            Practice
          </Text>
        </TouchableOpacity>
      </View>

      {currentMode === 'learn' ? renderLearnMode() : renderPracticeMode()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
  },
  soundToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  modeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
  },
  activeModeButton: {
    backgroundColor: '#2563eb',
  },
  modeButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
  },
  activeModeButtonText: {
    color: '#fff',
  },
  learnContainer: {
    flex: 1,
    padding: 16,
  },
  letterDisplay: {
    marginBottom: 24,
  },
  letterBackground: {
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  letterText: {
    fontSize: 120,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  soundButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  exampleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: -20,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleWord: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  exampleTranslation: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  letterStrip: {
    marginTop: 24,
  },
  letterStripContent: {
    paddingHorizontal: 8,
    gap: 8,
  },
  letterChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedChip: {
    backgroundColor: '#2563eb',
  },
  letterChipText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
  },
  selectedChipText: {
    color: '#fff',
  },
  practiceContainer: {
    flex: 1,
    padding: 16,
  },
  practiceSettings: {
    padding: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  settingsLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1e293b',
    marginBottom: 12,
  },
  letterSelection: {
    marginBottom: 24,
  },
  rangeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  rangeButtonActive: {
    backgroundColor: '#2563eb',
  },
  rangeButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
  },
  rangeButtonTextActive: {
    color: '#fff',
  },
  randomizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  randomizeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  randomizeButtonActive: {
    backgroundColor: '#2563eb',
  },
  startButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  practiceGame: {
    padding: 20,
  },
  scoreBoard: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  promptText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 16,
    color: '#1e293b',
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  correctFeedback: {
    backgroundColor: '#d1fae5',
  },
  incorrectFeedback: {
    backgroundColor: '#fee2e2',
  },
  feedbackText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  checkButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});