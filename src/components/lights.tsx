const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight
        position={[ 200, 300, 400 ]}
        intensity={0.5}
        color="#b70"
        castShadow
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
    </>
  )
}

export default Lights
