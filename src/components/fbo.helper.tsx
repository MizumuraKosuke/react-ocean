import { Texture } from 'three'
import { MeshProps } from '@react-three/fiber'

type Props = MeshProps & {
  texture: Texture
}

const FboHelper = ({ texture, ...props }: Props) => (
  <mesh {...props}>
    <planeBufferGeometry args={[ 2, 2 ]} />
    <meshBasicMaterial map={texture} />
  </mesh>
)

export default FboHelper
