import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';

// Extended number dictionary including compound numbers
const EXTENDED_NUMBERS = {
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

export default function NumberListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(null);

  const filteredNumbers = Object.entries(EXTENDED_NUMBERS).filter(([number, word]) => {
    const query = searchQuery.toLowerCase();
    return number.includes(query) || 
           word.toLowerCase().includes(query) ||
           `number ${number}`.includes(query);
  });

  const numberRanges = [
    { title: '0-9', numbers: filteredNumbers.filter(([n]) => parseInt(n) < 10) },
    { title: '10-19', numbers: filteredNumbers.filter(([n]) => parseInt(n) >= 10 && parseInt(n) < 20) },
    { title: '20-49', numbers: filteredNumbers.filter(([n]) => parseInt(n) >= 20 && parseInt(n) < 50) },
    { title: '50-100', numbers: filteredNumbers.filter(([n]) => parseInt(n) >= 50) }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Number Reference</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search numbers..."
            placeholderTextColor="#64748b"
          />
          {searchQuery !== '' && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {numberRanges.map((range) => (
          <View key={range.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{range.title}</Text>
            <View style={styles.numberGrid}>
              {range.numbers.map(([number, word]) => (
                <TouchableOpacity
                  key={number}
                  style={[
                    styles.numberCard,
                    selectedNumber === number && styles.selectedCard
                  ]}
                  onPress={() => setSelectedNumber(selectedNumber === number ? null : number)}
                >
                  <Text style={styles.number}>{number}</Text>
                  <Text style={styles.word}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedNumber && (
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Number Details</Text>
          <Text style={styles.detailNumber}>{selectedNumber}</Text>
          <Text style={styles.detailWord}>{EXTENDED_NUMBERS[selectedNumber]}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedNumber(null)}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>
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
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#2563eb',
  },
  number: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  word: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#64748b',
  },
  detailCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#64748b',
    marginBottom: 8,
  },
  detailNumber: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  detailWord: {
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    color: '#1e293b',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 8,
  },
});