export type ThreatChaseState = 'DORMANT' | 'WARNING' | 'CHASING' | 'ESCAPED' | 'CAUGHT';

export type ThreatChaseConfig = {
  triggerX: number;
  warningDurationMs: number;
  threatStartX: number;
  threatSpeed: number;
  catchDistance: number;
  escapeX: number;
};

export type ThreatChaseUpdate = {
  triggeredNow: boolean;
  chaseStartedNow: boolean;
  escapedNow: boolean;
  caughtNow: boolean;
};

export class ThreatChaseController {
  state: ThreatChaseState = 'DORMANT';
  threatX: number;

  private warningStartedAt = Number.NEGATIVE_INFINITY;
  private chaseStartedAt = Number.NEGATIVE_INFINITY;

  constructor(readonly config: ThreatChaseConfig) {
    this.threatX = config.threatStartX;
  }

  update(nowMs: number, playerX: number): ThreatChaseUpdate {
    const result: ThreatChaseUpdate = {
      triggeredNow: false,
      chaseStartedNow: false,
      escapedNow: false,
      caughtNow: false,
    };

    if (this.state === 'ESCAPED' || this.state === 'CAUGHT') return result;

    if (this.state === 'DORMANT' && playerX >= this.config.triggerX) {
      this.state = 'WARNING';
      this.warningStartedAt = nowMs;
      result.triggeredNow = true;
    }

    if (this.state === 'WARNING' && nowMs - this.warningStartedAt >= this.config.warningDurationMs) {
      this.state = 'CHASING';
      this.chaseStartedAt = this.warningStartedAt + this.config.warningDurationMs;
      result.chaseStartedNow = true;
    }

    if (this.state === 'CHASING') {
      const elapsedMs = Math.max(0, nowMs - this.chaseStartedAt);
      this.threatX = this.config.threatStartX + this.config.threatSpeed * (elapsedMs / 1000);

      if (playerX >= this.config.escapeX) {
        this.state = 'ESCAPED';
        result.escapedNow = true;
        return result;
      }

      if (playerX - this.threatX <= this.config.catchDistance) {
        this.state = 'CAUGHT';
        result.caughtNow = true;
      }
    }

    return result;
  }

  reset(): void {
    this.state = 'DORMANT';
    this.threatX = this.config.threatStartX;
    this.warningStartedAt = Number.NEGATIVE_INFINITY;
    this.chaseStartedAt = Number.NEGATIVE_INFINITY;
  }
}
