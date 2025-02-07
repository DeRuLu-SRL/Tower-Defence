// components/Tower.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Tower = (props) => {
  // Expect props: position, towerType, and color.
  const { position, towerType, color } = props;

  let towerStyle = styles.default;
  let imageSource = null;

  switch (towerType) {
    case 'archer':
      towerStyle = styles.archer;
      imageSource = require('../assets/archer_tower.png');
      break;
    case 'cannon':
      towerStyle = styles.cannon;
      imageSource = require('../assets/cannon_tower.png');
      break;
    case 'mage':
      towerStyle = styles.mage;
      imageSource = require('../assets/mage_tower.png');
      break;
    default:
      towerStyle = styles.default;
      break;
  }

  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={[
          styles.tower,
          towerStyle,
          { left: position.x, top: position.y }
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.tower,
        towerStyle,
        { backgroundColor: color || 'gray', left: position.x, top: position.y }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  tower: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 5,
    zIndex: 100,
    borderWidth: 2,
    borderColor: '#fff',
  },
  default: {
    backgroundColor: 'gray',
  },
  archer: {
    // Optional custom styling for archer tower.
  },
  cannon: {
    // Optional custom styling for cannon tower.
  },
  mage: {
    // Optional custom styling for mage tower.
  },
});

export default Tower;
