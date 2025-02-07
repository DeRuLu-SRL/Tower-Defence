// components/DraggableTower.js
import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet } from 'react-native';
import Tower from './Tower';

const DraggableTower = ({ towerType, onDrop, initialPosition }) => {
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        onDrop({ x: gestureState.moveX, y: gestureState.moveY });
        Animated.spring(pan, {
          toValue: initialPosition,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.icon, pan.getLayout()]} {...panResponder.panHandlers}>
      <Tower towerType={towerType} color={towerType} position={{ x: 0, y: 0 }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default DraggableTower;
