import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const ZoomableView = ({ children, groundWidth, groundHeight, screenWidth, screenHeight }) => {
  // ✅ Set min/max zoom levels
  const MIN_ZOOM = Math.max(screenWidth / groundWidth, screenHeight / groundHeight);
  const MAX_ZOOM = 3;
  const scale = useSharedValue(MIN_ZOOM);

  useEffect(() => {
    scale.value = withSpring(MIN_ZOOM * 1, { damping: 200, stiffness: 30 }); // ✅ Start slightly zoomed out
  }, []);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // ✅ Pinch-to-Zoom Gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale.value * event.scale));
    })
    .onEnd(() => {
      scale.value = withSpring(scale.value, { damping: 200, stiffness: 30 });
    });

  // ✅ Scroll (Pan) Gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > MIN_ZOOM) {
        translateX.value += event.translationX / scale.value;
        translateY.value += event.translationY / scale.value;
      }
    })
    .onEnd(() => {
      // ✅ Keep scrolling inside the ground
      const maxX = (groundWidth * scale.value - screenWidth) / 2;
      const maxY = (groundHeight * scale.value - screenHeight) / 2;

      translateX.value = withSpring(Math.max(-maxX, Math.min(maxX, translateX.value)), { damping: 200 });
      translateY.value = withSpring(Math.max(-maxY, Math.min(maxY, translateY.value)), { damping: 200 });
    });

  // ✅ Combine Gestures
  const gestures = Gesture.Simultaneous(pinchGesture, panGesture);

  // ✅ Apply Animated Transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ZoomableView;
