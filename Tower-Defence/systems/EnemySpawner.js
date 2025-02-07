import React from 'react';
import Mob from '../components/Mob';

let currentLevelSpawnCount = 0;

const EnemySpawner = (entities, { time, levelConfig }) => {
  const totalMobsExpected = levelConfig.mobs.reduce((acc, mob) => acc + mob.count, 0);
  if (currentLevelSpawnCount >= totalMobsExpected) return entities;

  let enemySpawnTimer = entities.enemySpawnTimer || 0;
  enemySpawnTimer += time.delta;
  const spawnInterval = 3000; // Spawn every 3 seconds

  if (enemySpawnTimer >= spawnInterval) {
    enemySpawnTimer = 0;
    const availableMobEntries = levelConfig.mobs.filter(mob => mob.count > 0);
    if (availableMobEntries.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMobEntries.length);
      const mobEntry = availableMobEntries[randomIndex];
      mobEntry.count--; // Decrement count for that mob type
      currentLevelSpawnCount++;

      let mobProps = {};
      switch (mobEntry.type) {
        case 'red':    mobProps = { hp: 3, speed: 0.05 }; break;
        case 'yellow': mobProps = { hp: 5, speed: 0.04 }; break;
        case 'green':  mobProps = { hp: 8, speed: 0.03 }; break;
        case 'blue':   mobProps = { hp: 12, speed: 0.025 }; break;
        case 'purple': mobProps = { hp: 20, speed: 0.02 }; break;
        default:       mobProps = { hp: 3, speed: 0.05 };
      }
      const spawnPoints = levelConfig.spawnPoints;
      const pathIndex = Math.floor(Math.random() * spawnPoints.length);
      const path = spawnPoints[pathIndex];
      const mobId = 'mob' + Date.now() + Math.random().toString(36).substring(2);

      entities[mobId] = {
        id: mobId,
        type: 'mob',
        position: { ...path[0] },
        speed: mobProps.speed,
        path: path,
        hp: mobProps.hp,
        renderer: Mob, // Pass the Mob component
        mobType: mobEntry.type,
      };
    }
  }
  entities.enemySpawnTimer = enemySpawnTimer;
  return entities;
};

EnemySpawner.reset = () => {
  currentLevelSpawnCount = 0;
};

export default EnemySpawner;