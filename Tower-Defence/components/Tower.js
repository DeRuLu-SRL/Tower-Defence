import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function Tower({ position, towerType, onPress }) {
  let imageSource;
  switch (towerType) {
    case 'archer':
      imageSource = require('../assets/archer_tower.png');
      break;
    case 'cannon':
      imageSource = require('../assets/cannon_tower.png');
      break;
    case 'mage':
      imageSource = require('../assets/mage_tower.png');
      break;
    default:
      imageSource = require('../assets/archer_tower.png'); // Fallback
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress} // ✅ Click now works!
      style={[
        styles.towerContainer,
        { left: position.x, top: position.y }
      ]}
    >
      <Image source={imageSource} style={styles.towerImage} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  towerContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100, // ✅ Ensure it's above other elements
    elevation: 10, // ✅ Works for Android
  },
  towerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
