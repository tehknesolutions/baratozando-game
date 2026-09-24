import Phaser from 'phaser';
import { PREMIUM_PLAYER } from '../../assets/assetKeys.js';
import { createRoachVisualSnapshot } from './RoachVisualContract.js';
import type { PlayerState } from './PlayerState.js';
import { PlayerAnimationController } from './PlayerAnimationController.js';

/**
 * Presentation-only premium roach. It deliberately has no Arcade body and
 * therefore cannot affect grounding, collisions, wall sensors or respawn.
 */
export class RoachVisual extends Phaser.GameObjects.Sprite {
  private readonly animator: PlayerAnimationController;

  constructor(scene: Phaser.Scene, x: number, y: number, scale: number) {
    super(scene, x, y, PREMIUM_PLAYER.idleFrames[0]);
    const visual = createRoachVisualSnapshot(scale);
    scene.add.existing(this);
    this.setOrigin(visual.originX, visual.originY);
    this.setScale(visual.scale);
    this.setPosition(x + visual.offsetX, y + visual.offsetY);
    this.animator = new PlayerAnimationController(this as any, true);
  }

  syncFromActor(actor: { x: number; y: number; facing: -1 | 1; alpha: number; tintTopLeft?: number }, state: PlayerState, nowMs: number): void {
    this.setPosition(actor.x, actor.y);
    this.setFlipX(actor.facing < 0);
    this.setAlpha(actor.alpha);
    if (actor.tintTopLeft !== undefined && actor.tintTopLeft !== 0xffffff) this.setTint(actor.tintTopLeft);
    else this.clearTint();
    this.animator.update(state, nowMs);
  }
}
