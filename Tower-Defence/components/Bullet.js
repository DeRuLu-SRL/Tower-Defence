// components/Bullet.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Bullet = ({ position, bulletType }) => {
  let imageSource;
  let style = styles.defaultBullet;
  switch (bulletType) {
    case 'arrow': 
      imageSource = require('../assets/arrow.png');
      style = styles.arrow;
      break;
    case 'cannonball': 
      imageSource = require('../assets/cannonball.png');
      style = styles.cannonball;
      break;
    case 'magic': 
      imageSource = require('../assets/lightning.png');
      style = styles.magic;
      break;
    default: 
      imageSource = require('../assets/arrow.png'); // Fallback image
      style = styles.defaultBullet;
  }
  
  return (
    <Image
      source={imageSource}
      style={[style, { left: position.x, top: position.y }]}
    />
  );
};

const styles = StyleSheet.create({
  defaultBullet: { 
    position: 'absolute', 
    width: 20, 
    height: 20, 
    resizeMode: 'contain',
    zIndex: 200 
  },
  arrow: { 
    position: 'absolute', 
    width: 26, 
    height: 40, 
    resizeMode: 'contain',
    zIndex: 200 
  },
  cannonball: { 
    position: 'absolute', 
    width: 26, 
    height: 26, 
    resizeMode: 'contain',
    zIndex: 200 
  },
  magic: { 
    position: 'absolute', 
    width: 36, 
    height: 36, 
    resizeMode: 'contain',
    zIndex: 200 
  },
});

export default Bullet;
