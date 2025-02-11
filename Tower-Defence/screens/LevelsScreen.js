import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LevelsScreen = ({ navigation }) => {
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);

  // ✅ Load unlocked and completed levels from AsyncStorage
  useEffect(() => {
    const loadLevels = async () => {
      try {
        const savedLevels = await AsyncStorage.getItem('unlockedLevels');
        const savedCompleted = await AsyncStorage.getItem('completedLevels');
  
        setUnlockedLevels(savedLevels ? parseInt(savedLevels, 10) : 1);
        setCompletedLevels(savedCompleted ? JSON.parse(savedCompleted) : []);
      } catch (error) {
        console.error("❌ Error loading levels:", error);
      }
    };
    loadLevels();
  }, []);  

  // ✅ Handle level selection
  const handleLevelSelect = (level) => {
    if (level <= unlockedLevels) {
      navigation.navigate('GameScreen', { level });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Level</Text>
      <View style={styles.levelContainer}>
        {[...Array(10)].map((_, index) => {
          const level = index + 1;
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton, 
                level > unlockedLevels && styles.locked,
                completedLevels.includes(level) && styles.completed // ✅ Show completed levels
              ]}
              onPress={() => handleLevelSelect(level)}
              disabled={level > unlockedLevels}
            >
              <Text style={styles.levelText}>
                {completedLevels.includes(level) ? `✔ Level ${level}` : `Level ${level}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  levelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  levelButton: {
    width: 100,
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  locked: {
    backgroundColor: '#555',
  },
  completed: {
    backgroundColor: '#FFD700',
  },
  levelText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default LevelsScreen;
