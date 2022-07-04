import InitialSpectrum from './initial-spectrum'
import Phase from './phase'
import Spectrum from './spectrum'
import HorizontalSubtransform from './horizontal-subtransform'
import VerticalSubtransform from './vertical-subtransform'
import Normal from './normal'

import FboHelpers from './helpers'

import { debugMode } from '../canvas.constants'

const Fbo = () => (
  <>
    <InitialSpectrum />
    <Spectrum />
    <Phase />
    <HorizontalSubtransform />
    <VerticalSubtransform />
    <Normal />
    {
      debugMode && <FboHelpers />
    }
  </>
)

export default Fbo