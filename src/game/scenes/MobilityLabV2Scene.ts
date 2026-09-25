import Phaser from 'phaser';
import { KeyboardInputAdapter } from '../input/KeyboardInputAdapter.js';
import { Player, type WallContact } from '../player/Player.js';
import { resolveSafeSpawn } from '../player/SafeSpawnResolver.js';
import { MOBILITY_LAB_V2, type MobilitySurface } from '../world/MobilityLabV2Layout.js';
import { MobilityLabArtDirector, type CellarVisualGroups } from '../visual/MobilityLabArtDirector.js';
import { resolveMobilityTutorial } from '../visual/MobilityTutorial.js';
import { resolveWallContactFromGeometry } from '../player/WallContactSensor.js';
import { CellarReadabilityDirector } from '../visual/CellarReadabilityDirector.js';
import { CELLAR_LAYERS } from '../visual/CellarLayerModel.js';
import { CellarParallaxDirector } from '../visual/CellarParallaxDirector.js';

export class MobilityLabV2Scene extends Phaser.Scene {
  private player!: Player;
  private surfaces: Array<{ spec: MobilitySurface; block: any }> = [];
  private hud!: any;
  private prompt!: any;
  private readabilityField!: Phaser.GameObjects.Ellipse;
  private visualGroups!: CellarVisualGroups;

  constructor() { super('mobility-lab-v2'); }

  create(): void {
    const L = MOBILITY_LAB_V2;
    this.physics.world.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBackgroundColor('#070706');
    this.visualGroups = MobilityLabArtDirector.build(this, L);

    for (const spec of L.surfaces) {
      const color = spec.surface === 'ROUGH_CLIMB' ? 0x4a3428 : spec.role === 'recovery' ? 0x26221e : 0x34302a;
      const block = this.add.rectangle(spec.x + spec.width / 2, spec.y + spec.height / 2, spec.width, spec.height, color, 1)
        .setStrokeStyle(1, spec.surface === 'ROUGH_CLIMB' ? 0xb26f3c : 0x66584a, 0.65);
      block.setVisible(false);
      this.physics.add.existing(block, true);
      this.surfaces.push({ spec, block });
    }

    const safeSpawn = resolveSafeSpawn(L.spawn, L.surfaces, { bodyHeight: 18, clearance: 2 });
    const input = new KeyboardInputAdapter(this);
    this.player = new Player(this, safeSpawn.x, safeSpawn.y, input, { mobilityV2: true, premiumVisual: true });
    this.player.setCheckpoint(safeSpawn.x, safeSpawn.y);
    this.player.setDepth(CELLAR_LAYERS.characterPlane.depth - 1);
    this.readabilityField = CellarReadabilityDirector.createPlayerField(this, safeSpawn.x, safeSpawn.y);
    this.player.roachVisual?.setDepth(CELLAR_LAYERS.characterPlane.depth);

    for (const { block } of this.surfaces) this.physics.add.collider(this.player, block);
    this.player.setWallContactProvider(() => this.resolveWallContact());

    this.cameras.main.startFollow(this.player, true, 0.105, 0.09);
    this.cameras.main.setDeadzone(180, 145);

    this.hud = this.add.text(18, 18, '', {
      fontFamily: 'monospace', fontSize: '14px', color: '#e7c493', backgroundColor: '#090807bb', padding: { x: 7, y: 5 },
    }).setScrollFactor(0).setDepth(CELLAR_LAYERS.presentation.depth);
    this.prompt = this.add.text(480, 470, resolveMobilityTutorial(this.player.x, this.player.y), {
      fontFamily: 'monospace', fontSize: '12px', color: '#c6aa85', backgroundColor: '#090807cc', padding: { x: 8, y: 6 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(CELLAR_LAYERS.presentation.depth);
    this.add.text(L.goal.x, L.goal.y - 18, 'TOPO', { fontFamily: 'monospace', fontSize: '12px', color: '#ffb45e' })
      .setOrigin(0.5).setDepth(CELLAR_LAYERS.gameplayPlane.depth + 3);
  }

  update(time: number, delta: number): void {
    this.player.updatePlayer(time, delta);
    if (this.player.y > MOBILITY_LAB_V2.height - 8) this.player.requestRespawn();

    const parallax = CellarParallaxDirector.resolve(this.cameras.main.scrollX);
    this.visualGroups.far.setX(parallax.farX);
    this.visualGroups.rear.setX(parallax.rearX);

    const body = this.player.body as any;
    const speed = Math.abs(Number(body?.velocity?.x ?? 0));
    CellarReadabilityDirector.updatePlayerField(this.readabilityField, this.player.x, this.player.y, this.player.facing, speed);

    this.prompt.setText(resolveMobilityTutorial(this.player.x, this.player.y));
    const contact = this.resolveWallContact();
    const side = contact.touchingLeft ? 'L' : contact.touchingRight ? 'R' : '—';
    const climb = contact.surface ?? '—';
    const visual = this.player.roachVisual;
    this.hud.setText([
      `STATE ${this.player.state}   ASAS ${this.player.flapsRemaining}/2   PAREDE ${side} ${climb}`,
      `POS ${this.player.x.toFixed(1)},${this.player.y.toFixed(1)}  VEL ${Number(body?.velocity?.x ?? 0).toFixed(1)},${Number(body?.velocity?.y ?? 0).toFixed(1)}`,
      `PHYS VIS ${this.player.visible} BODY ${body?.enable ?? '—'} SIZE ${Number(body?.width ?? 0).toFixed(0)}x${Number(body?.height ?? 0).toFixed(0)}`,
      `VISUAL ${visual?.visible ?? false} SCALE ${Number(visual?.scaleX ?? 0).toFixed(3)} TEX ${visual?.texture?.key ?? '—'}`,
    ]);

    const vy = Number(body?.velocity?.y ?? 0);
    const xLead = this.player.facing * (speed > 170 ? 78 : 62);
    const yBias = this.player.state === 'WALL_CLIMB' ? -78 : vy > 170 ? 60 : vy < -170 ? -28 : 0;
    this.cameras.main.setFollowOffset(-xLead, yBias);
  }

  private resolveWallContact(): WallContact {
    const body = this.player.body as any;
    return resolveWallContactFromGeometry({
      left: Number(body?.left ?? (this.player.x - 15)), right: Number(body?.right ?? (this.player.x + 15)),
      top: Number(body?.top ?? (this.player.y - 18)), bottom: Number(body?.bottom ?? this.player.y),
    }, MOBILITY_LAB_V2.surfaces, 7);
  }
}
