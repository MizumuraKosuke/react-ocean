import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'

import Camera from './camera'
import Lights from './lights'
import Ocean from './ocean'

import CanvasCtx from './canvas.context'

import { debugMode } from './canvas.constants'

const Home = () => {
  return (
    <main className="w-screen h-screen">
      <Canvas>
        <CanvasCtx.Provider>
          <Lights />
          <Camera />
          <Ocean />
          {
            debugMode && <Stats />
          }
        </CanvasCtx.Provider>
      </Canvas>
    </main>
  )
}

export default Home
