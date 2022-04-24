import { useRef, useMemo } from 'react'
import { createContainer } from 'unstated-next'
import { useFrame } from '@react-three/fiber'
import {
  Scene,
  OrthographicCamera,
  WebGLRenderTarget,
  RepeatWrapping,
  ClampToEdgeWrapping,
  NearestFilter,
  LinearFilter,
  RGBAFormat,
  FloatType,
} from 'three'

import { RESOLUTION } from '../../constants'

const useOcean = () => {
  const inited = useRef(false)
  const isPing = useRef(true)

  const specMaterialRef = useRef<THREE.RawShaderMaterial | null>(null)
  const phaseMaterialRef = useRef<THREE.RawShaderMaterial>()
  const hSubtransMaterialRef = useRef<THREE.RawShaderMaterial | null>(null)
  const vSubtransMaterialRef = useRef<THREE.RawShaderMaterial | null>(null)
  const normalMaterialRef = useRef<THREE.RawShaderMaterial | null>(null)
  const oceanMaterialRef = useRef<THREE.RawShaderMaterial | null>(null)

  const initialSpecScene = useMemo(() => new Scene(), [])
  const specScene = useMemo(() => new Scene(), [])
  const phaseScene = useMemo(() => new Scene(), [])
  const hSubtransScene = useMemo(() => new Scene(), [])
  const vSubtransScene = useMemo(() => new Scene(), [])
  const normalScene = useMemo(() => new Scene(), [])
  const oceanScene = useMemo(() => new Scene(), [])

  const camera = useMemo(() => {
    const c = new OrthographicCamera(
      RESOLUTION / -2,
      RESOLUTION / 2,
      RESOLUTION / 2,
      RESOLUTION / -2,
      1,
      1000,
    )
    c.position.z = 2
    return c
  }, [])
  
  const initialSpectrumRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: RepeatWrapping,
      wrapT: RepeatWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  const spectrumRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  const pingPhaseRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  const pongPhaseRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  const displacementRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  const normalRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  const pingTransformRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  const pongTransformRender = useRef(
    new WebGLRenderTarget(RESOLUTION, RESOLUTION, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
    }),
  )

  useFrame(({ gl, clock }) => {
    if (!inited.current) {
      gl.setRenderTarget(initialSpectrumRender?.current)
      gl.render(initialSpecScene, camera)
      gl.setRenderTarget(null)
    }
  
    if (phaseMaterialRef.current) {
      phaseMaterialRef.current.uniforms.u_deltaTime.value = clock.getDelta()
      phaseMaterialRef.current.uniforms.u_phases.value = isPing.current
        ? pingPhaseRender.current.texture
        : pongPhaseRender.current.texture
      gl.setRenderTarget(isPing.current ? pongPhaseRender.current : pingPhaseRender.current)
      gl.render(phaseScene, camera)
      gl.setRenderTarget(null)
    }
  
    if (specMaterialRef.current) {
      specMaterialRef.current.uniforms.u_phases.value = isPing.current
        ? pingPhaseRender.current.texture
        : pongPhaseRender.current.texture
      gl.setRenderTarget(spectrumRender.current)
      gl.render(specScene, camera)
      gl.setRenderTarget(null)
    }

    if (hSubtransMaterialRef.current && vSubtransMaterialRef.current) {
      const iterations = Math.log2(RESOLUTION) * 2
      let subTransformMaterial = hSubtransMaterialRef.current
      let subTransformScene = hSubtransScene
      for (let i = 0; i < iterations; i += 1) {
        subTransformMaterial.uniforms.u_subtransformSize.value =
          Math.pow(2,(i % (iterations / 2)) + 1)
        switch (i) {
          case 0:
            subTransformMaterial.uniforms.u_input.value = spectrumRender.current.texture
            gl.setRenderTarget(pingTransformRender.current)
            break
          case iterations - 1:
            subTransformMaterial.uniforms.u_input.value = (iterations % 2 === 0)
              ? pingTransformRender.current.texture
              : pongTransformRender.current.texture
            gl.setRenderTarget(displacementRender.current)
            break
          default:
            subTransformMaterial.uniforms.u_input.value = (i % 2 === 0)
              ? pongTransformRender.current.texture
              : pingTransformRender.current.texture
            gl.setRenderTarget(i % 2 === 0
              ? pingTransformRender.current
              : pongTransformRender.current)
            break
        }
        gl.render(subTransformScene, camera)
        gl.setRenderTarget(null)
        if (i === iterations / 2) {
          subTransformMaterial = vSubtransMaterialRef.current
          subTransformScene = hSubtransScene
        }
      }
    }

    if (normalMaterialRef.current) {
      normalMaterialRef.current.uniforms.u_displacementMap.value =
       displacementRender.current.texture
      gl.setRenderTarget(normalRender.current)
      gl.render(normalScene, camera)
      gl.setRenderTarget(null)
    }
  
    isPing.current = !isPing.current
    inited.current = true
  })
  
  return {
    isPing,
    specMaterialRef,
    phaseMaterialRef,
    hSubtransMaterialRef,
    vSubtransMaterialRef,
    normalMaterialRef,
    oceanMaterialRef,
    initialSpecScene,
    specScene,
    phaseScene,
    hSubtransScene,
    vSubtransScene,
    normalScene,
    oceanScene,
    initialSpectrumRender,
    spectrumRender,
    pingPhaseRender,
    pongPhaseRender,
    displacementRender,
    normalRender,
    pingTransformRender,
    pongTransformRender,
  }
}

const OceanCtx = createContainer(useOcean)

export default OceanCtx
