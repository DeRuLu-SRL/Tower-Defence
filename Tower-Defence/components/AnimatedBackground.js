import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Define tile size and grid dimensions
const tileSize = 32;
const mapWidth = 20;
const mapHeight = 10;

// Define a fixed map layout using tile images
const tileImages = [
  ...[
    require('../assets/tiles/FieldsTile_01.png'),
    require('../assets/tiles/FieldsTile_02.png'),
    require('../assets/tiles/FieldsTile_03.png'),
    require('../assets/tiles/FieldsTile_04.png'),
    require('../assets/tiles/FieldsTile_05.png'),
    require('../assets/tiles/FieldsTile_06.png'),
    require('../assets/tiles/FieldsTile_07.png'),
    require('../assets/tiles/FieldsTile_08.png'),
    require('../assets/tiles/FieldsTile_09.png'),
    require('../assets/tiles/FieldsTile_10.png'),
    require('../assets/tiles/FieldsTile_11.png'),
    require('../assets/tiles/FieldsTile_12.png'),
    require('../assets/tiles/FieldsTile_13.png'),
    require('../assets/tiles/FieldsTile_14.png'),
    require('../assets/tiles/FieldsTile_15.png'),
    require('../assets/tiles/FieldsTile_16.png'),
    require('../assets/tiles/FieldsTile_17.png'),
    require('../assets/tiles/FieldsTile_18.png'),
    require('../assets/tiles/FieldsTile_19.png'),
    require('../assets/tiles/FieldsTile_20.png'),
    require('../assets/tiles/FieldsTile_21.png'),
    require('../assets/tiles/FieldsTile_22.png'),
    require('../assets/tiles/FieldsTile_23.png'),
    require('../assets/tiles/FieldsTile_24.png'),
    require('../assets/tiles/FieldsTile_25.png'),
    require('../assets/tiles/FieldsTile_26.png'),
    require('../assets/tiles/FieldsTile_27.png'),
    require('../assets/tiles/FieldsTile_28.png'),
    require('../assets/tiles/FieldsTile_29.png'),
    require('../assets/tiles/FieldsTile_30.png'),
    require('../assets/tiles/FieldsTile_31.png'),
    require('../assets/tiles/FieldsTile_32.png'),
  ],
  ...[
    require('../assets/tiles/Tile2_01.png'),
    require('../assets/tiles/Tile2_02.png'),
    require('../assets/tiles/Tile2_03.png'),
    require('../assets/tiles/Tile2_04.png'),
    require('../assets/tiles/Tile2_05.png'),
    require('../assets/tiles/Tile2_06.png'),
    require('../assets/tiles/Tile2_07.png'),
    require('../assets/tiles/Tile2_08.png'),
    require('../assets/tiles/Tile2_09.png'),
    require('../assets/tiles/Tile2_10.png'),
    require('../assets/tiles/Tile2_11.png'),
    require('../assets/tiles/Tile2_12.png'),
    require('../assets/tiles/Tile2_13.png'),
    require('../assets/tiles/Tile2_14.png'),
    require('../assets/tiles/Tile2_15.png'),
    require('../assets/tiles/Tile2_16.png'),
    require('../assets/tiles/Tile2_17.png'),
    require('../assets/tiles/Tile2_18.png'),
    require('../assets/tiles/Tile2_19.png'),
    require('../assets/tiles/Tile2_20.png'),
    require('../assets/tiles/Tile2_21.png'),
    require('../assets/tiles/Tile2_22.png'),
    require('../assets/tiles/Tile2_23.png'),
    require('../assets/tiles/Tile2_24.png'),
    require('../assets/tiles/Tile2_25.png'),
    require('../assets/tiles/Tile2_26.png'),
    require('../assets/tiles/Tile2_27.png'),
    require('../assets/tiles/Tile2_28.png'),
    require('../assets/tiles/Tile2_29.png'),
    require('../assets/tiles/Tile2_30.png'),
    require('../assets/tiles/Tile2_31.png'),
    require('../assets/tiles/Tile2_32.png'),
  ],
];

// **Grid-based tile layout**
const tileMap = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // Row 1
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], // Row 2
  [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], // Row 3
  [3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2], // Row 4
  [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3], // Row 5
  [5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4], // Row 6
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5], // Row 7
  [7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6], // Row 8
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7], // Row 9
  [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8], // Row 10
];

const AnimatedBackground = () => {
  return (
    <View style={styles.container}>
      {tileMap.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((tileIndex, colIndex) => (
            <Image
              key={`${rowIndex}-${colIndex}`}
              source={tileImages[tileIndex]}
              style={styles.tile}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: tileSize,
    height: tileSize,
  },
});

export default AnimatedBackground;
