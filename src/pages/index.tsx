import type { NextPage } from 'next'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'

import CanvasCtx from 'src/views/canvas.context'
import Lights from 'src/views/lights'
import Camera from 'src/views/camera'
import Ocean from 'src/views/ocean'

import { debugMode } from '../constants'

const Home: NextPage = () => (
  <>
    <Head>
      <title>FFT Ocean with React Three Fiber</title>
      <meta name="description" content="FFT Ocean by React Three Fiber" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
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
  </>
)

export default Home
