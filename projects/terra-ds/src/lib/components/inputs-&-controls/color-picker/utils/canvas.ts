export interface CanvasCoords {
  x: number;
  y: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getCanvasCoords(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): CanvasCoords {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) * canvas.width) / rect.width;
  const y = ((clientY - rect.top) * canvas.height) / rect.height;
  return {
    x: clamp(x, 0, canvas.width - 1),
    y: clamp(y, 0, canvas.height - 1),
  };
}

export function createOffscreen(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function rgbaString(r: number, g: number, b: number, a = 1): string {
  return `rgba(${r},${g},${b},${a})`;
}
