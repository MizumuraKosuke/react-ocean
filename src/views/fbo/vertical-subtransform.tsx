import { Uniform } from 'three'
import { createPortal } from '@react-three/fiber'
import glslify from 'glslify'

import CanvasCtx from '../canvas.context'
import {
  RESOLUTION,
  indexBuffer,
  positionBuffer,
} from '../../constants'

import vert from '../../glsl/fullscreen.vert'
import frag from '../../glsl/stockham-fft.frag'

const VerticalSubtransformFbo = () => {
  const {
    vSubtransMaterial,
    vSubtransScene,
    spectrumTarget,
  } = CanvasCtx.useContainer()

  return (
    <>
      {
        createPortal(
          (
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
              </bufferGeometry>
              <shaderMaterial
                ref={vSubtransMaterial}
                uniforms={
                  {
                    u_transformSize: new Uniform(RESOLUTION),
                    u_subtransformSize: new Uniform(0),
                    u_input: new Uniform(spectrumTarget.texture),
                  }
                }
                vertexShader={glslify(vert)}
                fragmentShader={glslify(frag)}
              />
            </mesh>
          ),
          vSubtransScene,
        )
      }
    </>
  )
}

export default VerticalSubtransformFbo
