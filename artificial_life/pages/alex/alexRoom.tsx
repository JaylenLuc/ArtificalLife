"use client";
import React, { useEffect } from 'react';
import styles from  './styles.module.css'
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function AlexRoom() {
    useEffect(() => {
        // Any client-side effects can go here
    }, []);

    return (
        <div id="canvas-container" className={styles.canvasContainer}>
            <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={2}/>
                <directionalLight color="white" position={[-5, -5, 5]} intensity={2}/>
                <mesh position={[0, 0, 0]}  rotation={[Math.PI / 2 + .5,0, 0]}>
                    <boxGeometry args={[10, 10, 1]} />
                    <meshStandardMaterial color="#836953" />
                </mesh>
                <OrbitControls />
            </Canvas>
        </div>
    );
}

