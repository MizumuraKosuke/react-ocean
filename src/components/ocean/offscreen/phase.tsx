import { useMemo } from 'react'
import { createPortal } from '@react-three/fiber'
import { Uniform } from 'three'
import glslify from 'glslify'

import vert from './fullscreen.vert'
import frag from './phase.frag'

import OceanCtx from '../ocean.context'

import { positionBuffer } from '../data-array'

import { RESOLUTION, INITIAL_CHOPPINESS, INITIAL_SIZE } from '../../../constants'

const Phase = () => {
  const {
    phaseScene,
    phaseMaterialRef,
    pingPhaseRender,
  } = OceanCtx.useContainer()

  const uniforms = useMemo(() => {
    return {
      u_resolution: new Uniform(RESOLUTION),
      u_size: new Uniform(INITIAL_SIZE),
      u_deltaTime: new Uniform(0),
      u_phases: new Uniform(pingPhaseRender.current.texture),
      u_choppiness: new Uniform(INITIAL_CHOPPINESS),
    }
  }, [])
  
  return (
    <>
      {
        createPortal(
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="index"
                array={new Uint16Array([ 0, 2, 1, 2, 3, 1 ])}
                itemSize={1}
                count={6}
              />
              <bufferAttribute
                attachObject={[ 'attributes', 'a_position' ]}
                array={positionBuffer}
                itemSize={2}
                count={positionBuffer.length / 2}
                normalized={false}
              />
            </bufferGeometry>
            <rawShaderMaterial
              ref={phaseMaterialRef}
              uniforms={uniforms}
              vertexShader={glslify(vert)}
              fragmentShader={glslify(frag)}
            />
          </mesh>,
          phaseScene,
        )
      }
    </>
  )
}

export default Phase
