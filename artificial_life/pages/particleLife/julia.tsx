"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css'
import C_inout from '@/JuliaComponents/C_inout';
import { add, complex, multiply } from 'mathjs';

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function ParticleMain () {
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 760

    useEffect(() => {
        const p5 = require("p5");
        var myShader: any;
        p5.disableFriendlyErrors = true;
        const p5instance = new p5((p : any) => {

            //  p.preload = () => {
            //     // load each shader file (don't worry, we will come back to these!)
            //     myShader = p.createShader(vertex, fragment);
            //   }
            p.setup = () => {
                p.createCanvas( WIDTH_HEIGHT, WIDTH_HEIGHT).parent(renderRef.current);
                p.pixelDensity(1)
                p.colorMode(p.HSB, 1);
                p.willReadFrequently = true
                
                

            }

            p.draw = () => {
  
                //p.background(0,0,0);
                //if (free) generateJuliaSet(p);
                // console.log(p.frameRate());
            }
        })
        return () => {
            //console.log("cleaning up...");
            
            // comment this out to get 2 canvases and 2 draw() loops
            p5instance.remove();
          };
        


    }, [ ])

    
return (

    <div className = {styles.foreground}>
        <meta name="viewport" content="width=device-height"></meta>
        <div className={styles.particle_box} ref={renderRef}></div>
    </div>

    )
}

//export default memo(P5Sketch)