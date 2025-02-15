import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import objectMap from "../src/maps/objectMap";
import objectImages from "../src/maps/objects";
import useGroundDimensions from "../components/useGroundDimensions";
import AnimatedFire from "../components/AnimatedFire";
import Frame from "../components/Frame";

const ObjectMap = ({ mapObjects, onTowerPlacePress }) => {
  const { tileWidth, tileHeight } = useGroundDimensions();

  const smallObjects = ["TE1", "TE3", "TE4", "P1", "P2"];
  const evenSmallerObjects = ["G1", "G4", "G5", "G6", "ST1", "ST6", "S1","FLO1", "FLO2","FLO7"];
  const mediumObjects = ["S3", "D1", "D2", "T55", "T34", "BU8", "BU10"];
  const sizeObjects = ["D3", "D6"];
  const betweenObjects = [
    "D13", "T43", "T33", "T30", "T49", "T50", 
    "T25", "T63", "T51", "T56", "T4", "T2", "T39", "T47", "T1",
    "T2", "T3", "T4", "T46", "T6", "T10", "T11",
    "T12", "T31", "T32", "T36", "T37", "T52", "T20",
    "T24", "C1", "C2", "C3", "C4", "BU7", "FI1", "FI2"
  ];
  const stalp = ["D9", "BU12","F7"];
  const butoi = ["B1", "C5", "C6"];
  const bush = ["BU1", "BU2", "BU3", "BU4", "BU9", "BU11","F1","F3"];
  const fire = ["FI1", "FI2","F8"];

  // Flower frames array
  const flowerFrames1 = [
    require("../assets/objects/Flower/1.png"),
    require("../assets/objects/Flower/2.png"),
    require("../assets/objects/Flower/3.png"),
    require("../assets/objects/Flower/4.png"),
    require("../assets/objects/Flower/5.png"),
    require("../assets/objects/Flower/6.png"),
  ];

  const flowerFrames2 = [
    require("../assets/objects/Flower/7.png"),
    require("../assets/objects/Flower/8.png"),
    require("../assets/objects/Flower/9.png"),
    require("../assets/objects/Flower/10.png"),
    require("../assets/objects/Flower/11.png"),
    require("../assets/objects/Flower/12.png"),
  ];

  return (
    <View style={styles.container}>
      {mapObjects.map(({ id, x, y }) => {
        if (!objectImages[id]) {
          console.warn(`❌ Warning: Object ID '${id}' is missing in objects.js`);
          return null;
        }

        let width = tileWidth;
        let height = tileHeight;

        if (smallObjects.includes(id)) {
          width *= 0.6;
          height *= 0.6;
        } else if (evenSmallerObjects.includes(id)) {
          width *= 0.1;
          height *= 0.1;
        } else if (mediumObjects.includes(id)) {
          width *= 0.25;
          height *= 0.3;
        } else if (sizeObjects.includes(id)) {
          width *= 0.15;
          height *= 0.15;
        } else if (betweenObjects.includes(id)) {
          width *= 0.45;
          height *= 0.45;
        } else if (stalp.includes(id)) {
          width *= 0.12;
          height *= 0.45;
        } else if (butoi.includes(id)) {
          width *= 0.2;
          height *= 0.2;
        } else if (bush.includes(id)) {
          width *= 0.3;
          height *= 0.23;
        } else if (fire.includes(id)) {
          width *= 0.3;
          height *= 0.4;
        }

        // 🔥 Example: Fire animations
        if (id === "FI2") {
          return (
            <AnimatedFire
              key={`${id}-${x}-${y}`}
              spriteSheet={require("../assets/objects/Campfire/2.png")}
              frameWidth={32}
              frameHeight={32}
              frameCount={6}
              frameDuration={100}
              isPlaying={true}
              style={{
                position: "absolute",
                left: x * tileWidth,
                top: y * tileHeight,
                width,
                height,
                zIndex: 5,
                elevation: 5,
              }}
            />
          );
        }

        if (id === "FI1") {
          return (
            <AnimatedFire
              key={`${id}-${x}-${y}`}
              spriteSheet={require("../assets/objects/Campfire/1.png")}
              frameWidth={32}
              frameHeight={64}
              frameCount={6}
              frameDuration={100}
              isPlaying={true}
              style={{
                position: "absolute",
                left: x * tileWidth,
                top: y * tileHeight,
                width,
                height,
                zIndex: 5,
                elevation: 5,
              }}
            />
          );
        }

        // 🏳 Example: Flag animations
        if (id === "FL1") {
          return (
            <AnimatedFire
              key={`${id}-${x}-${y}`}
              spriteSheet={require("../assets/objects/Flag/1.png")}
              frameWidth={32}
              frameHeight={64}
              frameCount={6}
              frameDuration={100}
              isPlaying={true}
              style={{
                position: "absolute",
                left: x * tileWidth,
                top: y * tileHeight,
                width,
                height,
                zIndex: 5,
                elevation: 5,
              }}
            />
          );
        }
        if (id === "FL2") {
          return (
            <AnimatedFire
              key={`${id}-${x}-${y}`}
              spriteSheet={require("../assets/objects/Flag/2.png")}
              frameWidth={32}
              frameHeight={64}
              frameCount={6}
              frameDuration={100}
              isPlaying={true}
              style={{
                position: "absolute",
                left: x * tileWidth,
                top: y * tileHeight,
                width,
                height,
                zIndex: 5,
                elevation: 5,
              }}
            />
          );
        }

        // 🌸 Example: Flower multi-image frames
        if (id === "FLO1" || id === "FLO2") {
          return (
            <Frame
              key={`${id}-${x}-${y}`}
              frames={flowerFrames1}
              frameDuration={200} // 200ms per frame
              style={{
                position: "absolute",
                left: x * tileWidth,
                top: y * tileHeight,
                width,
                height,
                zIndex: 5,
                elevation: 5,
              }}
            />
          );
        }
        if (id === "FLO7" || id === "FLO8") {
          return (
            <Frame
              key={`${id}-${x}-${y}`}
              frames={flowerFrames2}
              frameDuration={200} // 200ms per frame
              style={{
                position: "absolute",
                left: x * tileWidth,
                top: y * tileHeight,
                width,
                height,
                zIndex: 5,
                elevation: 5,
              }}
            />
          );
        }
        if (id === "P7" || id === "P8") {
          return (
            <TouchableOpacity
              key={`${id}-${x}-${y}`}
              onPress={() => onTowerPlacePress(id, x, y)}
              style={{
                position: "absolute",
                left: x * tileWidth,
                top: y * tileHeight,
                width,
                height,
                zIndex: 5,
              }}
            >
              <Image
                source={objectImages[id]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        }

        // 🖼 Render normal static objects
        return (
          <Image
            key={`${id}-${x}-${y}`}
            source={objectImages[id]}
            style={{
              position: "absolute",
              left: x * tileWidth,
              top: y * tileHeight,
              width,
              height,
              zIndex: 5,
              elevation: 5,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 5,
    elevation: 5,
  },
});

export default ObjectMap;
