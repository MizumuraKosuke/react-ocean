import { Uniform } from 'three'
import { createPortal } from '@react-three/fiber'
import glslify from 'glslify'

import CanvasCtx from '../canvas.context'
import {
  RESOLUTION,
  INITIAL_SIZE,
  INITIAL_CHOPPINESS,
  indexBuffer,
  positionBuffer,
} from '../canvas.constants'

import vert from './fullscreen.vert'
import frag from './phase.frag'

const PhaseFbo = () => {
  const {
    phaseMaterial,
    phaseScene,
    phaseCamera,
    pongPhaseTarget,
  } = CanvasCtx.useContainer()

  return (
    <>
      {
        createPortal(
          (
            <>
              <orthographicCamera
                ref={phaseCamera}
                position={[ 0, 0, 1 ]}
                args={[ -1, 1, 1, -1, 0.01, 100 ]}
              />
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
                  uniforms={
                    {
                      u_resolution: new Uniform(RESOLUTION),
                      u_size: new Uniform(INITIAL_SIZE),
                      u_deltaTime: new Uniform(0),
                      u_phases: new Uniform(pongPhaseTarget.texture),
                      u_choppiness: new Uniform(INITIAL_CHOPPINESS),
                    }
                  }
                  vertexShader={glslify(vert)}
                  fragmentShader={glslify(frag)}
                />
              </mesh>
            </>
          ),
          phaseScene,
        )
      }
    </>
  )
}

export default PhaseFbo
