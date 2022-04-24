import { RESOLUTION, GEOMETRY_RESOLUTION, GEOMETRY_SIZE, GEOMETRY_ORIGIN } from '../../constants'

export const oceanData: number[] = []
export const oceanIndices: number[] = []

for (let zIndex = 0; zIndex < GEOMETRY_RESOLUTION; zIndex += 1) {
  for (let xIndex = 0; xIndex < GEOMETRY_RESOLUTION; xIndex += 1) {
    oceanData.push((xIndex * GEOMETRY_SIZE) / (GEOMETRY_RESOLUTION - 1) + GEOMETRY_ORIGIN[0])
    oceanData.push((0.0))
    oceanData.push((zIndex * GEOMETRY_SIZE) / (GEOMETRY_RESOLUTION - 1) + GEOMETRY_ORIGIN[1])
    oceanData.push(xIndex / (GEOMETRY_RESOLUTION - 1))
    oceanData.push(zIndex / (GEOMETRY_RESOLUTION - 1))

    if (zIndex !== GEOMETRY_RESOLUTION && xIndex !== GEOMETRY_RESOLUTION) {
      const topLeft = zIndex * GEOMETRY_RESOLUTION + xIndex
      const topRight = topLeft + 1
      const bottomLeft = topLeft + GEOMETRY_RESOLUTION
      const bottomRight = bottomLeft + 1

      oceanIndices.push(topLeft)
      oceanIndices.push(bottomLeft)
      oceanIndices.push(bottomRight)
      oceanIndices.push(bottomRight)
      oceanIndices.push(topRight)
      oceanIndices.push(topLeft)
    }
  }
}

export const phaseArray = new Float32Array(RESOLUTION * RESOLUTION * 4)
for (let i = 0; i < RESOLUTION; i += 1) {
  for (let j = 0; j < RESOLUTION; j += 1) {
    phaseArray[i * RESOLUTION * 4 + j * 4] = Math.random() * 2.0 * Math.PI
    phaseArray[i * RESOLUTION * 4 + j * 4 + 1] = 0
    phaseArray[i * RESOLUTION * 4 + j * 4 + 2] = 0
    phaseArray[i * RESOLUTION * 4 + j * 4 + 3] = 0
  }
}

export const positionBuffer = new Float32Array([ -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0 ])