import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { Check, X, Shuffle } from 'lucide-react-native';

// Bulgarian alphabet with letters and their Latin transliterations
const ALPHABET = [
  { letter: 'А', sound: 'a', example: 'автобус (avtobus) - bus' },
  { letter: 'Б', sound: 'b', example: 'баба (baba) - grandmother' },
  { letter: 'В', sound: 'v', example: 'вода (voda) - water' },
  { letter: 'Г', sound: 'g', example: 'град (grad) - city' },
  { letter: 'Д', sound: 'd', example: 'дом (dom) - home' },
  { letter: 'Е', sound: 'e', example: 'ехо (eho) - echo' },
  { letter: 'Ж', sound: 'zh', example: 'жена (zhena) - woman' },
  { letter: 'З', sound: 'z', example: 'зъб (zab) - tooth' },
  { letter: 'И', sound: 'i', example: 'име (ime) - name' },
  { letter: 'Й', sound: 'y', example: 'йога (yoga) - yoga' },
  { letter: 'К', sound: 'k', example: 'куче (kuche) - dog' },
  { letter: 'Л', sound: 'l', example: 'луна (luna) - moon' },
  { letter: 'М', sound: 'm', example: 'мама (mama) - mother' },
  { letter: 'Н', sound: 'n', example: 'нос (nos) - nose' },
  { letter: 'О', sound: 'o', example: 'око (oko) - eye' },
  { letter: 'П', sound: 'p', example: 'път (pat) - road' },
  { letter: 'Р', sound: 'r', example: 'риба (riba) - fish' },
  { letter: 'С', sound: 's', example: 'сън (san) - dream' },
  { letter: 'Т', sound: 't', example: 'там (tam) - there' },
  { letter: 'У', sound: 'u', example: 'ухо (uho) - ear' },
  { letter: 'Ф', sound: 'f', example: 'филм (film) - movie' },
  { letter: 'Х', sound: 'h', example: 'хляб (hlyab) - bread' },
  { letter: 'Ц', sound: 'ts', example: 'цвят (tsvyat) - color' },
  { letter: 'Ч', sound: 'ch', example: 'час (chas) - hour' },
  { letter: 'Ш', sound: 'sh', example: 'шал (shal) - scarf' },
  { letter: 'Щ', sound: 'sht', example: 'щастие (shtastie) - happiness' },
  { letter: 'Ъ', sound: 'a', example: 'със (sas) - with' },
  { letter: 'Ь', sound: '', example: 'пять (pyat) - five' },
  { letter: 'Ю', sound: 'yu', example: 'юни (yuni) - June' },
  { letter: 'Я', sound: 'ya', example: 'ягода (yagoda) - strawberry' }
];

export default function AlphabetScreen() {
  const [mode, setMode] = useState('learn');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', isCorrect: null });
  const [score, setScore] = useState(0);
  const [letterRange, setLetterRange] = useState('0-5');
  const [randomize, setRandomize] = useState(false);
  const [customSelection, setCustomSelection] = useState(
    ALPHABET.map(() => false)
  );

  useEffect(() => {
    initializeLetters();
  }, [letterRange, randomize, customSelection]);

  const initializeLetters = () => {
    let letters = [];
    
    if (letterRange === 'custom') {
      letters = ALPHABET.filter((_, index) => customSelection[index]);
    } else {
      const [start, end] = letterRange.split('-').map(Number);
      letters = ALPHABET.slice(start, end);
    }

    if (randomize) {
      letters = shuffleArray([...letters]);
    }

    setSelectedLetters(letters);
    setCurrentIndex(0);
    setScore(0);
    setUserInput('');
    setFeedback({ message: '', isCorrect: null });
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const checkAnswer = () => {
    const isCorrect = userInput.toLowerCase() === selectedLetters[currentIndex].sound.toLowerCase();
    setFeedback({
      message: isCorrect ? 'Correct!' : `Not quite. The correct answer is "${selectedLetters[currentIndex].sound}"`,
      isCorrect
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setUserInput('');
      setFeedback({ message: '', isCorrect: null });
      if (currentIndex < selectedLetters.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Round complete
        setCurrentIndex(0);
      }
    }, 1500);
  };

  const renderLearnMode = () => (
    <ScrollView style={styles.scrollView}>
      {ALPHABET.map((item, index) => (
        <View key={index} style={styles.letterCard}>
          <Text style={styles.letterText}>{item.letter}</Text>
          <View style={styles.letterInfo}>
            <Text style={styles.soundText}>Sound: {item.sound}</Text>
            <Text style={styles.exampleText}>{item.example}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderPracticeMode = () => (
    <ScrollView style={styles.practiceContainer}>
      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Practice Settings</Text>
        
        <View style={styles.rangeSelector}>
          <Text style={styles.settingsLabel}>Letter Range:</Text>
          <View style={styles.rangeButtons}>
            {['0-5', '5-10', '10-20', '20-30', 'custom'].map((range, index) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.rangeButton,
                  letterRange === range && styles.rangeButtonActive,
                  index > 0 && styles.rangeButtonMargin
                ]}
                onPress={() => setLetterRange(range)}>
                <Text style={[
                  styles.rangeButtonText,
                  letterRange === range && styles.rangeButtonTextActive
                ]}>
                  {range === 'custom' ? 'Custom' : range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.randomizeOption}>
          <Text style={styles.settingsLabel}>Randomize Letters</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={randomize}
              onValueChange={setRandomize}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={randomize ? '#2563eb' : '#f4f4f5'}
            />
            <Shuffle size={20} color={randomize ? '#2563eb' : '#64748b'} style={styles.shuffleIcon} />
          </View>
        </View>

        {letterRange === 'custom' && (
          <View style={styles.customSelection}>
            <Text style={styles.settingsLabel}>Select Letters:</Text>
            <View style={styles.letterGrid}>
              {ALPHABET.map((letter, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.letterOption,
                    customSelection[index] && styles.letterOptionSelected,
                    index % 5 !== 0 && styles.letterOptionMargin,
                    Math.floor(index / 5) > 0 && styles.letterOptionMarginTop
                  ]}
                  onPress={() => {
                    const newSelection = [...customSelection];
                    newSelection[index] = !newSelection[index];
                    setCustomSelection(newSelection);
                  }}>
                  <Text style={[
                    styles.letterOptionText,
                    customSelection[index] && styles.letterOptionTextSelected
                  ]}>
                    {letter.letter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {selectedLetters.length > 0 && (
        <View style={styles.practiceSection}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.progressText}>
              Letter {currentIndex + 1} of {selectedLetters.length}
            </Text>
          </View>

          <View style={styles.letterDisplay}>
            <Text style={styles.currentLetter}>{selectedLetters[currentIndex].letter}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.promptText}>What sound does this letter make?</Text>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={checkAnswer}
              placeholder="Type the sound..."
              placeholderTextColor="#64748b"
            />
            {feedback.message && (
              <View style={[
                styles.feedback,
                { backgroundColor: feedback.isCorrect ? '#d1fae5' : '#fee2e2' }
              ]}>
                {feedback.isCorrect ? (
                  <Check size={20} color="#059669" />
                ) : (
                  <X size={20} color="#dc2626" />
                )}
                <Text style={[
                  styles.feedbackText,
                  { color: feedback.isCorrect ? '#059669' : '#dc2626' }
                ]}>
                  {feedback.message}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
              <Text style={styles.checkButtonText}>Check Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'learn' && styles.activeMode]}
          onPress={() => setMode('learn')}>
          <Text style={[styles.modeButtonText, mode === 'learn' && styles.activeModeText]}>
            Learn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'practice' && styles.activeMode]}
          onPress={() => setMode('practice')}>
          <Text style={[styles.modeButtonText, mode === 'practice' && styles.activeModeText]}>
            Practice
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'learn' ? renderLearnMode() : renderPracticeMode()}
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeMode: {
    backgroundColor: '#2563eb',
  },
  modeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
  },
  activeModeText: {
    color: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  letterCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  letterText: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    marginRight: 16,
    color: '#2563eb',
  },
  letterInfo: {
    flex: 1,
  },
  soundText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
    color: '#1e293b',
  },
  exampleText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
  },
  practiceContainer: {
    flex: 1,
    padding: 16,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingsLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1e293b',
    marginBottom: 8,
  },
  rangeSelector: {
    marginBottom: 16,
  },
  rangeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  rangeButtonMargin: {
    marginLeft: 8,
  },
  rangeButtonActive: {
    backgroundColor: '#2563eb',
  },
  rangeButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
  },
  rangeButtonTextActive: {
    color: '#fff',
  },
  randomizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shuffleIcon: {
    marginLeft: 8,
  },
  customSelection: {
    marginTop: 16,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  letterOption: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  letterOptionMargin: {
    marginLeft: 8,
  },
  letterOptionMarginTop: {
    marginTop: 8,
  },
  letterOptionSelected: {
    backgroundColor: '#2563eb',
  },
  letterOptionText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
  },
  letterOptionTextSelected: {
    color: '#fff',
  },
  practiceSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
  },
  progressText: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
  },
  letterDisplay: {
    alignItems: 'center',
    marginBottom: 32,
  },
  currentLetter: {
    fontSize: 96,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  promptText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 8,
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
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