export type AxisDirection = -1 | 0 | 1;

export type PlayerIntent = {
  moveX: AxisDirection;
  run: boolean;
  jumpHeld: boolean;
  jumpPressed: boolean;
  jumpReleased: boolean;
  dodgePressed: boolean;
  respawnPressed: boolean;
};

export interface InputController {
  sample(): PlayerIntent;
}
