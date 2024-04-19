"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css'
import C_inout from '@/JuliaComponents/C_inout';
import { add, complex, multiply } from 'mathjs';
//https://arxiv.org/pdf/1111.1567.pdf

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function JuliaMain () {
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 760
    const MAX_ITER = 100;
    const c_DEFUALT = [-.70176, -.3842] // must be bounded by |c| <= R
    const R = 2
    const [c, _setC] = useState(c_DEFUALT) // - (.008 * Math.)
    const [c_alias, _setC_alias] = useState(c_DEFUALT) // - (.008 * Math.)
    

    const minzoom = -0.5
    const maxzoom = 0.5

    const normalize_to_scale = (a : number, b : number, value : number, min_value : number, max_value : number) => {
        let res =  (b - a) * ((value - min_value)/(max_value - min_value)) + a
        //console.log(res)
        return res
    }

    const julia_function = (a : number , bi: number) => {
        let real =  a*a  - ((bi*bi))
        let im = ((bi >= 0 ? 1 : -1) * (2*a*(Math.abs(bi))))
        return (
           [real + c[0], im + c[1]]
        )
    }


    const push_cellsAray = (p: any, row : number, col : number, val : number[] )  => {
        let pixel = (WIDTH_HEIGHT * row + col) * 4
        p.pixels[pixel] = val[0];  
        p.pixels[pixel + 1] = val[1];  
        p.pixels[pixel + 2] = val[2];  
        p.pixels[pixel + 3] = val[3];  
        
    }

    const generate_julia = (p : any ) => {
        for  (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            for (let col = 0 ; col < WIDTH_HEIGHT; col ++){
                let b = normalize_to_scale(-R, R, row, 0, WIDTH_HEIGHT)
                let a = normalize_to_scale(-R, R, col, 0, WIDTH_HEIGHT)
                // let ca = a
                // let cb = b
                let iterations = 0 
                // Math.abs(a + b) < R &&
                while (a + b < R && iterations < MAX_ITER){
                    //here you want to calculate z^2 -> a^2 - b^2 + 2abi
                    let newa = (a * a - b * b) + c[0]
                    let newb = (2 * a * b) + c[1]
                    a = newa
                    b = newb
                    iterations ++

                }
                let color = 15
                
                if (iterations == MAX_ITER){ //bounded
                    
                    color = 255
                   
                }else{
                    //log2(log2|z|) 
                    //√(a^2 + b^2)
                    let complex_abs = Math.sqrt(a*a + b*b)
                    iterations = iterations - Math.log2(Math.log2(complex_abs))
                    //color = normalize_to_scale(0, 1, iterations, 0, MAX_ITER) 
                    color = normalize_to_scale(0, 255, Math.sqrt(normalize_to_scale(0, 1, iterations, 0, MAX_ITER-1)), 0, 1)
                    
                }
                push_cellsAray(p, row, col, [color,50,50,255])
            }

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
                p.pixelDensity(1)
                p.colorMode(p.HSB, 1);
                p.willReadFrequently = true
                
                

            }

            p.draw = () => {
                if (p.mouseIsPressed){
                    //a : number, b : number, value : number, min_value : number, max_value : number

                    let newC = [normalize_to_scale(-1,1, p.mouseX, 0, WIDTH_HEIGHT),
                    normalize_to_scale(-1,1, p.mouseY, 0, WIDTH_HEIGHT)]
                    c[0] = newC[0]
                    c[1] = newC[1]
                    _setC_alias(newC)
                    //console.log(c)
                    

                }
                p.loadPixels()
                generate_julia(p)
                p.updatePixels();
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
        <div className={styles.julia_box} ref={renderRef}></div>
        <C_inout c= {c_alias} setC = {_setC_alias}/> 
    </div>

    )
}

//export default memo(P5Sketch)