import FboHelper from 'src/components/fbo.helper'

import CanvasCtx from '../canvas.context'

const FboHelpers = () => {
  const {
    initialSpectrumTarget,
    pingPhaseTarget,
    pongPhaseTarget,
    spectrumTarget,
    pingTransTarget,
    pongTransTarget,
    displacementTarget,
    normalTarget,
  } = CanvasCtx.useContainer()
  return (
    <>
      <FboHelper position={[ -2, 5, 0 ]} texture={initialSpectrumTarget.texture} />
      <FboHelper position={[ -2, 3, 0 ]} texture={pingPhaseTarget.texture} />
      <FboHelper position={[ -2, 1, 0 ]} texture={pongPhaseTarget.texture} />
      <FboHelper position={[ 0, 5, 0 ]} texture={spectrumTarget.texture} />
      <FboHelper position={[ 0, 3, 0 ]} texture={pingTransTarget.texture} />
      <FboHelper position={[ 0, 1, 0 ]} texture={pongTransTarget.texture} />
      <FboHelper position={[ 2, 5, 0 ]} texture={displacementTarget.texture} />
      <FboHelper position={[ 2, 3, 0 ]} texture={normalTarget.texture} />
    </>
  )
}

export default FboHelpers