// screens/GameScreen.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cloneDeep from 'lodash/cloneDeep';
import ZoomableView from '../components/ZoomableView';

import EnemySpawner from '../systems/EnemySpawner';
import LevelCompletionSystem from '../systems/LevelCompletionSystem';
import { levelConfigs } from '../components/Levels';
import GameLoop from '../systems/GameLoop';
import Tower from '../components/Tower';
import ObjectMap from '../components/ObjectMap';
import AnimatedBackground from '../components/AnimatedBackground';
import useGroundDimensions from '../components/useGroundDimensions';
import { ScrollView } from 'react-native-gesture-handler';
import objectMap from '../src/maps/objectMap';

const TOWER_OPTIONS = [
  { type: 'archer', label: 'Archer Tower', image: require('../assets/archer_tower.png') },
  { type: 'cannon', label: 'Cannon Tower', image: require('../assets/cannon_tower.png') },
  { type: 'mage',   label: 'Mage Tower',   image: require('../assets/mage_tower.png') },
];

function TowerSelectionMenu({ visible, onClose, onSelectTower }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>Build a Tower</Text>
        {TOWER_OPTIONS.map((tower) => (
          <TouchableOpacity
            key={tower.type}
            style={styles.option}
            onPress={() => onSelectTower(tower.type)}
          >
            <Image source={tower.image} style={styles.icon} />
            <Text style={styles.label}>{tower.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const GameScreen = ({ navigation, route }) => {
  // Get the native ground dimensions (e.g., 800×800).
  const { groundWidth, groundHeight } = useGroundDimensions();
  const { tileWidth, tileHeight } = useGroundDimensions();

  // Get the window dimensions.
  const windowDimensions = Dimensions.get('window');
  const screenWidth = windowDimensions.width;
  const screenHeight = windowDimensions.height;

  // Calculate a minimum zoom scale so that the entire ground is visible initially.
  const minZoomScale = Math.min(screenWidth / groundWidth, screenHeight / groundHeight);
  const maxZoomScale = 5;

  // Game state and refs.
  const initialLevel = route.params?.level || 1;
  const [entities, setEntities] = useState({});
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [levelCleared, setLevelCleared] = useState(false);
  const [gold, setGold] = useState(0);
  const [towerCount, setTowerCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelConfigState, setLevelConfigState] = useState(cloneDeep(levelConfigs[initialLevel]));

  const [mapObjects, setMapObjects] = useState([...objectMap]);
  const [selectedPlace, setSelectedPlace] = useState(null);  // x,y + object id
  const [showTowerMenu, setShowTowerMenu] = useState(false)

  const goldRef = useRef(gold);
  const towerCountRef = useRef(towerCount);
  useEffect(() => { goldRef.current = gold; }, [gold]);
  useEffect(() => { towerCountRef.current = towerCount; }, [towerCount]);

  const gameEngine = useRef(null);
  const groundRef = useRef(null);

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
    // Implementation omitted for brevity.
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

  const handleTowerPlacePress = (objectId, x, y) => {
    // Store the selected place, show the tower menu
    setSelectedPlace({ objectId, x, y });
    setShowTowerMenu(true);
  };

  const buildTower = (towerType) => {
    if (!selectedPlace) return;
    const { x, y, objectId } = selectedPlace;
  
    // Remove tower place marker
    setMapObjects(prev => prev.filter(obj => !(obj.x === x && obj.y === y && obj.id === objectId)));
  
    // Create tower entity
    const towerId = 'tower-' + Date.now();
    setEntities(prev => {
      const newEntities = { ...prev };
  
      newEntities[towerId] = {
        id: towerId,
        type: 'tower',
        towerType: towerType,
        position: { x: x * tileWidth, y: y * tileHeight },
        damage: 3,
        attackRange: 150,
        fireRate: 1000,
        timeSinceLastShot: 0,
        renderer: (props) => (
          <Tower {...props} onPress={() => handleTowerClick(towerId)} />
        ), // ✅ Pass click handler
      };
  
      console.log('🔹 Tower placed at:', x * tileWidth, y * tileHeight);
      return newEntities;
    });
  
    // Hide selection menu
    setShowTowerMenu(false);
    setSelectedPlace(null);
  };
  
  // Function to handle tower clicks
  const handleTowerClick = (towerId) => {
    console.log(`🏰 Tower ${towerId} clicked!`);
    // Implement upgrade, sell, etc.
  };

  return (
    <ZoomableView
      groundWidth={groundWidth}
      groundHeight={groundHeight}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      minZoomScale={minZoomScale}
      maxZoomScale={maxZoomScale}
    >
      <View style={[styles.groundContainer, { width: groundWidth, height: groundHeight }]}>
      <AnimatedBackground 
      style={{ zIndex: 1 }}
      />
      {/* 1) Render the map first */}
      <ObjectMap
        mapObjects={mapObjects}
        onTowerPlacePress={handleTowerPlacePress}
        style={{ zIndex: 2 }}
      />

<GameEngine
  ref={gameEngine}
  systems={[enemySpawnerSystem, GameLoop, levelCompletionSystem]}
  entities={entities}
  onEvent={handleEvent}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1, // ✅ Ensure GameEngine is BELOW
  }}
  pointerEvents="none" // ✅ Ensures touch passes through
/>

{/* 🔹 Render Tower Places First */}
{mapObjects.map((obj) => {
  if (obj.type === 'towerPlace') {
    return (
      <TouchableOpacity
        key={obj.id}
        style={[styles.towerPlace, { left: obj.x * tileWidth, top: obj.y * tileHeight }]}
        onPress={() => handleTowerPlacePress(obj.id, obj.x, obj.y)}
      >
        <Image source={require('../assets/objects/PlaceForTower1.png')} style={styles.towerPlaceImage} />
      </TouchableOpacity>
    );
  }
  return null;
})}

{/* 🔹 Render Placed Towers Separately */}
{Object.values(entities).map((entity) => {
  if (entity.type === 'tower') {
    return (
      <Tower
        key={entity.id}
        position={entity.position}
        towerType={entity.towerType}
        onPress={() => handleTowerClick(entity.id)}
      />
    );
  }
  return null;
})}


      {/* 3) Tower selection menu last */}
      <TowerSelectionMenu
        visible={showTowerMenu}
        onClose={() => setShowTowerMenu(false)}
        onSelectTower={buildTower}
      />
    </View>
    </ZoomableView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 10,
  },
  towerPlace: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // ✅ Ensure tower places are clickable
  },
  towerPlaceImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  menuContainer: {
    width: 200,           // Make it n
    // arrower
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,          // Slightly smaller padding
    alignItems: 'center',
  },
  title: {
    fontSize: 18,         // Slightly smaller text
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    marginVertical: 5,
    padding: 8,
    borderRadius: 6,
    width: '100%',
  },
  icon: {
    width: 30,            // Smaller icon
    height: 30,
    marginRight: 10,
  },
  label: {
    color: '#fff',
    fontSize: 14,         // Smaller label text
  },
  cancelButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#999',
    borderRadius: 6,
  },
  cancelText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default GameScreen;
