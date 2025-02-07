import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Vertical path: mobs travel from top center to bottom center.
export const enemyPaths = [
  [
    { x: width / 2, y: height },
    { x: width / 2, y: 0 },
  ],
];
