import { Uniform, DataTexture, RGBAFormat, NearestFilter } from 'three'
import { createPortal } from '@react-three/fiber'
import glslify from 'glslify'

import CanvasCtx from '../canvas.context'
import {
  RESOLUTION,
  INITIAL_SIZE,
  indexBuffer,
  positionBuffer,
} from '../../constants'

import vert from '../../glsl/fullscreen.vert'
import frag from '../../glsl/phase.frag'
import { useMemo } from 'react'

const phaseArray = new Float32Array(RESOLUTION * RESOLUTION * 4)
for (let i = 0; i < RESOLUTION; i += 1) {
  for (let j = 0; j < RESOLUTION; j += 1) {
    phaseArray[i * RESOLUTION * 4 + j * 4] = Math.random() * 2.0 * Math.PI +2000
    phaseArray[i * RESOLUTION * 4 + j * 4 + 1] = 0
    phaseArray[i * RESOLUTION * 4 + j * 4 + 2] = 0
    phaseArray[i * RESOLUTION * 4 + j * 4 + 3] = 0
  }
}

const PhaseFbo = () => {
  const {
    phaseMaterial,
    phaseScene,
  } = CanvasCtx.useContainer()

  const uniforms = useMemo(() => {
    const texture = new DataTexture(phaseArray, RESOLUTION, RESOLUTION, RGBAFormat)
    texture.minFilter = NearestFilter
    texture.magFilter = NearestFilter
    return {
      u_resolution: new Uniform(RESOLUTION),
      u_size: new Uniform(INITIAL_SIZE),
      u_deltaTime: new Uniform(0),
      u_phases: new Uniform(texture),
    }
  }, [])

  return (
    <>
      {
        createPortal(
          (
            <mesh position={[ 0, 0, 0 ]} scale={1}>
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
              </bufferGeometry>
              <shaderMaterial
                ref={phaseMaterial}
                uniforms={uniforms}
                vertexShader={glslify(vert)}
                fragmentShader={glslify(frag)}
              />
            </mesh>
          ),
          phaseScene,
        )
      }
    </>
  )
}

export default PhaseFbo
