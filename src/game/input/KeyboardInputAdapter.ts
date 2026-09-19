import type { InputController, PlayerIntent } from './InputController.js';

export class KeyboardInputAdapter implements InputController {
  private readonly keys: Record<string, any>;
  private previousJump = false;
  private previousDodge = false;
  private previousRespawn = false;

  constructor(scene: any) {
    this.keys = scene.input.keyboard.addKeys({
      left: 'A', right: 'D', leftArrow: 'LEFT', rightArrow: 'RIGHT',
      up: 'W', down: 'S', upArrow: 'UP', downArrow: 'DOWN',
      run: 'SHIFT', jump: 'SPACE', dodge: 'CTRL', dodgeAlt: 'K', respawn: 'R',
    });
  }

  sample(): PlayerIntent {
    const left = this.keys.left.isDown || this.keys.leftArrow.isDown;
    const right = this.keys.right.isDown || this.keys.rightArrow.isDown;
    const up = this.keys.up.isDown || this.keys.upArrow.isDown;
    const down = this.keys.down.isDown || this.keys.downArrow.isDown;
    const jumpHeld = this.keys.jump.isDown;
    const dodgeHeld = this.keys.dodge.isDown || this.keys.dodgeAlt.isDown;
    const respawnHeld = this.keys.respawn.isDown;

    const intent: PlayerIntent = {
      moveX: left === right ? 0 : left ? -1 : 1,
      moveY: up === down ? 0 : up ? -1 : 1,
      run: this.keys.run.isDown,
      jumpHeld,
      jumpPressed: jumpHeld && !this.previousJump,
      jumpReleased: !jumpHeld && this.previousJump,
      dodgePressed: dodgeHeld && !this.previousDodge,
      respawnPressed: respawnHeld && !this.previousRespawn,
    };

    this.previousJump = jumpHeld;
    this.previousDodge = dodgeHeld;
    this.previousRespawn = respawnHeld;
    return intent;
  }
}
