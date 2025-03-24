import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Calculator, Check, X, ArrowRight, Shuffle, Book, GraduationCap } from 'lucide-react-native';

const BULGARIAN_NUMBERS = {
  0: 'нула',
  1: 'едно',
  2: 'две',
  3: 'три',
  4: 'четири',
  5: 'пет',
  6: 'шест',
  7: 'седем',
  8: 'осем',
  9: 'девет',
  10: 'десет',
  11: 'единадесет',
  12: 'дванадесет',
  13: 'тринадесет',
  14: 'четиринадесет',
  15: 'петнадесет',
  16: 'шестнадесет',
  17: 'седемнадесет',
  18: 'осемнадесет',
  19: 'деветнадесет',
  20: 'двадесет',
  21: 'двадесет и едно',
  22: 'двадесет и две',
  23: 'двадесет и три',
  24: 'двадесет и четири',
  25: 'двадесет и пет',
  30: 'тридесет',
  31: 'тридесет и едно',
  32: 'тридесет и две',
  40: 'четиридесет',
  50: 'петдесет',
  60: 'шестдесет',
  70: 'седемдесет',
  80: 'осемдесет',
  90: 'деветдесет',
  100: 'сто'
};

function generateMathProblem() {
  const operations = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, result;

  if (operation === '+') {
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * (100 - num1)) + 1;
    result = num1 + num2;
  } else {
    num1 = Math.floor(Math.random() * 100) + 1;
    num2 = Math.floor(Math.random() * num1) + 1;
    result = num1 - num2;
  }

  return {
    num1: BULGARIAN_NUMBERS[num1] || num1.toString(),
    num2: BULGARIAN_NUMBERS[num2] || num2.toString(),
    operation,
    result
  };
}

export default function NumbersScreen() {
  const [mode, setMode] = useState('learn'); // 'learn' or 'practice'
  const [problem, setProblem] = useState(generateMathProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({ visible: false, correct: false });
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [numberRange, setNumberRange] = useState('0-10');
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isRandom, setIsRandom] = useState(false);

  const ranges = {
    '0-10': Array.from({ length: 11 }, (_, i) => i),
    '11-20': Array.from({ length: 10 }, (_, i) => i + 11),
    '21-50': Array.from({ length: 30 }, (_, i) => i + 21),
    '51-100': Array.from({ length: 50 }, (_, i) => i + 51)
  };

  const getNextNumber = () => {
    const currentRange = ranges[numberRange];
    if (isRandom) {
      return currentRange[Math.floor(Math.random() * currentRange.length)];
    }
    const currentIndex = currentRange.indexOf(currentNumber);
    return currentRange[(currentIndex + 1) % currentRange.length];
  };

  const checkNumberAnswer = () => {
    const isCorrect = parseInt(userAnswer) === currentNumber;
    setFeedback({ visible: true, correct: isCorrect });
    if (isCorrect) setScore(score + 1);
    setTotalProblems(totalProblems + 1);
  };

  const nextNumber = () => {
    setCurrentNumber(getNextNumber());
    setUserAnswer('');
    setFeedback({ visible: false, correct: false });
  };

  const checkMathAnswer = () => {
    const isCorrect = parseInt(userAnswer) === problem.result;
    setFeedback({ visible: true, correct: isCorrect });
    if (isCorrect) setScore(score + 1);
    setTotalProblems(totalProblems + 1);
  };

  const nextProblem = () => {
    setProblem(generateMathProblem());
    setUserAnswer('');
    setFeedback({ visible: false, correct: false });
  };

  const renderLearnMode = () => (
    <View style={styles.content}>
      <View style={styles.rangeSelector}>
        <Text style={styles.rangeTitle}>Select Number Range:</Text>
        <View style={styles.rangeButtons}>
          {Object.keys(ranges).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                numberRange === range && styles.rangeButtonActive
              ]}
              onPress={() => {
                setNumberRange(range);
                setCurrentNumber(ranges[range][0]);
                setFeedback({ visible: false, correct: false });
                setUserAnswer('');
              }}>
              <Text style={[
                styles.rangeButtonText,
                numberRange === range && styles.rangeButtonTextActive
              ]}>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.randomToggle}>
          <Text style={styles.randomText}>Random Numbers</Text>
          <TouchableOpacity
            style={[styles.randomButton, isRandom && styles.randomButtonActive]}
            onPress={() => setIsRandom(!isRandom)}>
            <Shuffle size={20} color={isRandom ? '#fff' : '#64748b'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.numberCard}>
        <Text style={styles.bulgarianNumber}>{BULGARIAN_NUMBERS[currentNumber]}</Text>
        <Text style={styles.hint}>What number is this?</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userAnswer}
          onChangeText={setUserAnswer}
          keyboardType="number-pad"
          placeholder="Enter the number..."
          placeholderTextColor="#64748b"
        />
        
        {!feedback.visible ? (
          <TouchableOpacity
            style={styles.checkButton}
            onPress={checkNumberAnswer}
            disabled={!userAnswer}>
            <Text style={styles.buttonText}>Check Answer</Text>
            <Check size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextNumber}>
            <Text style={styles.buttonText}>Next Number</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {feedback.visible && (
        <View style={[
          styles.feedback,
          feedback.correct ? styles.correctFeedback : styles.incorrectFeedback
        ]}>
          {feedback.correct ? (
            <>
              <Check size={24} color="#059669" />
              <Text style={[styles.feedbackText, styles.correctText]}>
                Correct! {BULGARIAN_NUMBERS[currentNumber]} = {currentNumber}
              </Text>
            </>
          ) : (
            <>
              <X size={24} color="#dc2626" />
              <Text style={[styles.feedbackText, styles.incorrectText]}>
                The correct answer is {currentNumber}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );

  const renderPracticeMode = () => (
    <View style={styles.content}>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreText}>Score: {score}/{totalProblems}</Text>
      </View>

      <View style={styles.problemCard}>
        <Text style={styles.problemText}>
          {problem.num1} {problem.operation} {problem.num2} = ?
        </Text>
        <Text style={styles.hint}>Write the answer in numbers</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userAnswer}
          onChangeText={setUserAnswer}
          keyboardType="number-pad"
          placeholder="Your answer..."
          placeholderTextColor="#64748b"
        />
        
        {!feedback.visible ? (
          <TouchableOpacity
            style={styles.checkButton}
            onPress={checkMathAnswer}
            disabled={!userAnswer}>
            <Text style={styles.buttonText}>Check Answer</Text>
            <Check size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextProblem}>
            <Text style={styles.buttonText}>Next Problem</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {feedback.visible && (
        <View style={[
          styles.feedback,
          feedback.correct ? styles.correctFeedback : styles.incorrectFeedback
        ]}>
          {feedback.correct ? (
            <>
              <Check size={24} color="#059669" />
              <Text style={[styles.feedbackText, styles.correctText]}>
                Correct! Well done!
              </Text>
            </>
          ) : (
            <>
              <X size={24} color="#dc2626" />
              <Text style={[styles.feedbackText, styles.incorrectText]}>
                The correct answer is {problem.result}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'learn' && styles.modeButtonActive]}
            onPress={() => setMode('learn')}>
            <Book size={20} color={mode === 'learn' ? '#fff' : '#64748b'} />
            <Text style={[styles.modeButtonText, mode === 'learn' && styles.modeButtonTextActive]}>
              Learn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'practice' && styles.modeButtonActive]}
            onPress={() => setMode('practice')}>
            <GraduationCap size={20} color={mode === 'practice' ? '#fff' : '#64748b'} />
            <Text style={[styles.modeButtonText, mode === 'practice' && styles.modeButtonTextActive]}>
              Practice
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {mode === 'learn' ? renderLearnMode() : renderPracticeMode()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
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
  modeButtonActive: {
    backgroundColor: '#2563eb',
  },
  modeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  rangeSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rangeTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  rangeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
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
  randomToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  randomText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1e293b',
  },
  randomButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  randomButtonActive: {
    backgroundColor: '#2563eb',
  },
  numberCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bulgarianNumber: {
    fontSize: 48,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  scoreCard: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  problemCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  problemText: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    fontStyle: 'italic',
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#1e293b',
  },
  checkButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  nextButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  feedback: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});