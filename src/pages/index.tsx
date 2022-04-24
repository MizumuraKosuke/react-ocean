import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'

import IF from '../components/if'
import Lights from '../components/lights'
import Camera from '../components/camera'
import Helpers from '../components/helpers'
import Ocean from '../components/ocean'

import OceanCtx from '../components/ocean/ocean.context'

import { isProd } from '../constants'

const Home: NextPage = () => {
  const [ pixelRatio, setPixelRatio ] = useState(1)

  useEffect(() => {
    setPixelRatio(window.devicePixelRatio)
  }, [])

  return (
    <div>
      <Head>
        <title>React Ocean</title>
        <meta name="description" content="React Ocean with React Three Fiber" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-screen h-screen bg-black">
          <Canvas
            shadows
            gl={
              {
                antialias: true,
                pixelRatio,
              }
            }
          >
            <OceanCtx.Provider>
              <Ocean />
            </OceanCtx.Provider>
            <Camera />
            <Lights />
            <IF cond={!isProd}>
              <Helpers />
              <Stats showPanel={0} />
            </IF>
          </Canvas>
        </div>
      </main>
    </div>
  )
}

export default Home
