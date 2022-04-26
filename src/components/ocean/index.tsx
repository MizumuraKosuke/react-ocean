import { useMemo } from 'react'
import { Uniform } from 'three'
import glslify from 'glslify'

import vert from './ocean.vert'
import frag from './ocean.frag'
import InitialSpectrum from './offscreen/initial-spectrum'
import Spectrum from './offscreen/spectrum'
import Phase from './offscreen/phase'
import HorizontalSubtransform from './offscreen/horizontal-subtransform'
import VerticalSubtransform from './offscreen/vertical-subtransform'
import Normal from './offscreen/normal'

import OceanCtx from './ocean.context'

import { oceanData, oceanIndices, positionBuffer } from './data-array'

import {
  INITIAL_SIZE,
  GEOMETRY_SIZE,
  OCEAN_COLOR,
  SKY_COLOR,
  SUN_DIRECTION,
  EXPOSURE,
  RESOLUTION,
} from '../../constants'

const Ocean = () => {
  const {
    oceanMaterialRef,
    displacementRender,
    normalRender,
    pingPhaseRender,
  } = OceanCtx.useContainer()

  const uniforms = useMemo(() => {
    return {
      u_size: new Uniform(INITIAL_SIZE),
      u_geometrySize: new Uniform(GEOMETRY_SIZE),
      u_oceanColor: new Uniform(OCEAN_COLOR),
      u_skyColor: new Uniform(SKY_COLOR),
      u_sunDirection: new Uniform(SUN_DIRECTION),
      u_exposure: new Uniform(EXPOSURE),
      u_displacementMap: new Uniform(displacementRender.current.texture),
      u_normalMap: new Uniform(normalRender.current.texture),
    }
  }, [])

  return (
    <>
      <InitialSpectrum />
      <Spectrum />
      <Phase />
      <HorizontalSubtransform />
      <VerticalSubtransform />
      <Normal />
      <mesh>
        {/* <planeBufferGeometry args={[ RESOLUTION, RESOLUTION, 2, 2 ]} />
        <meshPhongMaterial
          map={pingPhaseRender.current.texture}
        /> */}
        <bufferGeometry>
          <bufferAttribute
            attach="index"
            array={new Uint16Array(oceanIndices)}
            itemSize={1}
            count={oceanIndices.length}
          />
          <bufferAttribute
            attachObject={[ 'attributes', 'a_position' ]}
            array={positionBuffer}
            itemSize={3}
            count={positionBuffer.length / 3}
            normalized={false}
          />
          <bufferAttribute
            attachObject={[ 'attributes', 'a_coordinates' ]}
            array={new Float32Array(oceanData)}
            itemSize={2}
            count={positionBuffer.length / 2}
            normalized={false}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={oceanMaterialRef}
          uniforms={uniforms}
          vertexShader={glslify(vert)}
          fragmentShader={glslify(frag)}
        />
      </mesh>
    </>
  )
}

export default Ocean