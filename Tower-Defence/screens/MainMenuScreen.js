// screens/MainMenu.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MainMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tower Defense Game</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GameScreen')}
      >
        <Text style={styles.buttonText}>Start Game</Text>
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
