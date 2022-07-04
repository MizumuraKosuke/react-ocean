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
  HalfFloatType,
  OrthographicCamera,
  DataTexture,
  Clock,
} from 'three'
import { useFrame } from '@react-three/fiber'

import { RESOLUTION } from './canvas.constants'

const phaseArray = new Uint8Array(RESOLUTION * RESOLUTION * 4)
for (let i = 0; i < RESOLUTION; i += 1) {
  for (let j = 0; j < RESOLUTION; j += 1) {
    phaseArray[i * RESOLUTION * 4 + j * 4] = Math.random() * 2.0 * Math.PI
    phaseArray[i * RESOLUTION * 4 + j * 4 + 1] = 0
    phaseArray[i * RESOLUTION * 4 + j * 4 + 2] = 0
    phaseArray[i * RESOLUTION * 4 + j * 4 + 3] = 0
  }
}

const CanvasCtx = createContainer(() => {
  const inited = useRef(false)
  const isPing = useRef(true)
  const clock = useRef(new Clock())

  const spectrumMaterial = useRef<THREE.RawShaderMaterial>(null)
  const phaseMaterial = useRef<THREE.RawShaderMaterial>(null)
  const hSubtransMaterial = useRef<THREE.RawShaderMaterial>(null)
  const vSubtransMaterial = useRef<THREE.RawShaderMaterial>(null)
  const normalMaterial = useRef<THREE.RawShaderMaterial>(null)
  const oceanMaterial = useRef<THREE.RawShaderMaterial>(null)

  const initialSpectrumCamera = useRef<OrthographicCamera>(null)
  const spectrumCamera = useRef<OrthographicCamera>(null)
  const phaseCamera = useRef<OrthographicCamera>(null)
  const hSubtransCamera = useRef<OrthographicCamera>(null)
  const vSubtransCamera = useRef<OrthographicCamera>(null)
  const normalCamera = useRef<OrthographicCamera>(null)

  const initialSpectrumScene = useMemo(() => new Scene(), [])
  const spectrumScene = useMemo(() => new Scene(), [])
  const phaseScene = useMemo(() => new Scene(), [])
  const hSubtransScene = useMemo(() => new Scene(), [])
  const vSubtransScene = useMemo(() => new Scene(), [])
  const normalScene = useMemo(() => new Scene(), [])

  const initialSpectrumTarget = useMemo(() => new WebGLRenderTarget(
    RESOLUTION,
    RESOLUTION,
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
    RESOLUTION,
    RESOLUTION,
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
    RESOLUTION,
    RESOLUTION,
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
    RESOLUTION,
    RESOLUTION,
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
    RESOLUTION,
    RESOLUTION,
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
    RESOLUTION,
    RESOLUTION,
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
    RESOLUTION,
    RESOLUTION,
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
    RESOLUTION,
    RESOLUTION,
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
      !initialSpectrumCamera.current
      || !phaseMaterial.current
      || !phaseCamera.current
      || !spectrumMaterial.current
      || !spectrumCamera.current
      || !hSubtransMaterial.current
      || !vSubtransMaterial.current
      || !hSubtransCamera.current
      || !vSubtransCamera.current
      || !normalMaterial.current
      || !normalCamera.current
      || !oceanMaterial.current
    ) {
      return
    }

    isPing.current = !isPing.current

    if (!inited.current) {
      gl.setRenderTarget(initialSpectrumTarget)
      gl.render(initialSpectrumScene, initialSpectrumCamera.current)
      gl.setRenderTarget(null)
      const tex = new DataTexture(phaseArray, RESOLUTION, RESOLUTION, RGBAFormat)
      tex.needsUpdate = true
      phaseMaterial.current.uniforms.u_phases.value = tex
    }
    else {
      phaseMaterial.current.uniforms.u_phases.value = isPing.current
        ? pongPhaseTarget.texture
        : pingPhaseTarget.texture
    }
    phaseMaterial.current.uniforms.u_deltaTime.value = clock.current.getDelta()
    gl.setRenderTarget(isPing.current ? pingPhaseTarget : pongPhaseTarget)
    gl.render(phaseScene, phaseCamera.current)
    gl.setRenderTarget(null)

    spectrumMaterial.current.uniforms.u_initialSpectrum.value = initialSpectrumTarget.texture
    spectrumMaterial.current.uniforms.u_phases.value = isPing.current
      ? pingPhaseTarget.texture
      : pongPhaseTarget.texture
    gl.setRenderTarget(spectrumTarget)
    gl.render(spectrumScene, spectrumCamera.current)
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
        isHorizontal ? hSubtransCamera.current : vSubtransCamera.current,
      )
      gl.setRenderTarget(null)
    }

    normalMaterial.current.uniforms.u_displacementMap.value = displacementTarget.texture
    gl.setRenderTarget(normalTarget)
    gl.render(normalScene, normalCamera.current)
    gl.setRenderTarget(null)

    oceanMaterial.current.uniforms.u_displacementMap.value = displacementTarget.texture
    oceanMaterial.current.uniforms.u_normalMap.value = normalTarget.texture
    oceanMaterial.current.uniforms.u_cameraPosition.value = camera.position

    inited.current = true
  })

  return {
    spectrumMaterial,
    phaseMaterial,
    hSubtransMaterial,
    vSubtransMaterial,
    normalMaterial,
    oceanMaterial,
    initialSpectrumCamera,
    spectrumCamera,
    phaseCamera,
    hSubtransCamera,
    vSubtransCamera,
    normalCamera,
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
