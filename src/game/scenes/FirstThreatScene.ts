import Phaser from 'phaser';
import { KeyboardInputAdapter } from '../input/KeyboardInputAdapter.js';
import { Player } from '../player/Player.js';
import { FIRST_THREAT_LAYOUT } from '../world/FirstThreatLayout.js';
import { Hazard } from '../world/Hazard.js';
import { Checkpoint } from '../world/Checkpoint.js';
import { ThreatChaseController } from '../threat/ThreatChaseController.js';
import { AncientPredator } from '../threat/AncientPredator.js';
import { CellarArtDirector, type CellarArtHandles } from '../visual/CellarArtDirector.js';
import { resolveDangerVisual } from '../visual/DangerVisualController.js';

export class FirstThreatScene extends Phaser.Scene {
  private player!: Player;
  private chase!: ThreatChaseController;
  private predator!: AncientPredator;
  private hpText!: any;
  private warningText!: any;
  private dangerOverlay!: any;
  private art!: CellarArtHandles;
  private wasRespawning = false;

  constructor() { super('first-threat'); }

  create(): void {
    const L = FIRST_THREAT_LAYOUT;
    this.physics.world.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBackgroundColor('#050505');

    this.art = CellarArtDirector.build(this, L);

    const platforms: any[] = [];
    for (const p of L.platforms) {
      const block = this.add.rectangle(p.x + p.width / 2, p.y + p.height / 2, p.width, p.height, 0x151210, 1)
        .setStrokeStyle(1, 0x4e3b30, 0.58)
        .setVisible(false);
      this.physics.add.existing(block, true);
      platforms.push(block);
    }

    const input = new KeyboardInputAdapter(this);
    this.player = new Player(this, L.spawn.x, L.spawn.y, input);
    this.player.setDepth(50);
    for (const platform of platforms) this.physics.add.collider(this.player, platform);

    const checkpoint = new Checkpoint(this, L.checkpoint.x, L.checkpoint.y);
    this.physics.add.overlap(this.player, checkpoint, () => {
      this.player.setCheckpoint(L.checkpoint.x, L.checkpoint.y - 8);
      checkpoint.activate();
    });

    for (const h of L.hazards) {
      const hazard = new Hazard(this, h);
      this.physics.add.overlap(this.player, hazard, () => this.player.takeDamage(this.time.now, hazard.x));
    }

    this.chase = new ThreatChaseController(L.chase);
    this.predator = new AncientPredator(this, L.chase.threatStartX, 512);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(180, 110);

    this.hpText = this.add.text(18, 18, '', {
      fontFamily: 'monospace', fontSize: '18px', color: '#e6c6a1',
    }).setScrollFactor(0).setDepth(100);

    this.add.text(18, 44, 'A/D mover  SHIFT correr  SPACE pular  CTRL/K esquiva', {
      fontFamily: 'monospace', fontSize: '11px', color: '#8f8479', backgroundColor: '#090807aa', padding: { x: 6, y: 4 },
    }).setScrollFactor(0).setDepth(100);

    this.add.text(18, 72, 'M1 — FIRST THREAT', {
      fontFamily: 'monospace', fontSize: '10px', color: '#a84d35',
    }).setScrollFactor(0).setDepth(100);

    this.warningText = this.add.text(480, 142, '', {
      fontFamily: 'monospace', fontSize: '42px', color: '#d9c5b5', stroke: '#120706', strokeThickness: 8,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(120).setAlpha(0);

    this.dangerOverlay = this.add.rectangle(480, 270, 960, 540, 0x5f100b, 0)
      .setScrollFactor(0).setDepth(40);

    this.add.text(L.chase.escapeX - 36, 370, 'SAFE', {
      fontFamily: 'monospace', fontSize: '10px', color: '#b79068',
    }).setDepth(10);
  }

  update(time: number, delta: number): void {
    this.player.updatePlayer(time, delta);

    if (this.player.y > FIRST_THREAT_LAYOUT.height - 4) {
      this.player.requestRespawn();
      this.resetChase();
    }

    const event = this.chase.update(time, this.player.x);
    this.predator.setThreatX(this.chase.threatX);
    this.predator.setMood(this.chase.state);

    if (event.triggeredNow) {
      this.warningText.setText('...').setAlpha(0.72);
      this.cameras.main.shake(210, 0.0032);
    }

    if (event.chaseStartedNow) {
      this.warningText.setText('CORRA.').setAlpha(1);
      this.cameras.main.shake(420, 0.006);
      this.time.delayedCall(900, () => {
        if (this.chase.state === 'CHASING') this.warningText.setAlpha(0);
      });
    }

    if (event.caughtNow) {
      this.warningText.setText('ESMAGADO.').setAlpha(1);
      this.cameras.main.shake(320, 0.012);
      this.cameras.main.flash(180, 80, 8, 5);
      this.player.kill(time, this.chase.threatX);
    }

    if (event.escapedNow) {
      this.warningText.setText('BARATOZOU.').setAlpha(1);
      this.dangerOverlay.setAlpha(0);
      this.time.delayedCall(1100, () => this.warningText.setAlpha(0));
    }

    const respawning = this.player.damage.respawning;
    if (respawning && !this.wasRespawning) this.resetChase();
    this.wasRespawning = respawning;

    this.updateDangerVisual();
    this.cameras.main.setFollowOffset(-this.player.facing * 82, 34);

    const hearts = '♥'.repeat(this.player.damage.hp) + '♡'.repeat(this.player.damage.maxHp - this.player.damage.hp);
    this.hpText.setText(`${hearts}   ${this.player.state}   ${this.chase.state}`);
  }

  private resetChase(): void {
    this.chase.reset();
    this.predator.setThreatX(FIRST_THREAT_LAYOUT.chase.threatStartX);
    this.predator.setMood('DORMANT');
    this.warningText.setAlpha(0);
    this.dangerOverlay.setAlpha(0);
  }

  private updateDangerVisual(): void {
    const gap = Math.max(0, this.player.x - this.chase.threatX);
    const visual = resolveDangerVisual(this.chase.state, gap);
    this.dangerOverlay.setAlpha(visual.overlayAlpha);
    this.art.amberGlow.setAlpha(visual.amberAlpha);

    for (let i = 0; i < this.art.dust.length; i++) {
      const base = 0.055 + (i % 4) * 0.018;
      this.art.dust[i].setAlpha(Math.min(0.28, base + visual.dustBoost * 0.11));
    }
  }

}
