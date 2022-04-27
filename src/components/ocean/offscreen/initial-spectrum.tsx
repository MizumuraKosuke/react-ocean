import { useMemo } from 'react'
import { createPortal } from '@react-three/fiber'
import { Uniform, Vector2 } from 'three'
import glslify from 'glslify'

import vert from './fullscreen.vert'
import frag from './initial-spectrum.frag'

import OceanCtx from '../ocean.context'

import { positionBuffer } from '../data-array'

import { RESOLUTION, INITIAL_WIND, INITIAL_SIZE } from '../../../constants'

const InitialSpectrum = () => {
  const { initialSpecScene } = OceanCtx.useContainer()

  const uniforms = useMemo(() => {
    return {
      u_resolution: new Uniform(RESOLUTION),
      u_size: new Uniform(INITIAL_SIZE),
      u_wind: new Uniform(new Vector2(INITIAL_WIND[0], INITIAL_WIND[1])),
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
          initialSpecScene,
        )
      }
    </>
  )
}

export default InitialSpectrum
