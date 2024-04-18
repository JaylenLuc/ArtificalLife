"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css'
//https://arxiv.org/pdf/1111.1567.pdf

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function JuliaMain () {
    const renderRef = useRef(null);
    const WIDTH = 1000
    const HEIGHT = 800

    var c = 0.274// - (.008 * Math.)

    const generateJuliaSet = () => {

    }



    useEffect(() => {
        const p5 = require("p5");
        var myShader: any;
        const p5instance = new p5((p : any) => {

            //  p.preload = () => {
            //     // load each shader file (don't worry, we will come back to these!)
            //     myShader = p.createShader(vertex, fragment);
            //   }
            p.setup = () => {
                p.createCanvas( WIDTH, HEIGHT).parent(renderRef.current);

            }

            p.draw = () => {

                p.background(200);

                generateJuliaSet();

            }
        })
        return () => {
            //console.log("cleaning up...");
            
            // comment this out to get 2 canvases and 2 draw() loops
            p5instance.remove();
          };
        


    }, [ ])

    
return (
    
        <div ref={renderRef}>

        </div>

    )
}

//export default memo(P5Sketch)