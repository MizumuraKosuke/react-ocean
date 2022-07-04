import { Uniform } from 'three'
import { createPortal } from '@react-three/fiber'
import glslify from 'glslify'

import CanvasCtx from '../canvas.context'
import { RESOLUTION, INITIAL_SIZE, INITIAL_CHOPPINESS, indexBuffer, positionBuffer } from '../../constants'

import vert from '../../glsl/fullscreen.vert'
import frag from '../../glsl/spectrum.frag'

const SpectrumFbo = () => {
  const {
    spectrumMaterial,
    initialSpectrumTarget,
    pingPhaseTarget,
    spectrumScene,
  } = CanvasCtx.useContainer()

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
                ref={spectrumMaterial}
                uniforms={
                  {
                    u_resolution: new Uniform(RESOLUTION),
                    u_size: new Uniform(INITIAL_SIZE),
                    u_initialSpectrum: new Uniform(initialSpectrumTarget.texture),
                    u_phases: new Uniform(pingPhaseTarget.texture),
                    u_choppiness: new Uniform(INITIAL_CHOPPINESS),
                  }
                }
                vertexShader={glslify(vert)}
                fragmentShader={glslify(frag)}
              />
            </mesh>
          ),
          spectrumScene,
        )
      }
    </>
  )
}

export default SpectrumFbo