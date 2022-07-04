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
  far: 5000,
  position: new Vector3(0, 3, 20),
}

const Camera = () => (
  <>
    <PerspectiveCamera
      makeDefault
      position={CameraParams.position}
      near={CameraParams.near}
      far={CameraParams.far}
      fov={CameraParams.fov}
    />
    <OrbitControls enablePan enableZoom enableRotate />
  </>
)

export default Camera
