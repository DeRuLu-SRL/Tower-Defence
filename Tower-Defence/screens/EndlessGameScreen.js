// screens/EndlessGameScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Tower from '../components/Tower';
import DraggableTower from '../components/DraggableTower';
import GameLoopEndless from '../systems/GameLoopEndless';
import Obstacle from '../components/Obstacle';
import Mob from '../components/Mob';
import fireImage from '../assets/fire.png';
import roadImage from '../assets/road.png';
import EndlessSpawner from '../systems/endlessSpawner';

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

const EndlessGameScreen = ({ navigation }) => {
  const [entities, setEntities] = useState({});
  const [gameTime, setGameTime] = useState(0); // in milliseconds
  const [kills, setKills] = useState(0);
  const gameEngine = useRef(null);
  const gameAreaRef = useRef(null);

  // Set up obstacles.
  useEffect(() => {
    setEntities(prev => {
      let newEntities = { ...prev };
      for (let i = 1; i <= 3; i++) {
        const x = Math.floor(Math.random() * (350 - 50 + 1)) + 50;
        const y = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
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

  // Game timer.
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // For debugging, log gameTime updates.
  useEffect(() => {
    console.log("Endless mode gameTime:", gameTime);
  }, [gameTime]);

  const onEvent = (e) => {
    if (e.type === 'MOB_KILLED') {
      setKills(prev => prev + 1);
    }
  };

  // Tower drop handler.
  const handleTowerDrop = (towerType, dropPosition) => {
    if (!dropPosition || dropPosition.x == null || dropPosition.y == null) {
      console.error("Invalid drop position:", dropPosition);
      return;
    }
    const towerCount = Object.keys(entities).filter(key => entities[key].type === 'tower').length;
    if (towerCount >= 3) {
      Alert.alert("Maximum Towers", "You can only place 3 towers per game.");
      return;
    }
    if (!gameAreaRef.current) return;
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
      setEntities(prevEntities => {
        const updated = { ...prevEntities, [newTowerId]: newTower };
        if (gameEngine.current) {
          gameEngine.current.swap(updated);
        }
        return updated;
      });
    });
  };

  // Wrap EndlessSpawner to capture the current gameTime from state.
  const spawnerWithGameTime = (entities, args) => {
    return EndlessSpawner(entities, { ...args, gameTime });
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Info */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.infoText}>Time: {Math.floor(gameTime/1000)}s</Text>
          <Text style={styles.infoText}>Kills: {kills}</Text>
        </View>
      </View>
      <Image source={roadImage} style={styles.road} />
      <View ref={gameAreaRef} style={styles.gameArea}>
        <GameEngine
          ref={gameEngine}
          systems={[spawnerWithGameTime, GameLoopEndless]}
          entities={entities}
          onEvent={onEvent}
          style={styles.gameEngine}
          additionalArgs={{ gameTime }}
        />
        <Image source={fireImage} style={styles.fire} />
      </View>
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
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  infoText: { color: '#fff', fontSize: 16, marginHorizontal: 10 },
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
});

export default EndlessGameScreen;
