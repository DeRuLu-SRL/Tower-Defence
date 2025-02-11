// screens/MainMenuScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MainMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tower Defense Game</Text>
      
      {/* → Endless Mode: navigates to the endless game screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EndlessGameScreen')}
      >
        <Text style={styles.buttonText}>Endless Mode</Text>
      </TouchableOpacity>

      {/* → Story Mode / Level Selection */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LevelsScreen')}
      >
        <Text style={styles.buttonText}>Select Level</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.smallButton]}
          onPress={() => navigation.navigate('DeckScreen')}
        >
          <Text style={styles.buttonText}>Deck</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.smallButton]}
          onPress={() => navigation.navigate('ShopScreen')}
        >
          <Text style={styles.buttonText}>Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { 
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40 
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  smallButton: {
    width: '40%',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%'
  }
});

export default MainMenu;
