"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from "@/styles/Home.module.css";
import { add, complex, multiply } from 'mathjs';

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function FlowField () {
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 760
    let part_arr: any[] = []
    const NUM_PART = 300
    const NOISE_CONST = 0.01
    const SPEED_CONST = 1.5

    const emod = (pos1 : number, pos2 : number,  p : any, width : boolean = false ) => {
        if ( pos1 >= 0 && pos1 <= WIDTH_HEIGHT && pos2 >= 0 && pos2 <= WIDTH_HEIGHT){
            return true 
        }else {
            return false
        }


    }
    // const clicked = (p : any ) => {

    // }
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
                for (let i = 0 ; i < NUM_PART; i ++){
                    part_arr.push(p.createVector(p.random(p.width), p.random(p.height)))
                }
                
                

            }

            p.mouseClicked = () => {
                p.noiseSeed(p.millis())
            }

            p.draw = () => {
  
                p.background(0, 10);
                for (let i = 0 ; i < NUM_PART; i ++){
                    let part = part_arr[i]
                    
                    let noise = p.noise(part.x * NOISE_CONST, part.y* NOISE_CONST ) 
                    let angle_rad = p.TAU * noise 
                    let x_pos =part.x + p.cos(angle_rad) * SPEED_CONST
                    let y_pos = part.y + p.sin(angle_rad)  * SPEED_CONST
                    if (emod(x_pos, y_pos, p, )){
                            part.x = x_pos 
                            part.y = y_pos
                    }else{
                        part.x = p.random(p.width)
                        part.y = p.random(p.height)
                    }

                    p.stroke(p.map(part.x, 0, p.width, 50, 255), 
                            p.map(part.y, 0, p.height, 50, 255), 
                            p.map(part.x, 0, p.width, 255, 150) )
                    // p.fill(255)
                    p.point(part.x,part.y)
                }
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