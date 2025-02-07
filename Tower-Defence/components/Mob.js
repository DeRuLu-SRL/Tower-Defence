// components/Mob.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Mob = ({ position, mobType }) => {
  let imageSource;
  switch (mobType) {
    case 'red':
      imageSource = require('../assets/red_mob.png');
      break;
    case 'yellow':
      imageSource = require('../assets/yellow_mob.png');
      break;
    case 'green':
      imageSource = require('../assets/green_mob.png');
      break;
    case 'blue':
      imageSource = require('../assets/blue_mob.png');
      break;
    case 'purple':
      imageSource = require('../assets/purple_mob.png');
      break;
    default:
      imageSource = require('../assets/red_mob.png');
  }
  return (
    <Image
      source={imageSource}
      style={[styles.mob, { left: position.x - 20, top: position.y - 20 }]}
    />
  );
};

const styles = StyleSheet.create({
  mob: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Mob;
