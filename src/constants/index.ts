export const debugMode = true

export const RESOLUTION = 512
export const INITIAL_SIZE = 200 // 250
export const INITIAL_CHOPPINESS = 1
export const GEOMETRY_RESOLUTION = 256 / 2
export const GEOMETRY_SIZE = 80 * 2

export const indexBuffer = new Uint16Array([
  0, 2, 1,
  1, 2, 3,
])
export const positionBuffer = new Float32Array([
  -1.0, -1.0, 0.0,
  -1.0, 1.0, 0.0,
  1.0, -1.0, 0.0,
  1.0, 1.0, 0.0,
])