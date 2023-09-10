"use client"

import * as THREE from 'three';
import { MinecraftModelLoader, MinecraftTexture, MinecraftTextureLoader } from '@fanthstudios/three-mcmodel';
import React, { FormEventHandler } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

const modelsPath = 'Man10ResourcePack/assets/minecraft/models';
const rawPath = 'https://raw.githubusercontent.com/takatronix/Man10ResourcePack/master/assets/minecraft';

const modelLoader = new MinecraftModelLoader();
const textureLoader = new MinecraftTextureLoader();

function AxesHelper(props: {visiable: boolean}) {
  const ref = React.useRef<THREE.AxesHelper>(null);
  React.useEffect(() => {
    ref.current?.setColors(new THREE.Color('red'), new THREE.Color('lime'), new THREE.Color('blue'))
  }, [])
  return (
    <axesHelper ref={ref} args={[8]} position={[0, 1e-2, 0]} visible={props.visiable}/>
  )
}

function Model(props: {src: string}) {
  const group = React.useRef<THREE.Group>(null);
  const [failLoad, setFailLoad] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const boundingBox = new THREE.Box3();
    group.current?.clear()
    setFailLoad(true);
    if (props.src) modelLoader.loadAsync(`${rawPath}/models/${props.src}.json`).then(model => {
      model.resolveTextures(path => textureLoader.loadAsync(`${rawPath}/textures/${path}.png`));
      
      boundingBox.setFromObject(model);
      model.position.y = boundingBox.getSize(new THREE.Vector3()).y / 2;

      group.current?.add(model);
      setFailLoad(false);
    });
  }, [ props.src ]);

  return (
    <>
      <group ref={group}/>
      <mesh visible={failLoad}>
        <boxGeometry args={[10, 10, 10]}/>
        <meshBasicMaterial map={new MinecraftTexture()}/>
      </mesh>
    </>
  );
}

function Home() {
  const [girdVisiable, setGridVisiable] = React.useState<boolean>(true);
  const [location, setLocation] = React.useState<string>('man10/vehicle/f12');
  const [rotateSpeed, setRotateSpeed] = React.useState<number>(2);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    
    if (event.target instanceof HTMLFormElement) {
      const { value: location } = event.target.location;
      setLocation(location);
    }
  };

  return (
    <>
      <form className="z-10 fixed left-0 top-0 flex flex-col w-full items-center gap-2 border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:text-gray-400 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit dark:bg-zinc-800/30" onSubmit={handleSubmit}>
        <p>
          入力したモデルを&nbsp;
          <a className='text-sky-400 hover:underline' href={`${modelsPath}/man10`}>Man10ResourcePack</a>
          &nbsp;から読み込みます
        </p>
        <p className='flex flex-nowrap items-center border-b'>
          <span>{modelsPath}/</span>
          <input className=' dark:text-white overflow-visiable min-w-80 outline-0 bg-transparent' type='text' name='location' list='models' placeholder='man10/...'/>
          <span>.json&nbsp;</span>
        </p>
        <p className='text-xs'>
          ※parent(2d系など)、バニラテクスチャを用いているモデルは例の市松模様が表示されたりします。
        </p>
        <label className='cursor-pointer select-none text-xs underline'>
          <input className='hidden' type='checkbox' onInput={event => setGridVisiable(!(event.target as HTMLInputElement).checked)}/>
          クリックするとグリッドが{girdVisiable ? '非表示になり' : '表示され'}ます。
        </label>
      </form>
      <Canvas className='bg-gray-900' style={{ height: '100vh' }} linear flat gl={{ logarithmicDepthBuffer: true }} camera={{ position: [-25, 25, -25] }} onPointerEnter={() => setRotateSpeed(0)} onPointerLeave={() => setRotateSpeed(2)}>
        <Model src={location}/>
        <AxesHelper visiable={girdVisiable}/>
        <gridHelper args={[16, 16, 'gray', 'gray']} visible={girdVisiable}/>
        <gridHelper args={[48, 3, 'gray', 'gray']} visible={girdVisiable}/>
        <pointLight position={[50, 50, 50]} intensity={100} />
        <OrbitControls autoRotate autoRotateSpeed={rotateSpeed}/>
        <Stats />
      </Canvas>
      <datalist id='models'>
        <option value={'man10/hat/loser_hat'} />
        <option value={'man10/hat/police_hat'} />
        <option value={'man10/vehicle/chiron'} />
        <option value={'man10/vehicle/retro_car'} />
        <option value={'man10/weapon/magic/curtain_call_0stack'} />
        <option value={'man10/weapon/gun/rpg7'} />
        <option value={'man10/weapon/gun/water_barrage'} /> 
      </datalist>
    </>
  );
}

export default Home;