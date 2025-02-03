"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from "@/styles/Home.module.css";
import { add, complex, multiply } from 'mathjs';

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function Paint () {
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 760
    const NUM_OBJ = 40
    let obj_arr = []
    // symmetry, color harmony, or complexity.
//     1) Randomly initialize populations p
//      2) Determine fitness of population
//      3) Until convergence repeat:
//       a) Select parents from population
//       b) Crossover and generate new population
//       c) Perform mutation on new population
//       d) Calculate fitness for new population
    const initRepr = (p : any ) => {
        for (let i = 0; i < NUM_OBJ; i++){
            obj_arr.push();
        }

    }


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
                //p.pixelDensity(1)
                p.colorMode(p.RGB);
                p.strokeWeight(2);
                p.willReadFrequently = true
                initRepr(p);

                

            }

            p.mouseClicked = () => {
            
            }

            p.draw = () => {
  
                // for (let i = 0 ; i < NUM_PART; i ++){
                //     let part = part_arr[i]
                    
                //     let noise = p.noise(part.x * NOISE_CONST, part.y* NOISE_CONST ) 
                //     let angle_rad = p.TAU * noise 
                //     let x_pos =part.x + p.cos(angle_rad) * SPEED_CONST
                //     let y_pos = part.y + p.sin(angle_rad)  * SPEED_CONST
                //     if (emod(x_pos, y_pos, p, )){
                //             part.x = x_pos 
                //             part.y = y_pos
                //     }else{
                //         part.x = p.random(p.width)
                //         part.y = p.random(p.height)
                //     }

                //     p.stroke(p.map(part.x, 0, p.width, 50, 255), 
                //             p.map(part.y, 0, p.height, 50, 255), 
                //             p.map(part.x, 0, p.width, 255, 150) )
                //     // p.fill(255)
                //     p.point(part.x,part.y)
                // }
                //if (free) generateJuliaSet(p);
                // console.log(p.frameRate());
            }
        })
        return () => {
            p5instance.remove();
          };
        


    }, [ ])

    
return (

    <div ref={renderRef} className = {styles.main}>
        <meta name="viewport" content="width=device-height"></meta>
    </div>

    )
}