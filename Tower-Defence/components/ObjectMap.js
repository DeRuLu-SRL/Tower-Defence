import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

// Import your object sprites
import shadow1 from '../assets/objects/1 Shadow/1.png';
import shadow2 from '../assets/objects/1 Shadow/2.png';
import shadow3 from '../assets/objects/1 Shadow/3.png';
import shadow4 from '../assets/objects/1 Shadow/4.png';
import shadow5 from '../assets/objects/1 Shadow/5.png';
import shadow6 from '../assets/objects/1 Shadow/6.png';

import stone1 from '../assets/objects/2 Stone/1.png';
import stone2 from '../assets/objects/2 Stone/2.png';
import stone3 from '../assets/objects/2 Stone/3.png';
import stone4 from '../assets/objects/2 Stone/4.png';
import stone5 from '../assets/objects/2 Stone/5.png';
import stone6 from '../assets/objects/2 Stone/6.png';

import decor1 from '../assets/objects/3 Decor/1.png';
import decor2 from '../assets/objects/3 Decor/2.png';
import decor3 from '../assets/objects/3 Decor/3.png';
import decor4 from '../assets/objects/3 Decor/4.png';
import decor5 from '../assets/objects/3 Decor/5.png';
import decor6 from '../assets/objects/3 Decor/6.png';
import decor7 from '../assets/objects/3 Decor/7.png';
import decor8 from '../assets/objects/3 Decor/8.png';
import decor9 from '../assets/objects/3 Decor/9.png';
import decor10 from '../assets/objects/3 Decor/10.png';
import decor11 from '../assets/objects/3 Decor/11.png';
import decor12 from '../assets/objects/3 Decor/12.png';
import decor13 from '../assets/objects/3 Decor/13.png';
import decor14 from '../assets/objects/3 Decor/14.png';
import decor15 from '../assets/objects/3 Decor/15.png';
import decor16 from '../assets/objects/3 Decor/16.png';
import decor17 from '../assets/objects/3 Decor/17.png';

import box1 from '../assets/objects/4 Box/1.png';
import box2 from '../assets/objects/4 Box/2.png';
import box3 from '../assets/objects/4 Box/3.png';
import box4 from '../assets/objects/4 Box/4.png';
import box5 from '../assets/objects/4 Box/5.png';

import grass1 from '../assets/objects/5 Grass/1.png';
import grass2 from '../assets/objects/5 Grass/2.png';
import grass3 from '../assets/objects/5 Grass/3.png';
import grass4 from '../assets/objects/5 Grass/4.png';
import grass5 from '../assets/objects/5 Grass/5.png';
import grass6 from '../assets/objects/5 Grass/6.png';

import tent1 from '../assets/objects/6 Tent/1.png';
import tent2 from '../assets/objects/6 Tent/2.png';
import tent3 from '../assets/objects/6 Tent/3.png';
import tent4 from '../assets/objects/6 Tent/4.png';

import house1 from '../assets/objects/7 House/1.png';
import house2 from '../assets/objects/7 House/2.png';
import house3 from '../assets/objects/7 House/3.png';
import house4 from '../assets/objects/7 House/4.png';

import door1 from '../assets/objects/Door1.png';
import door2 from '../assets/objects/Door2.png';
import doubledoor1 from '../assets/objects/DoubleDoor1.png';
import doubledoor2 from '../assets/objects/DoubleDoor2.png';

import placeForTower1 from '../assets/objects/PlaceForTower1.png';

const { width, height } = Dimensions.get('window');

// The objects array now includes all of the imported images with sample positions.
// Adjust the multipliers as needed for your layout.
const objects = [
  // Shadows
  { image: shadow1, x: width * 0.05, y: height * 0.05 },
  { image: shadow2, x: width * 0.15, y: height * 0.05 },
  { image: shadow3, x: width * 0.25, y: height * 0.05 },
  { image: shadow4, x: width * 0.35, y: height * 0.05 },
  { image: shadow5, x: width * 0.45, y: height * 0.05 },
  { image: shadow6, x: width * 0.55, y: height * 0.05 },

  // Stones
  { image: stone1, x: width * 0.05, y: height * 0.20 },
  { image: stone2, x: width * 0.15, y: height * 0.20 },
  { image: stone3, x: width * 0.25, y: height * 0.20 },
  { image: stone4, x: width * 0.35, y: height * 0.20 },
  { image: stone5, x: width * 0.45, y: height * 0.20 },
  { image: stone6, x: width * 0.55, y: height * 0.20 },

  // Decors (first row)
  { image: decor1, x: width * 0.05, y: height * 0.35 },
  { image: decor2, x: width * 0.15, y: height * 0.35 },
  { image: decor3, x: width * 0.25, y: height * 0.35 },
  { image: decor4, x: width * 0.35, y: height * 0.35 },
  { image: decor5, x: width * 0.45, y: height * 0.35 },
  { image: decor6, x: width * 0.55, y: height * 0.35 },
  { image: decor7, x: width * 0.65, y: height * 0.35 },
  { image: decor8, x: width * 0.75, y: height * 0.35 },
  { image: decor9, x: width * 0.85, y: height * 0.35 },
  
  // Decors (second row)
  { image: decor10, x: width * 0.05, y: height * 0.45 },
  { image: decor11, x: width * 0.15, y: height * 0.45 },
  { image: decor12, x: width * 0.25, y: height * 0.45 },
  { image: decor13, x: width * 0.35, y: height * 0.45 },
  { image: decor14, x: width * 0.45, y: height * 0.45 },
  { image: decor15, x: width * 0.55, y: height * 0.45 },
  { image: decor16, x: width * 0.65, y: height * 0.45 },
  { image: decor17, x: width * 0.75, y: height * 0.45 },

  // Boxes
  { image: box1, x: width * 0.05, y: height * 0.55 },
  { image: box2, x: width * 0.15, y: height * 0.55 },
  { image: box3, x: width * 0.25, y: height * 0.55 },
  { image: box4, x: width * 0.35, y: height * 0.55 },
  { image: box5, x: width * 0.45, y: height * 0.55 },

  // Grasses
  { image: grass1, x: width * 0.05, y: height * 0.65 },
  { image: grass2, x: width * 0.15, y: height * 0.65 },
  { image: grass3, x: width * 0.25, y: height * 0.65 },
  { image: grass4, x: width * 0.35, y: height * 0.65 },
  { image: grass5, x: width * 0.45, y: height * 0.65 },
  { image: grass6, x: width * 0.55, y: height * 0.65 },

  // Tents
  { image: tent1, x: width * 0.05, y: height * 0.75 },
  { image: tent2, x: width * 0.15, y: height * 0.75 },
  { image: tent3, x: width * 0.25, y: height * 0.75 },
  { image: tent4, x: width * 0.35, y: height * 0.75 },

  // Houses
  { image: house1, x: width * 0.05, y: height * 0.85 },
  { image: house2, x: width * 0.15, y: height * 0.85 },
  { image: house3, x: width * 0.25, y: height * 0.85 },
  { image: house4, x: width * 0.35, y: height * 0.85 },

  // Doors
  { image: door1, x: width * 0.55, y: height * 0.75 },
  { image: door2, x: width * 0.65, y: height * 0.75 },
  { image: doubledoor1, x: width * 0.75, y: height * 0.75 },
  { image: doubledoor2, x: width * 0.85, y: height * 0.75 },

  // Tower spot
  { image: placeForTower1, x: width * 0.90, y: height * 0.80 },
];

const AnimatedDoor = ({ x, y }) => {
  const doorFrames = [
    require('../assets/objects/Door1.png'),
    require('../assets/objects/Door2.png'),
  ];
  
  const [currentFrame, setCurrentFrame] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % doorFrames.length);
    }, 500); // Change frame every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <Image source={doorFrames[currentFrame]} style={[styles.object, { left: x, top: y }]} />
  );
};

const ObjectMap = () => {
  return (
    <View style={styles.container}>
      {objects.map((obj, index) =>
        obj.isAnimated ? (
          <AnimatedDoor key={index} x={obj.x} y={obj.y} />
        ) : (
          <Image key={index} source={obj.image} style={[styles.object, { left: obj.x, top: obj.y }]} />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  object: {
    position: 'absolute',
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});

export default ObjectMap;
