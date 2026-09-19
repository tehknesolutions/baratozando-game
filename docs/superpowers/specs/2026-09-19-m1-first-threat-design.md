# BARATOZANDO — M1 First Threat Design

## Goal

Transform the M0 movement lab into the first playable suspense beat: the player crosses a trigger, receives a short dramatic warning, and must run/dodge to a safe zone while a giant predator closes in from behind.

## Player experience

The sequence should read without a tutorial paragraph:

1. Calm traversal using the M0 movement kit.
2. A giant shadow/silhouette is foreshadowed in the background.
3. Player crosses the chase trigger.
4. Camera/scene reacts and the single imperative `CORRA.` appears.
5. After a short warning, the Ancient Predator begins moving from left to right.
6. Walking is unsafe; running and clean jumps are rewarded.
7. Contact/catch kills immediately and uses the existing checkpoint/respawn path.
8. Crossing the escape line freezes the predator and marks the chase as escaped.

## Scope

Included:
- deterministic chase controller with `DORMANT`, `WARNING`, `CHASING`, `ESCAPED`, `CAUGHT`
- trigger, warning delay, threat velocity, catch distance and escape line
- reset after death/respawn
- one giant procedural silhouette; no final predator asset required
- camera shake + warning copy
- M1 scene built from the established M0 movement systems
- pure tests for chase timing, catch, escape and reset

Excluded:
- player attack
- enemy combat AI*- Adaptation Engine
- power-ups
- boss health
- inventory
- final art/audio

## Chase contract

- triggerX: 640 px
- warningDurationMs: 650 ms
- threatStartX: 260 px
- threatSpeed: 205 px/s
- catchDistance: 54 px
- escapeX: 1875 px
- player run speed remains 185 px/s

The threat is intentionally slightly faster than the player's run speed. The initial gap and finite escape distance make success possible while maintaining pressure; clean jumps and not hesitating matter.

## State rules

- `DORMANT` until playerX >= triggerX.
- Trigger transitions to `WARNING` and records warning start time.
- `WARNING` cannot catch the player.
- At warning start + 650 ms, transition to `CHASING`; threat motion begins from `threatStartX`.
- During `CHASING`, threatX is derived from elapsed chase time, not frame count.
- If playerX >= escapeX before catch resolution, state becomes `ESCAPED`.
- Otherwise, if playerX - threatX <= catchDistance, state becomes `CAUGHT`.
- `ESCAPED` and `CAUGHT` are terminal until `reset()`.
- `reset()` restores `DORMANT` and threatStartX.

## Presentation

The prototype predator is mostly black with a muted brown edge and a faint red/amber underside. It should occupy enough vertical area to feel enormous compared with the 64×64 player. The silhouette is allowed to be abstract in M1; the purpose is scale, drama and readability.

## Acceptance gate

After a fresh start, a player should understand within seconds that a major threat has appeared and that the correct response is to run. The chase must be completable without debug respawn, and a caught player must return cleanly to the pre-chase checkpoint with the threat reset.
