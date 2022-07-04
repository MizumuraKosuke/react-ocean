import { Uniform } from 'three'
import glslify from 'glslify'

import InitialSpectrum from './fbo/initial-spectrum'
import Phase from './fbo/phase'
import Spectrum from './fbo/spectrum'
import HorizontalSubtransform from './fbo/horizontal-subtransform'
import VerticalSubtransform from './fbo/vertical-subtransform'
import Normal from './fbo/normal'
import FboHelpers from './fbo/helpers'

import CanvasCtx from './canvas.context'

import { debugMode, INITIAL_SIZE } from '../constants'

import vert from '../glsl/ocean.vert'
import frag from '../glsl/ocean.frag'

const GEOMETRY_RESOLUTION = 256 / 2
const GEOMETRY_SIZE = 80 * 2

const positionData = []
const coordinateData = []
const indexData = []
for (let zIndex = 0; zIndex < GEOMETRY_RESOLUTION; zIndex += 1) {
  for (let xIndex = 0; xIndex < GEOMETRY_RESOLUTION; xIndex += 1) {
    positionData.push((xIndex * GEOMETRY_SIZE) / (GEOMETRY_RESOLUTION - 1) - GEOMETRY_SIZE / 2)
    positionData.push((0.0))
    positionData.push((zIndex * GEOMETRY_SIZE) / (GEOMETRY_RESOLUTION - 1) - GEOMETRY_SIZE / 2)
    
    coordinateData.push(xIndex / (GEOMETRY_RESOLUTION - 1))
    coordinateData.push(zIndex / (GEOMETRY_RESOLUTION - 1))

    if (zIndex >= GEOMETRY_RESOLUTION - 1 || xIndex >= GEOMETRY_RESOLUTION - 1) {
      continue
    }

    const topLeft = zIndex * GEOMETRY_RESOLUTION + xIndex
    const topRight = topLeft + 1
    const bottomLeft = topLeft + GEOMETRY_RESOLUTION
    const bottomRight = bottomLeft + 1

    indexData.push(topLeft)
    indexData.push(bottomLeft)
    indexData.push(bottomRight)
    indexData.push(bottomRight)
    indexData.push(topRight)
    indexData.push(topLeft)
  }
}
const positionBuffer = new Float32Array(positionData)
const coordinateBuffer = new Float32Array(coordinateData)
const indexBuffer = new Uint16Array(indexData)

const Ocean = () => {
  const {
    oceanMaterial,
    displacementTarget,
    normalTarget,
  } = CanvasCtx.useContainer()

  return (
    <>
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="index"
            array={indexBuffer}
            itemSize={1}
            count={indexBuffer.length / 1}
          />
          <bufferAttribute
            attach="attributes-position"
            array={positionBuffer}
            itemSize={3}
            count={positionBuffer.length / 3}
          />
          <bufferAttribute
            attach="attributes-coordinates"
            array={coordinateBuffer}
            itemSize={2}
            count={coordinateBuffer.length / 2}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={oceanMaterial}
          uniforms={
            {
              u_size: new Uniform(INITIAL_SIZE),
              u_geometrySize: new Uniform(GEOMETRY_SIZE),
              u_displacementMap: new Uniform(displacementTarget.texture),
              u_normalMap: new Uniform(normalTarget.texture),
              u_oceanColor: new Uniform([ 0.004, 0.016, 0.047 ]),
              u_skyColor: new Uniform([ 3.2, 9.6, 12.8 ]),
              u_sunDirection: new Uniform([ -1, 1, 1 ]),
              u_exposure: new Uniform(0.35),
              u_cameraPosition: new Uniform([ 0, 0, 0 ]),
            }
          }
          vertexShader={glslify(vert)}
          fragmentShader={glslify(frag)}
          // wireframe
        />
      </mesh>
      <InitialSpectrum />
      <Spectrum />
      <Phase />
      <HorizontalSubtransform />
      <VerticalSubtransform />
      <Normal />
      {
        debugMode && <FboHelpers />
      }
    </>
  )
}

export default Ocean
