import Phaser from 'phaser';
import { PLAYER_ASSET_PATHS } from '../../assets/assetKeys.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('boot'); }

  preload(): void {
    for (const [key, path] of Object.entries(PLAYER_ASSET_PATHS)) this.load.image(key, path);
  }

  create(): void {
    this.scene.start('movement-lab');
  }
}
