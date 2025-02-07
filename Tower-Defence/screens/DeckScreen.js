// screens/DeckScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DeckScreen = () => {
  const deckItems = [
    { id: 'tower1', name: 'Blue Tower', description: 'Standard tower with balanced stats.' },
    { id: 'tower2', name: 'Green Tower', description: 'Long-range tower.' },
    { id: 'tower3', name: 'Yellow Tower', description: 'High damage tower.' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Deck & Upgrades</Text>
      {deckItems.map(item => (
        <TouchableOpacity key={item.id} style={styles.item}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemDesc}>{item.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center', backgroundColor: '#2e2e2e' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  item: { backgroundColor: '#444', width: '90%', padding: 15, marginBottom: 10, borderRadius: 8 },
  itemTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  itemDesc: { fontSize: 16, marginTop: 5, color: '#ccc' },
});

export default DeckScreen;
