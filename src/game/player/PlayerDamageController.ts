export type DamageResult = 'IGNORED' | 'HURT' | 'DEATH';

export class PlayerDamageController {
  readonly maxHp = 3;
  readonly hurtLockMs = 220;
  readonly protectionMs = 700;

  hp = this.maxHp;
  dead = false;
  respawning = false;

  private hurtUntil = Number.NEGATIVE_INFINITY;
  private protectedUntil = Number.NEGATIVE_INFINITY;

  damage(nowMs: number): DamageResult {
    if (this.dead || this.respawning || this.isProtected(nowMs)) return 'IGNORED';

    this.hp -= 1;
    this.hurtUntil = nowMs + this.hurtLockMs;
    this.protectedUntil = nowMs + this.protectionMs;

    if (this.hp <= 0) {
      this.dead = true;
      return 'DEATH';
    }

    return 'HURT';
  }

  kill(nowMs: number): DamageResult {
    if (this.dead || this.respawning) return 'IGNORED';
    this.hp = 0;
    this.dead = true;
    this.hurtUntil = nowMs;
    this.protectedUntil = nowMs;
    return 'DEATH';
  }

  isHurt(nowMs: number): boolean {
    return !this.dead && !this.respawning && nowMs < this.hurtUntil;
  }

  isProtected(nowMs: number): boolean {
    return nowMs < this.protectedUntil;
  }

  tick(_nowMs: number): void {
    // Time windows are queried directly from timestamps; no mutable tick bookkeeping is required.
  }

  beginRespawn(): void {
    this.respawning = true;
  }

  completeRespawn(): void {
    this.hp = this.maxHp;
    this.dead = false;
    this.respawning = false;
    this.hurtUntil = Number.NEGATIVE_INFINITY;
    this.protectedUntil = Number.NEGATIVE_INFINITY;
  }
}
