import { Uniform } from 'three'
import { createPortal } from '@react-three/fiber'
import glslify from 'glslify'

import CanvasCtx from '../canvas.context'
import {
  RESOLUTION,
  indexBuffer,
  positionBuffer,
} from '../canvas.constants'

import vert from './fullscreen.vert'
import frag from './stockham-fft.frag'

const HorizontalSubtransformFbo = () => {
  const {
    hSubtransMaterial,
    hSubtransScene,
    hSubtransCamera,
    spectrumTarget,
  } = CanvasCtx.useContainer()

  return (
    <>
      {
        createPortal(
          (
            <>
              <orthographicCamera
                ref={hSubtransCamera}
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
                  ref={hSubtransMaterial}
                  uniforms={
                    {
                      u_transformSize: new Uniform(RESOLUTION),
                      u_subtransformSize: new Uniform(0),
                      u_input: new Uniform(spectrumTarget.texture),
                    }
                  }
                  vertexShader={glslify(vert)}
                  fragmentShader={`#define HORIZONTAL \n${glslify(frag)}`}
                />
              </mesh>
            </>
          ),
          hSubtransScene,
        )
      }
    </>
  )
}

export default HorizontalSubtransformFbo
