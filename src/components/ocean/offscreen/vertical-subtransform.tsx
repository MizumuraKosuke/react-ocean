import { useMemo } from 'react'
import { createPortal } from '@react-three/fiber'
import { Uniform } from 'three'
import glslify from 'glslify'

import vert from './fullscreen.vert'
import frag from './stockham-fft.frag'

import OceanCtx from '../ocean.context'

import { positionBuffer } from '../data-array'

import { RESOLUTION } from '../../../constants'

const VerticalSubtransform = () => {
  const { vSubtransScene, spectrumRender } = OceanCtx.useContainer()

  const uniforms = useMemo(() => {
    return {
      u_transformSize: new Uniform(RESOLUTION),
      u_subtransformSize: new Uniform(0),
      u_input: new Uniform(spectrumRender.current.texture),
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
              uniforms={uniforms}
              vertexShader={glslify(vert)}
              fragmentShader={glslify(frag)}
            />
          </mesh>,
          vSubtransScene,
        )
      }
    </>
  )
}

export default VerticalSubtransform
