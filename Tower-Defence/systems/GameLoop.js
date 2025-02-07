import React from 'react';
import Bullet from '../components/Bullet';

const getDistance = (p1, p2) => {
  if (!p1 || !p2) return Infinity;
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

// Simple collision detection: assumes obstacle is 80x80.
const isColliding = (pos, obstacle) => {
  const obsX = obstacle.position.x;
  const obsY = obstacle.position.y;
  const obsWidth = 80;
  const obsHeight = 80;
  return (
    pos.x >= obsX &&
    pos.x <= obsX + obsWidth &&
    pos.y >= obsY &&
    pos.y <= obsY + obsHeight
  );
};

const GameLoop = (entities, { time, dispatch }) => {
  const delta = time.delta;

  // --- Process Mob Movement ---
  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    if (entity && entity.type === 'mob') {
      const path = entity.path;
      if (path && path.length > 1) {
        const targetPoint = path[1];
        const dx = targetPoint.x - entity.position.x;
        const dy = targetPoint.y - entity.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let newX = entity.position.x + (dx / distance) * entity.speed * delta;
        let newY = entity.position.y + (dy / distance) * entity.speed * delta;
        // Check obstacles
        const obstacles = Object.keys(entities)
          .filter(k => entities[k].type === 'obstacle')
          .map(k => entities[k]);
        obstacles.forEach(obstacle => {
          if (isColliding({ x: newX, y: newY }, obstacle)) {
            // Simple detour: shift position slightly
            newX += 10;
          }
        });
        if (distance < entity.speed * delta) {
          delete entities[key];
        } else {
          entity.position.x = newX;
          entity.position.y = newY;
        }
      }
    }
  });

  // --- Towers Shooting Mobs ---
  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    if (entity && entity.type === 'tower') {
      let target = null;
      let minDistance = Infinity;
      Object.keys(entities).forEach(otherKey => {
        const other = entities[otherKey];
        if (other && other.type === 'mob') {
          const d = getDistance(entity.position, other.position);
          if (d < minDistance && d <= entity.attackRange) {
            minDistance = d;
            target = other;
          }
        }
      });
      if (target) {
        entity.timeSinceLastShot += delta;
        if (entity.timeSinceLastShot >= entity.fireRate) {
          const dx = target.position.x - entity.position.x;
          const dy = target.position.y - entity.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            const bulletSpeed = 0.3;
            const velocity = { x: (dx / dist) * bulletSpeed, y: (dy / dist) * bulletSpeed };
            const bulletId = 'bullet' + Date.now() + Math.random().toString(36).substring(2);
            let bulletType = 'default';
            if (entity.towerType === 'archer') bulletType = 'arrow';
            else if (entity.towerType === 'cannon') bulletType = 'cannonball';
            else if (entity.towerType === 'mage') bulletType = 'magic';
            entities[bulletId] = {
              id: bulletId,
              type: 'bullet',
              position: { x: entity.position.x, y: entity.position.y },
              velocity: velocity,
              damage: entity.damage,
              renderer: Bullet,
              bulletType: bulletType,
              target: target.id,
            };
          }
          entity.timeSinceLastShot = 0;
        }
      }
    }
  });

  // --- Update Bullet Positions and Handle Collision ---
  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    if (entity && entity.type === 'bullet') {
      if (entity.target && entities[entity.target]) {
        const target = entities[entity.target];
        const dx = target.position.x - entity.position.x;
        const dy = target.position.y - entity.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const bulletSpeed = 0.3;
        if (distance > 0) {
          entity.velocity.x = (dx / distance) * bulletSpeed;
          entity.velocity.y = (dy / distance) * bulletSpeed;
        }
        entity.position.x += entity.velocity.x * delta;
        entity.position.y += entity.velocity.y * delta;
        if (distance < 10) {
          if (typeof target.hp === 'undefined') target.hp = 3;
          target.hp -= entity.damage;
          if (target.hp <= 0) {
            delete entities[target.id];
          }
          delete entities[key];
        }
      } else {
        delete entities[key];
      }
      if (
        entity.position.x < 0 ||
        entity.position.x > 400 ||
        entity.position.y < 0 ||
        entity.position.y > 600
      ) {
        delete entities[key];
      }
    }
  });

  return entities;
};

export default GameLoop;