// components/Levels.js

export const levelConfigs = {
  1: {
    // Level 1: 10 red mobs and 1 yellow mob.
    mobs: [
      { type: 'red', count: 10 },
      { type: 'yellow', count: 1 }
    ],
    spawnPoints: [
      [ { x: 200, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 50,  y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  2: {
    // Level 2: 5 red mobs and 5 yellow mobs.
    mobs: [
      { type: 'red', count: 5 },
      { type: 'yellow', count: 5 }
    ],
    spawnPoints: [
      [ { x: 200, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 350, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  3: {
    // Level 3: 10 red, 5 yellow, and 2 green mobs.
    mobs: [
      { type: 'red', count: 10 },
      { type: 'yellow', count: 5 },
      { type: 'green', count: 2 }
    ],
    spawnPoints: [
      [ { x: 150, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 250, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  4: {
    // Level 4: 15 red, 5 yellow, and 3 green mobs.
    mobs: [
      { type: 'red', count: 15 },
      { type: 'yellow', count: 5 },
      { type: 'green', count: 3 }
    ],
    spawnPoints: [
      [ { x: 100, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 300, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 200, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  5: {
    // Level 5: 20 red, 5 yellow, and 5 green mobs.
    mobs: [
      { type: 'red', count: 20 },
      { type: 'yellow', count: 5 },
      { type: 'green', count: 5 }
    ],
    spawnPoints: [
      [ { x: 50,  y: 0 }, { x: 200, y: 600 } ],
      [ { x: 350, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  6: {
    // Level 6: 20 red, 10 yellow, 5 green, and 1 blue mob.
    mobs: [
      { type: 'red', count: 20 },
      { type: 'yellow', count: 10 },
      { type: 'green', count: 5 },
      { type: 'blue', count: 1 }
    ],
    spawnPoints: [
      [ { x: 150, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 250, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  7: {
    // Level 7: 25 red, 10 yellow, 5 green, and 2 blue mobs.
    mobs: [
      { type: 'red', count: 25 },
      { type: 'yellow', count: 10 },
      { type: 'green', count: 5 },
      { type: 'blue', count: 2 }
    ],
    spawnPoints: [
      [ { x: 100, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 300, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  8: {
    // Level 8: 25 red, 15 yellow, 10 green, and 2 blue mobs.
    mobs: [
      { type: 'red', count: 25 },
      { type: 'yellow', count: 15 },
      { type: 'green', count: 10 },
      { type: 'blue', count: 2 }
    ],
    spawnPoints: [
      [ { x: 50, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 350, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  9: {
    // Level 9: 30 red, 15 yellow, 10 green, 3 blue, and 1 purple mob.
    mobs: [
      { type: 'red', count: 30 },
      { type: 'yellow', count: 15 },
      { type: 'green', count: 10 },
      { type: 'blue', count: 3 },
      { type: 'purple', count: 1 }
    ],
    spawnPoints: [
      [ { x: 150, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 250, y: 0 }, { x: 200, y: 600 } ]
    ]
  },
  10: {
    // Level 10: 30 red, 20 yellow, 15 green, 3 blue, and 2 purple mobs.
    mobs: [
      { type: 'red', count: 30 },
      { type: 'yellow', count: 20 },
      { type: 'green', count: 15 },
      { type: 'blue', count: 3 },
      { type: 'purple', count: 2 }
    ],
    spawnPoints: [
      [ { x: 100, y: 0 }, { x: 200, y: 600 } ],
      [ { x: 300, y: 0 }, { x: 200, y: 600 } ]
    ]
  }
};
