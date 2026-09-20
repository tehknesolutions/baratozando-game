import Phaser from 'phaser';
import { KeyboardInputAdapter } from '../input/KeyboardInputAdapter.js';
import { Player, type WallContact } from '../player/Player.js';
import { MOBILITY_LAB_V2, type MobilitySurface } from '../world/MobilityLabV2Layout.js';
import { MobilityLabArtDirector } from '../visual/MobilityLabArtDirector.js';
import { resolveMobilityTutorial } from '../visual/MobilityTutorial.js';
import { resolveWallContactFromGeometry } from '../player/WallContactSensor.js';

export class MobilityLabV2Scene extends Phaser.Scene {
  private player!: Player;
  private surfaces: Array<{ spec: MobilitySurface; block: any }> = [];
  private hud!: any;
  private prompt!: any;

  constructor() { super('mobility-lab-v2'); }

  create(): void {
    const L = MOBILITY_LAB_V2;
    this.physics.world.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBounds(0, 0, L.width, L.height);
    this.cameras.main.setBackgroundColor('#070706');
    MobilityLabArtDirector.build(this, L);

    for (const spec of L.surfaces) {
      const color = spec.surface === 'ROUGH_CLIMB' ? 0x4a3428 : spec.role === 'recovery' ? 0x26221e : 0x34302a;
      const block = this.add.rectangle(spec.x + spec.width / 2, spec.y + spec.height / 2, spec.width, spec.height, color, 1)
        .setStrokeStyle(1, spec.surface === 'ROUGH_CLIMB' ? 0xb26f3c : 0x66584a, 0.65);
      block.setVisible(false);
      this.physics.add.existing(block, true);
      this.surfaces.push({ spec, block });
    }

    const input = new KeyboardInputAdapter(this);
    this.player = new Player(this, L.spawn.x, L.spawn.y, input, { mobilityV2: true, hdCharacterBenchmark: true });
    this.player.setDepth(50);
    for (const { block } of this.surfaces) this.physics.add.collider(this.player, block);
    this.player.setWallContactProvider(() => this.resolveWallContact());

    this.cameras.main.startFollow(this.player, true, 0.09, 0.08);
    this.cameras.main.setDeadzone(220, 170);

    this.hud = this.add.text(18, 18, '', {
      fontFamily: 'monospace', fontSize: '14px', color: '#e7c493', backgroundColor: '#090807bb', padding: { x: 7, y: 5 },
    }).setScrollFactor(0).setDepth(100);

    this.prompt = this.add.text(480, 470,
      resolveMobilityTutorial(this.player.x, this.player.y), {
        fontFamily: 'monospace', fontSize: '12px', color: '#c6aa85', backgroundColor: '#090807cc', padding: { x: 8, y: 6 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.add.text(L.goal.x, L.goal.y - 18, 'TOPO', {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffb45e',
    }).setOrigin(0.5).setDepth(20);
  }

  update(time: number, delta: number): void {
    this.player.updatePlayer(time, delta);
    if (this.player.y > MOBILITY_LAB_V2.height - 8) this.player.requestRespawn();

    this.prompt.setText(resolveMobilityTutorial(this.player.x, this.player.y));
    const contact = this.resolveWallContact();
    const side = contact.touchingLeft ? 'L' : contact.touchingRight ? 'R' : '—';
    const climb = contact.surface ?? '—';
    this.hud.setText(`MOBILITY LAB V2   ${this.player.state}   ASAS ${this.player.flapsRemaining}/2   PAREDE ${side} ${climb}`);

    const vy = (this.player.body as any)?.velocity?.y ?? 0;
    const yBias = this.player.state === 'WALL_CLIMB' ? -70 : vy > 170 ? 55 : 0;
    this.cameras.main.setFollowOffset(-this.player.facing * 56, yBias);
  }

  private resolveWallContact(): WallContact {
    const body = this.player.body as any;
    return resolveWallContactFromGeometry(
      {
        left: Number(body?.left ?? (this.player.x - 15)),
        right: Number(body?.right ?? (this.player.x + 15)),
        top: Number(body?.top ?? (this.player.y - 18)),
        bottom: Number(body?.bottom ?? this.player.y),
      },
      MOBILITY_LAB_V2.surfaces,
      7,
    );
  }
}
