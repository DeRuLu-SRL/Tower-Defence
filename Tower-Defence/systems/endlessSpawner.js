// systems/endlessSpawner.js
import Mob from '../components/Mob';

const EndlessSpawner = (entities, { time, gameTime }) => {
  console.log('--- EndlessSpawner invoked ---');
  console.log('time.delta:', time.delta);
  console.log('gameTime:', gameTime);

  if (!entities.enemySpawnTimer) {
    entities.enemySpawnTimer = { timeElapsed: 0 };
  }
  entities.enemySpawnTimer.timeElapsed += time.delta;
  console.log('Timer elapsed:', entities.enemySpawnTimer.timeElapsed);

  const spawnInterval = 1500; // spawn every 1.5 seconds
  
  if (entities.enemySpawnTimer.timeElapsed >= spawnInterval) {
    console.log('Spawn interval reached');
    entities.enemySpawnTimer.timeElapsed = 0;
    const minutes = gameTime / 60000;
    console.log('Elapsed minutes:', minutes);

    // Define allowed mob types and properties based on elapsed time.
    let mobTypes, mobPropsArray;
    if (minutes < 1) {
      // Under 1 minute: allowed types: red and yellow.
      mobTypes = ['red', 'yellow'];
      mobPropsArray = [
        { hp: 3, speed: 0.05 },  // red properties
        { hp: 5, speed: 0.04 }   // yellow properties
      ];
    } else if (minutes < 2) {
      // From 1 to 2 minutes: allowed types: red, yellow, green.
      mobTypes = ['red', 'yellow', 'green'];
      mobPropsArray = [
        { hp: 3, speed: 0.05 },  // red
        { hp: 5, speed: 0.04 },  // yellow
        { hp: 8, speed: 0.03 }   // green
      ];
    } else if (minutes < 3) {
      // From 2 to 3 minutes: allowed types: red, yellow, green, blue.
      mobTypes = ['red', 'yellow', 'green', 'blue'];
      mobPropsArray = [
        { hp: 3, speed: 0.05 },    // red
        { hp: 5, speed: 0.04 },    // yellow
        { hp: 8, speed: 0.03 },    // green
        { hp: 12, speed: 0.025 }   // blue
      ];
    } else {
      // 3 minutes or more: allowed types: red, yellow, green, blue, purple.
      mobTypes = ['red', 'yellow', 'green', 'blue', 'purple'];
      mobPropsArray = [
        { hp: 3, speed: 0.05 },    // red
        { hp: 5, speed: 0.04 },    // yellow
        { hp: 8, speed: 0.03 },    // green
        { hp: 12, speed: 0.025 },  // blue
        { hp: 20, speed: 0.02 }     // purple
      ];
    }

    // Decide how many mobs to spawn this interval.
    // (You can adjust spawnCount as needed; here we spawn 1 mob per interval.)
    const spawnCount = 1;
    console.log('Calculated spawnCount:', spawnCount);

    // Define an array of spawn points.
    const spawnPoints = [
      [ { x: 200, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 50, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 350, y: 0 }, { x: 200, y: 600 } ]
    ];
    
    // For each mob to spawn, choose a random type from the allowed arrays.
    for (let i = 0; i < spawnCount; i++) {
      const randomTypeIndex = Math.floor(Math.random() * mobTypes.length);
      const chosenType = mobTypes[randomTypeIndex];
      const chosenProps = mobPropsArray[randomTypeIndex];

      // Choose a random spawn point.
      const spawnIndex = Math.floor(Math.random() * spawnPoints.length);
      const path = spawnPoints[spawnIndex];
      const mobId = `mob-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      console.log(`Spawning mob ${mobId} of type ${chosenType} at spawn point index ${spawnIndex}`);
      entities[mobId] = {
        id: mobId,
        type: 'mob',
        position: { ...path[0] },
        speed: chosenProps.speed,
        path: path,
        hp: chosenProps.hp,
        renderer: Mob,
        mobType: chosenType,
      };
    }
  }
  return entities;
};

export default EndlessSpawner;
