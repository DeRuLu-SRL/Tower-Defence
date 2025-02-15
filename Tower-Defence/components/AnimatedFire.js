import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

const AnimatedFire = ({
  spriteSheet,
  frameWidth,
  frameHeight,
  frameCount,
  frameDuration,
  isPlaying,
  style,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const currentFrame = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;

    // Step frames in a loop:
    const interval = setInterval(() => {
      currentFrame.current = (currentFrame.current + 1) % frameCount;
      Animated.timing(translateX, {
        toValue: -frameWidth * currentFrame.current,
        duration: 0, // Jump instantly to the next frame
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    }, frameDuration);

    return () => clearInterval(interval);
  }, [isPlaying, frameCount, frameWidth, frameDuration]);

  return (
    <View style={[style, { width: frameWidth, height: frameHeight, overflow: "hidden" }]}>
      <Animated.Image
        source={spriteSheet}
        style={{
          width: frameWidth * frameCount,
          height: frameHeight,
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

export default AnimatedFire;
