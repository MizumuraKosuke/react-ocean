import InitialSpectrum from './offscreen/initial-spectrum'
import Spectrum from './offscreen/spectrum'
import Phase from './offscreen/phase'
import HorizontalSubtransform from './offscreen/horizontal-subtransform'
import VerticalSubtransform from './offscreen/vertical-subtransform'
import Normal from './offscreen/normal'

import OceanCtx from './ocean.context'

import { RESOLUTION } from '../../constants'

const Ocean = () => {
  const { displacementRender } = OceanCtx.useContainer()

  return (
    <>
      <InitialSpectrum />
      <Spectrum />
      <Phase />
      <HorizontalSubtransform />
      <VerticalSubtransform />
      <Normal />
      <mesh>
        <planeBufferGeometry args={[ RESOLUTION, RESOLUTION, 2, 2 ]} />
        <meshPhongMaterial
          map={displacementRender.current.texture}
        />
      </mesh>
    </>
  )
}

export default Ocean