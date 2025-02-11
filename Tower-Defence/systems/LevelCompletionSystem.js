// systems/LevelCompletionSystem.js

const LevelCompletionSystem = (entities, { dispatch }) => {
  // Proceed only if the level configuration has been initialized.
  if (entities.levelConfig) {
    // Calculate how many mobs are yet to be spawned.
    const remainingToSpawn = entities.levelConfig.mobs.reduce(
      (acc, mob) => acc + mob.count,
      0
    );
    // If all mobs have been spawned…
    if (remainingToSpawn === 0) {
      // …and no mob entities remain on screen…
      const mobsLeft = Object.keys(entities).some(
        key => entities[key].type === 'mob'
      );
      if (!mobsLeft && !entities.levelCleared) {
        // Mark level as cleared and dispatch the event.
        entities.levelCleared = true;
        dispatch({ type: 'LEVEL_CLEARED' });
      }
    }
  }
  return entities;
};

export default LevelCompletionSystem;
