import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  InteractionManager,
  ScrollView,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cloneDeep from 'lodash/cloneDeep';

import EnemySpawner from '../systems/EnemySpawner';
import LevelCompletionSystem from '../systems/LevelCompletionSystem';
import { levelConfigs } from '../components/Levels';
import GameLoop from '../systems/GameLoop';
import Tower from '../components/Tower';
import DraggableTower from '../components/DraggableTower';
import ObjectMap from '../components/ObjectMap';
import AnimatedBackground from '../components/AnimatedBackground';

const towerStats = {
  archer: { attackRange: 200, fireRate: 300, damage: 1 },
  mage: { attackRange: 250, fireRate: 600, damage: 2 },
  cannon: { attackRange: 180, fireRate: 1000, damage: 3 },
};

const availableTowers = ['archer', 'mage', 'cannon'];
const towerFallbackColors = {
  archer: '#FFD700',
  mage: '#8A2BE2',
  cannon: '#000000',
};

const GameScreen = ({ navigation, route }) => {
  // Try to lock orientation to landscape on mount.
  useEffect(() => {
    try {
      if (Orientation && Orientation.lockToLandscape) {
        Orientation.lockToLandscape();
      }
    } catch (e) {
      console.warn("Orientation module not available: ", e);
    }
    return () => {
      try {
        if (Orientation && Orientation.unlockAllOrientations) {
          Orientation.unlockAllOrientations();
        }
      } catch (e) {
        console.warn("Orientation module not available: ", e);
      }
    };
  }, []);

  const initialLevel = route.params?.level || 1;
  const [entities, setEntities] = useState({});
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [levelCleared, setLevelCleared] = useState(false);
  const [gold, setGold] = useState(0);
  const [towerCount, setTowerCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelConfigState, setLevelConfigState] = useState(cloneDeep(levelConfigs[initialLevel]));

  const goldRef = useRef(gold);
  const towerCountRef = useRef(towerCount);
  useEffect(() => { goldRef.current = gold; }, [gold]);
  useEffect(() => { towerCountRef.current = towerCount; }, [towerCount]);

  const gameEngine = useRef(null);
  const gameAreaRef = useRef(null);

  const handleEvent = useCallback((e) => {
    InteractionManager.runAfterInteractions(() => {
      if (e.type === 'MOB_KILLED') {
        let reward = 0;
        switch (e.mobType) {
          case 'red': reward = 3; break;
          case 'yellow': reward = 5; break;
          case 'green': reward = 8; break;
          case 'blue': reward = 12; break;
          case 'purple': reward = 20; break;
          default: reward = 3;
        }
        setGold(prev => {
          const newGold = prev + reward;
          goldRef.current = newGold;
          return newGold;
        });
      } else if (e.type === 'LEVEL_CLEARED') {
        setTimeout(() => setLevelCleared(true), 0);
      }
    });
  }, []);

  useEffect(() => {
    if (levelCleared) {
      (async () => {
        await markLevelAsCompleted(currentLevel);
      })();
    }
  }, [levelCleared, currentLevel]);

  const handleTowerDrop = (towerType, dropPosition) => {
    if (!dropPosition || dropPosition.x == null || dropPosition.y == null) {
      console.error("Invalid drop position:", dropPosition);
      return;
    }
    setTimeout(() => {
      if (towerCountRef.current >= 3) {
        Alert.alert("Maximum Towers", "You can only place 3 towers per level.");
        return;
      }
      if (towerCountRef.current > 0 && goldRef.current < 10) {
        Alert.alert("Not Enough Gold", "You need at least 10 gold to place another tower.");
        return;
      }
      if (towerCountRef.current > 0) {
        const newGold = goldRef.current - 10;
        setGold(newGold);
        goldRef.current = newGold;
      }
      const newTowerCount = towerCountRef.current + 1;
      setTowerCount(newTowerCount);
      towerCountRef.current = newTowerCount;
      if (!gameAreaRef.current) return;
      // Wrap the measureInWindow call in requestAnimationFrame to ensure that
      // the state update happens after the current render completes.
      requestAnimationFrame(() => {
        gameAreaRef.current.measureInWindow((areaX, areaY) => {
          const adjustedDropPosition = {
            x: dropPosition.x - areaX,
            y: dropPosition.y - areaY,
          };
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
            renderer: Tower,
          };
          setEntities(prev => {
            const updated = { ...prev, [newTowerId]: newTower };
            if (gameEngine.current) gameEngine.current.swap(updated);
            return updated;
          });
        });
      });
    }, 0);
  };

  const enemySpawnerSystem = (entities, args) => {
    return EnemySpawner(entities, { ...args, currentLevel });
  };

  const levelCompletionSystem = (entities, args) => {
    return LevelCompletionSystem(entities, args);
  };

  const markLevelAsCompleted = async (level) => {
    try {
      const completedLevels = JSON.parse(await AsyncStorage.getItem('completedLevels')) || [];
      if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        await AsyncStorage.setItem('completedLevels', JSON.stringify(completedLevels));
      }
      console.log(`✔ Level ${level} marked as completed`);
    } catch (error) {
      console.error("❌ Error saving completed level:", error);
    }
  };

  const startNextLevel = async () => {
    if (!levelCleared) return;
    const nextLevel = currentLevel + 1;
    if (nextLevel > 10) {
      navigation.navigate('MainMenu');
      return;
    }
    try {
      const savedLevels = await AsyncStorage.getItem('unlockedLevels');
      const highestUnlocked = savedLevels ? parseInt(savedLevels, 10) : 1;
      if (nextLevel > highestUnlocked) {
        await AsyncStorage.setItem('unlockedLevels', nextLevel.toString());
      }
      setGameStarted(false);
      setLevelCleared(false);
      setCurrentLevel(nextLevel);
      setLevelConfigState(cloneDeep(levelConfigs[nextLevel]));
      setEntities({});
      setTowerCount(0);
      setGold(0);
  
      if (EnemySpawner.reset) {
        EnemySpawner.reset();
      }
      gameEngine.current?.swap({});
      console.log(`🚀 Starting Level ${nextLevel}`);
    } catch (error) {
      console.error("❌ Error starting next level:", error);
    }
  };

  // Calculate full grid size for the zoomable content.
  const totalWidth = 20 * (64 + 10); // 20 columns
  const totalHeight = 6 * (64 + 10);   // 6 rows

  return (
    <View style={styles.container}>
      {/* Horizontal, zoomable game area */}
      <ScrollView
        style={styles.zoomContainer}
        contentContainerStyle={[styles.zoomContent, { width: totalWidth, height: totalHeight }]}
        horizontal={true}
        maximumZoomScale={3}
        minimumZoomScale={0.5}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View ref={gameAreaRef} style={styles.gameArea}>
          <AnimatedBackground />
          <ObjectMap />
          <GameEngine
            ref={gameEngine}
            systems={[enemySpawnerSystem, GameLoop, levelCompletionSystem]}
            entities={entities}
            onEvent={handleEvent}
            style={styles.gameEngine}
          />
          {levelCleared && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>
                Level {currentLevel} Cleared! Start Level {currentLevel + 1}
              </Text>
              <TouchableOpacity style={styles.nextButton} onPress={startNextLevel}>
                <Text style={styles.nextButtonText}>Next Level</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Deck */}
      <View style={styles.deckContainer}>
        <Text style={styles.deckTitle}>Deck</Text>
        <View style={styles.towerRow}>
          {availableTowers.map((towerType, index) => (
            <DraggableTower
              key={index}
              towerType={towerType}
              onDrop={(pos) => handleTowerDrop(towerType, pos)}
              initialPosition={{ x: 10 + index * 60, y: 0 }}
            />
          ))}
        </View>
      </View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.levelIndicatorText}>Level {currentLevel}</Text>
          <Text style={styles.goldText}>Gold: {gold}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e' },
  zoomContainer: {
    flex: 1,
  },
  zoomContent: {
    // Dimensions are provided by the calculated totalWidth and totalHeight.
  },
  gameArea: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  gameEngine: { flex: 1 },
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
  towerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  backButton: { padding: 5 },
  backButtonText: { color: '#fff', fontSize: 18 },
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  levelIndicatorText: { color: '#fff', fontSize: 16, marginRight: 10 },
  goldText: { color: '#FFD700', fontSize: 16 },
});

export default GameScreen;
