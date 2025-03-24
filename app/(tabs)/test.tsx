import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Book, Calculator, CircleCheck as CheckCircle, ArrowRight, Check, X } from 'lucide-react-native';

// Import the number and alphabet data
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
  // ... (include all numbers up to 100)
};

const ALPHABET_WORDS = [
  { bulgarian: 'ягода', sounds: ['ya', 'g', 'o', 'd', 'a'], translation: 'strawberry' },
  { bulgarian: 'юни', sounds: ['yu', 'n', 'i'], translation: 'June' },
  { bulgarian: 'щастие', sounds: ['sht', 'a', 's', 't', 'i', 'e'], translation: 'happiness' },
  // ... (include more words)
];

type TestType = 'alphabet' | 'numbers' | 'mixed';
type Question = {
  type: 'alphabet' | 'numbers';
  question: string;
  answer: string;
  options?: string[];
};

export default function TestScreen() {
  const [testType, setTestType] = useState<TestType>('alphabet');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState({ visible: false, correct: false });

  const generateQuestions = (type: TestType) => {
    let newQuestions: Question[] = [];

    if (type === 'alphabet' || type === 'mixed') {
      // Add alphabet questions
      ALPHABET_WORDS.forEach(word => {
        newQuestions.push({
          type: 'alphabet',
          question: word.bulgarian,
          answer: word.translation,
        });
      });
    }

    if (type === 'numbers' || type === 'mixed') {
      // Add number questions
      Object.entries(BULGARIAN_NUMBERS).forEach(([number, word]) => {
        newQuestions.push({
          type: 'numbers',
          question: word,
          answer: number,
        });
      });
    }

    // Shuffle questions
    return newQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  };

  useEffect(() => {
    startNewTest(testType);
  }, [testType]);

  const startNewTest = (type: TestType) => {
    setQuestions(generateQuestions(type));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setUserAnswer('');
    setFeedback({ visible: false, correct: false });
  };

  const checkAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();
    
    setFeedback({ visible: true, correct: isCorrect });
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setFeedback({ visible: false, correct: false });
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const renderTestSelection = () => (
    <View style={styles.testSelection}>
      <TouchableOpacity
        style={[styles.testTypeButton, testType === 'alphabet' && styles.activeTestType]}
        onPress={() => setTestType('alphabet')}>
        <Book size={24} color={testType === 'alphabet' ? '#fff' : '#64748b'} />
        <Text style={[styles.testTypeText, testType === 'alphabet' && styles.activeTestTypeText]}>
          Alphabet Test
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.testTypeButton, testType === 'numbers' && styles.activeTestType]}
        onPress={() => setTestType('numbers')}>
        <Calculator size={24} color={testType === 'numbers' ? '#fff' : '#64748b'} />
        <Text style={[styles.testTypeText, testType === 'numbers' && styles.activeTestTypeText]}>
          Numbers Test
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.testTypeButton, testType === 'mixed' && styles.activeTestType]}
        onPress={() => setTestType('mixed')}>
        <CheckCircle size={24} color={testType === 'mixed' ? '#fff' : '#64748b'} />
        <Text style={[styles.testTypeText, testType === 'mixed' && styles.activeTestTypeText]}>
          Mixed Test
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        
        <View style={styles.questionCard}>
          <Text style={styles.questionType}>
            {currentQuestion.type === 'alphabet' ? 'Translate to English' : 'Convert to Number'}
          </Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.answerContainer}>
          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Your answer..."
            placeholderTextColor="#64748b"
            onSubmitEditing={checkAnswer}
          />
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={checkAnswer}
            disabled={!userAnswer}>
            <Text style={styles.submitButtonText}>Submit Answer</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
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
                  Correct!
                </Text>
              </>
            ) : (
              <>
                <X size={24} color="#dc2626" />
                <Text style={[styles.feedbackText, styles.incorrectText]}>
                  The correct answer is: {questions[currentQuestionIndex].answer}
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsCard}>
        <Text style={styles.resultsTitle}>Test Complete!</Text>
        <Text style={styles.resultsScore}>
          Your Score: {score} out of {questions.length}
        </Text>
        <Text style={styles.resultsPercentage}>
          {Math.round((score / questions.length) * 100)}%
        </Text>
        <Text style={styles.resultsFeedback}>
          {score === questions.length ? '🎉 Perfect Score! Amazing work!' :
           score >= questions.length * 0.8 ? '👏 Great job! Keep it up!' :
           score >= questions.length * 0.6 ? '💪 Good effort! Keep practicing!' :
           'Keep learning! You\'ll improve! 📚'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => startNewTest(testType)}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Test</Text>
        <Text style={styles.subtitle}>Test your Bulgarian language skills</Text>
      </View>

      {renderTestSelection()}
      
      {!showResult ? renderQuestion() : renderResults()}
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
  testSelection: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  testTypeButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeTestType: {
    backgroundColor: '#2563eb',
  },
  testTypeText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
    textAlign: 'center',
  },
  activeTestTypeText: {
    color: '#fff',
  },
  questionContainer: {
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  questionCounter: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionType: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
  },
  answerContainer: {
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
  },
  submitButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  feedback: {
    marginTop: 16,
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
  resultsContainer: {
    padding: 20,
  },
  resultsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  resultsScore: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
    marginBottom: 8,
  },
  resultsPercentage: {
    fontSize: 48,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
    marginBottom: 16,
  },
  resultsFeedback: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});