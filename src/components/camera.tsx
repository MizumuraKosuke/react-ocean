import { useRef } from 'react'
import { Vector3 } from 'three'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'

type CameraParamsType = {
  fov: number
  near: number
  far: number
  position: Vector3
}

export const CameraParams: CameraParamsType = {
  fov: 60,
  near: 0.1,
  far: 3000,
  position: new Vector3(0, 50, 600),
}

const Camera = () => {
  const camera = useRef()

  return (
    <>
      <PerspectiveCamera
        ref={camera}
        makeDefault
        position={CameraParams.position}
        near={CameraParams.near}
        far={CameraParams.far}
        fov={CameraParams.fov}
      />
      <OrbitControls enablePan enableZoom enableRotate />
    </>
  )
}

export default Camera
