import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import cloneDeep from 'lodash/cloneDeep';

import EnemySpawner from '../systems/EnemySpawner';
import { levelConfigs } from '../components/Levels'; // External levels file
import GameLoop from '../systems/GameLoop';
import Tower from '../components/Tower';
import DraggableTower from '../components/DraggableTower';
import Obstacle from '../components/Obstacle';
import fireImage from '../assets/fire.png';
import roadImage from '../assets/road.png';

// ----- UPDATED TOWER STATISTICS -----
// Three tower types: archer, mage, and cannon.
const towerStats = {
  archer: { attackRange: 200, fireRate: 300, damage: 1 },
  mage:   { attackRange: 250, fireRate: 600, damage: 2 },
  cannon: { attackRange: 180, fireRate: 1000, damage: 3 },
};

// Set the available towers explicitly.
const availableTowers = ['archer', 'mage', 'cannon'];

// Provide fallback colors in case an image is missing.
const towerFallbackColors = {
  archer: '#FFD700', // gold
  mage:   '#8A2BE2', // blueviolet
  cannon: '#000000', // black
};

const GameScreen = ({ navigation }) => {
  // entities holds towers, mobs, bullets, obstacles, etc.
  const [entities, setEntities] = useState({});
  const [selectedTowers] = useState(availableTowers);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  // Clone the current level configuration so that mob counts can be decremented.
  const [levelConfigState, setLevelConfigState] = useState(cloneDeep(levelConfigs[1]));
  // When all mobs are defeated, mark the level as cleared.
  const [levelCompleted, setLevelCompleted] = useState(false);

  const gameEngine = useRef(null);
  const gameAreaRef = useRef(null);

  // ----- OBSTACLE SETUP -----
  // Add three obstacles at random positions on mount.
  useEffect(() => {
    setEntities(prev => {
      let newEntities = { ...prev };
      for (let i = 1; i <= 3; i++) {
        const x = Math.floor(Math.random() * (350 - 50 + 1)) + 50; // x between 50 and 350
        const y = Math.floor(Math.random() * (500 - 100 + 1)) + 100; // y between 100 and 500
        newEntities[`obstacle${i}`] = {
          id: `obstacle${i}`,
          type: 'obstacle',
          position: { x, y },
          renderer: Obstacle,
        };
      }
      return newEntities;
    });
  }, []);

  // ----- TOWER DROP HANDLER -----
  const handleTowerDrop = (towerType, dropPosition) => {
    if (!dropPosition || dropPosition.x == null || dropPosition.y == null) {
      console.error("Invalid drop position:", dropPosition);
      return;
    }
    // Count towers already placed.
    const towerCount = Object.keys(entities).filter(key => entities[key].type === 'tower').length;
    if (towerCount >= 3) {
      Alert.alert("Maximum Towers", "You can only place 3 towers per level.");
      return;
    }
    if (!gameAreaRef.current) {
      console.error("Game area ref not available");
      return;
    }
    gameAreaRef.current.measureInWindow((areaX, areaY) => {
      const adjustedDropPosition = {
        x: dropPosition.x - areaX,
        y: dropPosition.y - areaY,
      };
      // Generate a unique id.
      const newTowerId = 'tower' + Date.now() + Math.random().toString(36).substring(2);
      const stats = towerStats[towerType] || { attackRange: 180, fireRate: 500, damage: 1 };
      const newTower = {
        id: newTowerId,
        type: 'tower',
        position: { ...adjustedDropPosition },
        attackRange: stats.attackRange,
        damage: stats.damage,
        fireRate: stats.fireRate,
        timeSinceLastShot: 0,
        towerType: towerType,
        color: towerFallbackColors[towerType] || 'gray',
        renderer: Tower,  // Pass the Tower component (GameEngine injects entity props)
      };
      setEntities(prevEntities => {
        const updated = { ...prevEntities, [newTowerId]: newTower };
        if (gameEngine.current) {
          gameEngine.current.swap(updated);
        }
        return updated;
      });
      if (!gameStarted) {
        setGameStarted(true);
      }
    });
  };

  // ----- SYSTEMS WRAPPER -----
  const enemySpawnerSystem = (entities, args) => {
    return EnemySpawner(entities, { ...args, levelConfig: levelConfigState });
  };

  // ----- LEVEL COMPLETION CHECK -----
  useEffect(() => {
    // Calculate total remaining mobs in the level configuration.
    const totalRemaining = levelConfigState.mobs.reduce((acc, mob) => acc + mob.count, 0);
    const mobEntities = Object.keys(entities).filter(key => entities[key].type === 'mob');
    if (gameStarted && totalRemaining === 0 && mobEntities.length === 0 && !levelCompleted) {
      setLevelCompleted(true);
    }
  }, [entities, gameStarted, levelConfigState, levelCompleted]);

  // ----- NEXT LEVEL HANDLER -----
  const startNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel > 10) {
      navigation.navigate('MainMenu');
      return;
    }
    setCurrentLevel(nextLevel);
    EnemySpawner.reset(); // Reset spawner counters
    setLevelConfigState(cloneDeep(levelConfigs[nextLevel]));
    setLevelCompleted(false);
    // Remove mob entities but keep towers and obstacles.
    setEntities(prevEntities => {
      const newEntities = { ...prevEntities };
      Object.keys(newEntities).forEach(key => {
        if (newEntities[key].type === 'mob') delete newEntities[key];
      });
      if (gameEngine.current) {
        gameEngine.current.swap(newEntities);
      }
      return newEntities;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Level Indicator */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.levelIndicator}>
          <Text style={styles.levelIndicatorText}>Level {currentLevel}</Text>
        </View>
      </View>
      {/* Road Background */}
      <Image source={roadImage} style={styles.road} />
      {/* Game Area */}
      <View ref={gameAreaRef} style={styles.gameArea}>
        {gameStarted && (
          <GameEngine
            ref={gameEngine}
            systems={[enemySpawnerSystem, GameLoop]}
            entities={entities}
            style={styles.gameEngine}
          />
        )}
        <Image source={fireImage} style={styles.fire} />
        {levelCompleted && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              Level {currentLevel} Cleared! Tap to start Level {currentLevel + 1}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={startNextLevel}>
              <Text style={styles.nextButtonText}>Next Level</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Tower Deck */}
      <View style={styles.deckContainer}>
        <Text style={styles.deckTitle}>Deck</Text>
        <View style={styles.towerRow}>
          {selectedTowers.map((towerType, index) => (
            <DraggableTower
              key={index}
              towerType={towerType}
              onDrop={(pos) => handleTowerDrop(towerType, pos)}
              initialPosition={{ x: 10 + index * 60, y: 0 }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  backButton: { padding: 5 },
  backButtonText: { color: '#fff', fontSize: 18 },
  levelIndicator: {},
  levelIndicatorText: { color: '#fff', fontSize: 16 },
  road: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: 50,
  },
  gameArea: { flex: 3, backgroundColor: 'transparent', position: 'relative', zIndex: 100 },
  gameEngine: { flex: 1 },
  fire: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 60,
    height: 60,
    transform: [{ translateX: -30 }],
    zIndex: 150,
  },
  overlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    zIndex: 300,
  },
  overlayText: { color: '#fff', fontSize: 24, marginBottom: 20 },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  nextButtonText: { color: '#fff', fontSize: 18 },
  deckContainer: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 400,
  },
  deckTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  // Updated towerRow style to allow space for 3 towers
  towerRow: {
    flexDirection: 'row',
    justifyContent: 'start', // or try "space-evenly"
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
});


export default GameScreen;
