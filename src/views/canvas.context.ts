import { useMemo, useRef } from 'react'
import { createContainer } from 'unstated-next'
import {
  Scene,
  WebGLRenderTarget,
  RepeatWrapping,
  ClampToEdgeWrapping,
  NearestFilter,
  LinearFilter,
  RGBAFormat,
  FloatType,
  HalfFloatType,
  Camera,
  Clock,
  DataTexture,
} from 'three'
import { useFrame } from '@react-three/fiber'

import { RESOLUTION } from '../constants'

const phaseArray = new Float32Array(RESOLUTION * RESOLUTION * 4)
for (let i = 0; i < RESOLUTION; i += 1) {
  for (let j = 0; j < RESOLUTION; j += 1) {
    phaseArray[i * RESOLUTION * 4 + j * 4] = Math.random() * 2 * Math.PI
  }
}

const CanvasCtx = createContainer(() => {
  const inited = useRef(false)
  const isPing = useRef(false)
  const clock = useRef(new Clock())

  const texture = useMemo(() => {
    const dataTex = new DataTexture(
      phaseArray,
      RESOLUTION,
      RESOLUTION,
      RGBAFormat,
      FloatType,
    )
    dataTex.magFilter = NearestFilter
    dataTex.minFilter = NearestFilter
    dataTex.needsUpdate = true
    return dataTex
  }, [])

  const spectrumMaterial = useRef<THREE.RawShaderMaterial>(null)
  const phaseMaterial = useRef<THREE.RawShaderMaterial>(null)
  const hSubtransMaterial = useRef<THREE.RawShaderMaterial>(null)
  const vSubtransMaterial = useRef<THREE.RawShaderMaterial>(null)
  const normalMaterial = useRef<THREE.RawShaderMaterial>(null)
  const oceanMaterial = useRef<THREE.RawShaderMaterial>(null)

  const initialSpectrumCamera = useMemo(() => new Camera(), [])
  const spectrumCamera = useMemo(() => new Camera(), [])
  const phaseCamera = useMemo(() => new Camera(), [])
  const hSubtransCamera = useMemo(() => new Camera(), [])
  const vSubtransCamera = useMemo(() => new Camera(), [])
  const normalCamera = useMemo(() => new Camera(), [])

  const initialSpectrumScene = useMemo(() => new Scene(), [])
  const spectrumScene = useMemo(() => new Scene(), [])
  const phaseScene = useMemo(() => new Scene(), [])
  const hSubtransScene = useMemo(() => new Scene(), [])
  const vSubtransScene = useMemo(() => new Scene(), [])
  const normalScene = useMemo(() => new Scene(), [])

  const initialSpectrumTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: RepeatWrapping,
      wrapT: RepeatWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])

  const spectrumTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])

  const pingPhaseTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])

  const pongPhaseTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])

  const pingTransTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])

  const pongTransTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])

  const displacementTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])

  const normalTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION, RESOLUTION,
    {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: HalfFloatType,
    },
  ), [])


  useFrame(({ gl, camera }) => {
    if (
      !phaseMaterial.current
      || !spectrumMaterial.current
      || !hSubtransMaterial.current
      || !vSubtransMaterial.current
      || !normalMaterial.current
      || !oceanMaterial.current
    ) {
      return
    }

    if (!inited.current) {
      gl.setRenderTarget(initialSpectrumTarget)
      gl.render(initialSpectrumScene, initialSpectrumCamera)
      gl.setRenderTarget(null)

      phaseMaterial.current.uniforms.u_phases.value = texture
      texture.dispose()
    
      spectrumMaterial.current.uniforms.u_initialSpectrum.value = initialSpectrumTarget.texture

      inited.current = true
    }
    else {
      phaseMaterial.current.uniforms.u_phases.value = isPing.current
        ? pongPhaseTarget.texture
        : pingPhaseTarget.texture
    }

    phaseMaterial.current.uniforms.u_deltaTime.value = clock.current.getDelta()
    gl.setRenderTarget(isPing.current ? pingPhaseTarget : pongPhaseTarget)
    gl.render(phaseScene, phaseCamera)
    gl.setRenderTarget(null)

    spectrumMaterial.current.uniforms.u_phases.value = isPing.current
      ? pingPhaseTarget.texture
      : pongPhaseTarget.texture
    gl.setRenderTarget(spectrumTarget)
    gl.render(spectrumScene, spectrumCamera)
    gl.setRenderTarget(null)

    const iterations = Math.log2(RESOLUTION) * 2
    let isHorizontal = true
    for (let i = 0; i < iterations; i += 1) {
      if (i === 0) {
        (isHorizontal ? hSubtransMaterial.current : vSubtransMaterial.current)
          .uniforms.u_input.value = spectrumTarget.texture
        gl.setRenderTarget(pingTransTarget)
      }
      else if (i === iterations - 1) {
        (isHorizontal ? hSubtransMaterial.current : vSubtransMaterial.current)
          .uniforms.u_input.value = pingTransTarget.texture
        gl.setRenderTarget(displacementTarget)
      }
      else if (i % 2 === 1) {
        (isHorizontal ? hSubtransMaterial.current : vSubtransMaterial.current)
          .uniforms.u_input.value = pingTransTarget.texture
        gl.setRenderTarget(pongTransTarget)
      }
      else {
        (isHorizontal ? hSubtransMaterial.current : vSubtransMaterial.current)
          .uniforms.u_input.value = pongTransTarget.texture
        gl.setRenderTarget(pingTransTarget)
      }

      if (i === iterations / 2) {
        isHorizontal = false
      }
      (isHorizontal ? hSubtransMaterial.current : vSubtransMaterial.current)
        .uniforms.u_subtransformSize.value = Math.pow(2,(i % (iterations / 2)) + 1)

      gl.render(
        isHorizontal ? hSubtransScene : vSubtransScene,
        isHorizontal ? hSubtransCamera : vSubtransCamera,
      )
      gl.setRenderTarget(null)
    }

    normalMaterial.current.uniforms.u_displacementMap.value = displacementTarget.texture
    gl.setRenderTarget(normalTarget)
    gl.render(normalScene, normalCamera)
    gl.setRenderTarget(null)

    oceanMaterial.current.uniforms.u_displacementMap.value = displacementTarget.texture
    oceanMaterial.current.uniforms.u_normalMap.value = normalTarget.texture
    oceanMaterial.current.uniforms.u_cameraPosition.value = camera.position

    isPing.current = !isPing.current
  })

  return {
    spectrumMaterial,
    phaseMaterial,
    hSubtransMaterial,
    vSubtransMaterial,
    normalMaterial,
    oceanMaterial,
    initialSpectrumScene,
    spectrumScene,
    phaseScene,
    hSubtransScene,
    vSubtransScene,
    normalScene,
    initialSpectrumTarget,
    spectrumTarget,
    pingPhaseTarget,
    pongPhaseTarget,
    pingTransTarget,
    pongTransTarget,
    displacementTarget,
    normalTarget,
  }
})

export default CanvasCtx
