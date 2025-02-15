import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { gameMap } from "../src/maps/gameMap"; // ✅ Ensure correct import
import tiles from "../src/maps/tiles";
import useGroundDimensions from "../components/useGroundDimensions";

const AnimatedBackground = () => {
  const { groundWidth, groundHeight, tileWidth, tileHeight } = useGroundDimensions();

  console.log("gameMap:", gameMap);
  console.log("gameMap type:", typeof gameMap);
  console.log("First row:", gameMap[0]);

  const safeGameMap = Array.isArray(gameMap) ? gameMap : [[]];

  return (
    <View style={[styles.mapContainer, { width: groundWidth, height: groundHeight }]}>
      {safeGameMap.map((row, rowIndex) =>
        Array.isArray(row)
          ? row.map((tile, colIndex) => {
              const tileSource = tiles[tile] || require("../assets/tiles/FieldsTile_01.png");
              return (
                <Image
                  key={`${rowIndex}-${colIndex}`}
                  source={tileSource}
                  style={{
                    position: "absolute",
                    left: colIndex * tileWidth,
                    top: rowIndex * tileHeight,
                    width: tileWidth,
                    height: tileHeight,
                  }}
                />
              );
            })
          : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default AnimatedBackground;
