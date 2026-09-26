import Phaser from 'phaser';
import { PREMIUM_PLAYER } from '../../assets/assetKeys.js';
import { createRoachVisualSnapshot, resolveRoachChannels } from './RoachVisualContract.js';
import { resolveRoachAnimationV3 } from './RoachAnimationV3.js';
import type { PlayerState } from './PlayerState.js';
import { PlayerAnimationController } from './PlayerAnimationController.js';

/** Presentation-only premium roach. No child owns an Arcade body. */
export class RoachVisual extends Phaser.GameObjects.Container {
  private readonly bodySprite: Phaser.GameObjects.Sprite;
  private readonly wingSprite: Phaser.GameObjects.Sprite;
  private readonly animator: PlayerAnimationController;

  constructor(scene: Phaser.Scene, x: number, y: number, scale: number) {
    super(scene, x, y);
    const visual = createRoachVisualSnapshot(scale);
    scene.add.existing(this);

    this.bodySprite = scene.add.sprite(0, 0, PREMIUM_PLAYER.idleFrames[0]);
    this.bodySprite.setOrigin(visual.originX, visual.originY);
    this.wingSprite = scene.add.sprite(0, 0, PREMIUM_PLAYER.wingFlapFrames[0]);
    this.wingSprite.setOrigin(visual.originX, visual.originY).setVisible(false);
    this.add([this.bodySprite, this.wingSprite]);
    this.setScale(visual.scale);
    this.setPosition(x + visual.offsetX, y + visual.offsetY);
    this.animator = new PlayerAnimationController(this.bodySprite as any, true);
  }

  syncFromActor(actor: { x: number; y: number; facing: -1 | 1; alpha: number; tintTopLeft?: number }, state: PlayerState, nowMs: number): void {
    this.setPosition(actor.x, actor.y);
    this.setScale(Math.abs(this.scaleX), Math.abs(this.scaleY));
    this.bodySprite.setFlipX(actor.facing < 0);
    this.wingSprite.setFlipX(actor.facing < 0);
    this.setAlpha(actor.alpha);

    if (actor.tintTopLeft !== undefined && actor.tintTopLeft !== 0xffffff) {
      this.bodySprite.setTint(actor.tintTopLeft);
      this.wingSprite.setTint(actor.tintTopLeft);
    } else {
      this.bodySprite.clearTint();
      this.wingSprite.clearTint();
    }

    const descriptor = resolveRoachAnimationV3(state);
    const channels = resolveRoachChannels(descriptor);
    this.wingSprite.setVisible(channels.wingsVisible);
    if (channels.wingsVisible) {
      const frames = descriptor.wingMode === 'GLIDE' ? PREMIUM_PLAYER.glideFrames : PREMIUM_PLAYER.wingFlapFrames;
      const frameMs = 1000 / descriptor.fps;
      const index = descriptor.loop ? Math.floor(nowMs / frameMs) % frames.length : Math.min(frames.length - 1, Math.floor(nowMs / frameMs));
      this.wingSprite.setTexture(frames[index]);
    }

    this.animator.update(state, nowMs);
  }
}
