import Phaser from 'phaser';
import { KeyboardInputAdapter } from '../input/KeyboardInputAdapter.js';
import { Player } from '../player/Player.js';
import { MOVEMENT_LAB_LAYOUT } from '../world/MovementLabLayout.js';
import { Hazard } from '../world/Hazard.js';
import { Checkpoint } from '../world/Checkpoint.js';

export class MovementLabScene extends Phaser.Scene {
  private player!: Player;
  private hpText!: any;

  constructor() { super('movement-lab'); }

  create(): void {
    const L = MOVEMENT_LAB_LAYOUT;
    this.physics.world.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBackgroundColor('#070706');

    this.createAtmosphere();

    const platforms: any[] = [];
    for (const p of L.platforms) {
      const block = this.add.rectangle(p.x + p.width / 2, p.y + p.height / 2, p.width, p.height, 0x171412, 1)
        .setStrokeStyle(1, 0x5a4635, 0.65);
      this.physics.add.existing(block, true);
      platforms.push(block);
    }

    const input = new KeyboardInputAdapter(this);
    this.player = new Player(this, L.spawn.x, L.spawn.y, input, { premiumVisual: true });
    for (const platform of platforms) this.physics.add.collider(this.player, platform);

    for (const h of L.hazards) {
      const hazard = new Hazard(this, h);
      this.physics.add.overlap(this.player, hazard, () => this.player.takeDamage(this.time.now, hazard.x));
    }

    for (const cp of L.checkpoints) {
      const checkpoint = new Checkpoint(this, cp.x, cp.y);
      this.physics.add.overlap(this.player, checkpoint, () => {
        this.player.setCheckpoint(cp.x, cp.y - 8);
        checkpoint.activate();
      });
    }

    const finishGlow = this.add.circle(L.finish.x, L.finish.y - 28, 18, 0xffb35a, 0.13)
      .setStrokeStyle(2, 0xffc977, 0.8);
    this.add.text(L.finish.x - 42, L.finish.y - 75, 'M0 EXIT', { fontFamily: 'monospace', fontSize: '12px', color: '#d9c2a8' });
    finishGlow.setDepth(-1);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(180, 110);

    this.hpText = this.add.text(18, 18, '', { fontFamily: 'monospace', fontSize: '18px', color: '#e6c6a1' }).setScrollFactor(0).setDepth(100);
    this.add.text(18, 44, 'A/D mover  SHIFT correr  SPACE pular  CTRL/K esquiva  R respawn', {
      fontFamily: 'monospace', fontSize: '11px', color: '#8f8479', backgroundColor: '#090807aa', padding: { x: 6, y: 4 },
    }).setScrollFactor(0).setDepth(100);
    this.add.text(18, 72, 'M0 — COCKROACH MOVEMENT LAB', { fontFamily: 'monospace', fontSize: '10px', color: '#b06b3c' }).setScrollFactor(0).setDepth(100);
  }

  update(time: number, delta: number): void {
    this.player.updatePlayer(time, delta);
    if (this.player.y > MOVEMENT_LAB_LAYOUT.height - 4) this.player.requestRespawn();
    this.cameras.main.setFollowOffset(-this.player.facing * 72, 36);
    const hearts = '♥'.repeat(this.player.damage.hp) + '♡'.repeat(this.player.damage.maxHp - this.player.damage.hp);
    this.hpText.setText(`${hearts}   ${this.player.state}`);
  }

  private createAtmosphere(): void {
    const W = MOVEMENT_LAB_LAYOUT.width;
    const H = MOVEMENT_LAB_LAYOUT.height;
    this.add.rectangle(W / 2, H / 2, W, H, 0x070706, 1).setDepth(-20);

    for (let i = 0; i < 14; i++) {
      const x = 120 + i * 160;
      const height = 120 + (i % 4) * 55;
      this.add.rectangle(x, H - 185, 46 + (i % 3) * 26, height, 0x101113, 0.78)
        .setOrigin(0.5, 1).setScrollFactor(0.28).setDepth(-16);
    }

    this.add.rectangle(810, 345, 20, 430, 0x030303, 0.88).setRotation(-0.16).setScrollFactor(0.2).setDepth(-15);
    this.add.rectangle(845, 350, 18, 410, 0x030303, 0.88).setRotation(-0.08).setScrollFactor(0.2).setDepth(-15);
    this.add.rectangle(880, 355, 18, 395, 0x030303, 0.88).setScrollFactor(0.2).setDepth(-15);
    this.add.ellipse(1600, 220, 430, 180, 0x020202, 0.86).setRotation(-0.12).setScrollFactor(0.34).setDepth(-14);

    for (let r = 230; r >= 60; r -= 35) {
      this.add.circle(420, 280, r, 0xff9d4b, 0.009 + (230 - r) / 25000).setScrollFactor(0.12).setDepth(-18);
    }

    for (let i = 0; i < 70; i++) {
      const dust = this.add.circle((i * 137) % W, 80 + ((i * 83) % 390), 1 + (i % 2), 0xd2aa7b, 0.12 + (i % 4) * 0.035);
      dust.setScrollFactor(0.5 + (i % 3) * 0.1).setDepth(-8);
    }
  }
}
