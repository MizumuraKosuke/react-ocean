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

type Props = {
  isHorizontal?: boolean
}

const HorizontalSubtransformFbo = ({ isHorizontal = false }: Props) => {
  const {
    hSubtransMaterial,
    hSubtransScene,
    vSubtransMaterial,
    vSubtransScene,
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
                ref={isHorizontal ? hSubtransMaterial : vSubtransMaterial}
                uniforms={
                  {
                    u_transformSize: new Uniform(RESOLUTION),
                    u_subtransformSize: new Uniform(0),
                    u_input: new Uniform(null),
                  }
                }
                vertexShader={glslify(vert)}
                fragmentShader={`${isHorizontal ? '#define HORIZONTAL \n' : ''}${glslify(frag)}`}
              />
            </mesh>
          ),
          isHorizontal ? hSubtransScene : vSubtransScene,
        )
      }
    </>
  )
}

export default HorizontalSubtransformFbo
