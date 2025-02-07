// components/Obstacle.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Obstacle = ({ position }) => {
  return (
    <Image
      source={require('../assets/wall.png')}
      style={[styles.obstacle, { left: position.x, top: position.y }]}
    />
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
});

export default Obstacle;
