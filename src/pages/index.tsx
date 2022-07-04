import type { NextPage } from 'next'
import Head from 'next/head'

import HomeView from 'src/views/home'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>FBO Sample</title>
        <meta name="description" content="FBO Sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeView />
    </>
  )
}

export default Home
