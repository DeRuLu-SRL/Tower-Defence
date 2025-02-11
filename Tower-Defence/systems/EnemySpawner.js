import Mob from '../components/Mob';
import { levelConfigs } from '../components/Levels';

const EnemySpawner = (entities, { time, currentLevel }) => {
  // Wait 5 seconds before spawning begins.
  if (entities.spawnDelay === undefined) {
    entities.spawnDelay = 5000; // 5000 ms delay
    console.log('Spawn delay initialized to 5000 ms');
  }
  if (entities.spawnDelay > 0) {
    entities.spawnDelay -= time.delta;
    return entities;
  }

  // Create a persistent clone of the level configuration on first run.
  if (!entities.levelConfig) {
    // Clone the config and store the original expected total count.
    const levelData = JSON.parse(JSON.stringify(levelConfigs[currentLevel]));
    levelData.totalExpected = levelData.mobs.reduce((acc, mob) => acc + mob.count, 0);
    levelData.totalSpawned = 0;
    entities.levelConfig = levelData;
    console.log('Initialized level config:', entities.levelConfig);
  }
  const config = entities.levelConfig;
  
  // Use the stored totalExpected (not the sum of the remaining counts) to determine if spawning is done.
  if (config.totalSpawned >= config.totalExpected) {
    return entities;
  }

  // Use an internal timer for spawn intervals.
  if (!entities.enemySpawnTimer) {
    entities.enemySpawnTimer = { timeElapsed: 0 };
  }
  entities.enemySpawnTimer.timeElapsed += time.delta;
  const spawnInterval = 1500; // spawn every 1.5 seconds

  if (entities.enemySpawnTimer.timeElapsed >= spawnInterval) {
    entities.enemySpawnTimer.timeElapsed = 0;

    // Calculate the total remaining count from the mutable mob counts.
    const totalRemainingCount = config.mobs.reduce((acc, mob) => acc + mob.count, 0);
    console.log('Total remaining count:', totalRemainingCount);

    if (totalRemainingCount > 0) {
      // Weighted-random selection.
      let rand = Math.floor(Math.random() * totalRemainingCount);
      let selectedMob = null;
      for (let mob of config.mobs) {
        if (rand < mob.count) {
          selectedMob = mob;
          break;
        } else {
          rand -= mob.count;
        }
      }
      if (selectedMob) {
        selectedMob.count--;
        config.totalSpawned++;
        let mobProps;
        switch (selectedMob.type) {
          case 'red':
            mobProps = { hp: 3, speed: 0.05 };
            break;
          case 'yellow':
            mobProps = { hp: 5, speed: 0.04 };
            break;
          case 'green':
            mobProps = { hp: 8, speed: 0.03 };
            break;
          case 'blue':
            mobProps = { hp: 12, speed: 0.025 };
            break;
          case 'purple':
            mobProps = { hp: 20, speed: 0.02 };
            break;
          default:
            mobProps = { hp: 3, speed: 0.05 };
        }
        // Choose a random spawn point from the level config.
        const spawnPoints = levelConfigs[currentLevel].spawnPoints;
        const pathIndex = Math.floor(Math.random() * spawnPoints.length);
        const path = spawnPoints[pathIndex];
        const mobId = `mob-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        console.log(`Spawning ${selectedMob.type} mob (${mobId}). Remaining for this type: ${selectedMob.count}`);
        entities[mobId] = {
          id: mobId,
          type: 'mob',
          position: { ...path[0] },
          speed: mobProps.speed,
          path: path,
          hp: mobProps.hp,
          renderer: Mob,
          mobType: selectedMob.type,
        };
      }
    }
  }
  return entities;
};

EnemySpawner.reset = () => {
  // Optionally reset external counters if needed.
};

export default EnemySpawner;
