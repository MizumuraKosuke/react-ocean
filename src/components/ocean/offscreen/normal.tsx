import { useMemo } from 'react'
import { createPortal } from '@react-three/fiber'
import { Uniform } from 'three'
import glslify from 'glslify'

import vert from './fullscreen.vert'
import frag from './normal.frag'

import OceanCtx from '../ocean.context'

import { positionBuffer } from '../data-array'

import { RESOLUTION, INITIAL_SIZE } from '../../../constants'

const Normal = () => {
  const { normalScene, displacementRender } = OceanCtx.useContainer()

  const uniforms = useMemo(() => {
    return {
      u_resolution: new Uniform(RESOLUTION),
      u_size: new Uniform(INITIAL_SIZE),
      u_displacementMap: new Uniform(displacementRender.current.texture),
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
                array={new Uint16Array([ 0, 2, 1, 1, 2, 3 ])}
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
              uniforms={uniforms}
              vertexShader={glslify(vert)}
              fragmentShader={glslify(frag)}
            />
          </mesh>,
          normalScene,
        )
      }
    </>
  )
}

export default Normal
