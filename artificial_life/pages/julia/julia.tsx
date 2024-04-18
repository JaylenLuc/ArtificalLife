"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css'
import { add, complex, multiply } from 'mathjs';
//https://arxiv.org/pdf/1111.1567.pdf

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function JuliaMain () {
    const renderRef = useRef(null);
    const WIDTH = 600
    const HEIGHT = 300
    const MAX_ITER = 100;
    const c_DEFUALT = [0.274, .008]
    const R = 2
    var c = c_DEFUALT // - (.008 * Math.)
    const [free, setFree ] = useState(true)
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

    const generateJuliaSet = (p : any) => {
        
        for  (let row = 0 ; row < HEIGHT; row ++){
            let rest_row_value = normalize_to_scale(-R, R, row, 0, HEIGHT)
            //console.log(rest_row_value)
            for (let col = 0 ; col < WIDTH; col ++){
                let zcol = normalize_to_scale(-R, R, col, 0, WIDTH)
                let zrow = rest_row_value

               // console.log(zrow,zcol)
                let iterations = 0 
                let z = [zcol, zrow]
                
                //find the magnitude of the complex number 
                while( (zrow * zrow + zcol * zcol < R*R) && (iterations < MAX_ITER)){
                     
                    z = julia_function(z[0], z[1]) 
                    let xtemp = zrow * zrow - zcol * zcol;
                    zrow = 2 * zcol * zrow  + c[1];
                    zcol = xtemp + c[0];
                    //z = julia_function(z[0], z[1])
                    //console.log(z)
                    iterations += 1

                    
                }
                if (iterations < MAX_ITER ){
                    
                    let fill_val = normalize_to_scale(0, 255, iterations, 0, 499)
                    //console.log(fill_val)
                    p.fill(fill_val,fill_val,fill_val)
               
                }
                // console.log(iterations)
                p.circle(col, row ,1);  

            }
        }
        setFree(false)
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
                p.noStroke()
            }

            p.draw = () => {

                p.background(0,0,0);
                if (free) generateJuliaSet(p);
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
    
        <div ref={renderRef}>

        </div>

    )
}

//export default memo(P5Sketch)