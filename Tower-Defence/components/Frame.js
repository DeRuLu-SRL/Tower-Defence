import React, { useEffect, useState } from "react";
import { Image } from "react-native";

const Frame = ({ frames, frameDuration = 100, style }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    // Cycle through frames at a fixed interval
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % frames.length);
    }, frameDuration);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [frames, frameDuration]);

  return (
    <Image
      source={frames[currentFrame]}
      style={style}
      resizeMode="contain"
    />
  );
};

export default Frame;
