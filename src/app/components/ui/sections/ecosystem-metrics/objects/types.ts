export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CardRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  card: CardRect;
  time: number;
  hovered: boolean;
  /** 0-1 hover transition */
  hoverT: number;
}

export interface Object3DRenderer {
  init?: () => void;
  render: (rc: RenderContext) => void;
}
