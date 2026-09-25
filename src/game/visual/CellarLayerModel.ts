export type CellarLayer = Readonly<{
  id: string;
  depth: number;
  parallax: number;
  ownsCollision: boolean;
}>;

export const CELLAR_LAYERS = Object.freeze({
  farDarkness: Object.freeze({ id: 'far-darkness', depth: 0, parallax: 0.18, ownsCollision: false }),
  rearArchitecture: Object.freeze({ id: 'rear-architecture', depth: 10, parallax: 0.55, ownsCollision: false }),
  gameplayPlane: Object.freeze({ id: 'gameplay-plane', depth: 40, parallax: 1, ownsCollision: true }),
  characterPlane: Object.freeze({ id: 'character-plane', depth: 51, parallax: 1, ownsCollision: false }),
  nearForeground: Object.freeze({ id: 'near-foreground', depth: 70, parallax: 1.12, ownsCollision: false }),
  presentation: Object.freeze({ id: 'presentation', depth: 100, parallax: 0, ownsCollision: false }),
} satisfies Record<string, CellarLayer>);
