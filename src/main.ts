import Phaser from 'phaser';
import './style.css';
import { BootScene } from './game/scenes/BootScene.js';
import { MovementLabScene } from './game/scenes/MovementLabScene.js';
import { FirstThreatScene } from './game/scenes/FirstThreatScene.js';
import { MobilityLabV2Scene } from './game/scenes/MobilityLabV2Scene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#070706',
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MovementLabScene, FirstThreatScene, MobilityLabV2Scene],
});
