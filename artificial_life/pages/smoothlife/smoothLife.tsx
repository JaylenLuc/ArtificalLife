"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { color, motion } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import ButtonLayout from  "../../SmoothLifeComponents/buttonLayout"
import styles from './styles.module.css'
import BigBangButton from "../../SmoothLifeComponents/bigBangButton"
import SeedInput from '../../SmoothLifeComponents/seedInput';
import Slider from '@/SmoothLifeComponents/slider';
import ParamNav from '@/SmoothLifeComponents/paramNav'
import FourDButton from '@/SmoothLifeComponents/4DButton';
import Sparkles from 'react-sparkle'
import ColorButton from '@/SmoothLifeComponents/colorChanger';
import { memo } from "react";
import { Mystery_Quest } from 'next/font/google';
import { Color } from 'p5';
//https://arxiv.org/pdf/1111.1567.pdf

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function P5Sketch () {


    /********************************************************
         * UNIVERSAL LIFE CONSTANTS AND/OR VARS
    ********************************************************/
    
    const renderRef = useRef(null);
    var WIDTH_HEIGHT = 125 //the true number of cells WIDTH_HEIGHT ^ 2
    //const HEIGHT = 150
    var SIZE = 4
    const RGB_MIN_RANGE = 255 //min range

    const [strokePolicy, setStrokePolicy] = useState(false)
    const [initOption, setInitPolicy] = useState("center")
    const [seedUser, _setSeed] = useState(0)
    const [colorScheme, _setColorScheme] = useState(0)
    const setColorScheme = () => {
        _setColorScheme((colorScheme + 1) % 3)
        //console.log(colorScheme)

    }
    /**** 
     * radius checks
     * ****/
    const ra_DEFAULT = 11
    // const ra_DEFAULT = 11 
    var noLoop = false
    const setnoLoop = (loopVal : boolean = !noLoop) => {
        noLoop = loopVal
    }
    const [ra, _setOuterRadius] = useState(ra_DEFAULT)
    const [ri, _setInnerRadius] = useState(ra_DEFAULT/3)
    var ri_area = Math.PI * (ri*ri)
    var ra_area  = (Math.PI * (ra*ra)) - (ri_area)

    /**** 
     * sigmoid alpha values
     * ****/

    const alpha_n_DEFAULT = 0.028
    const alpha_m_DEFAULT = 0.147
    //αn = 0.028, αm = 0.147
    const [alpha_n, setAlphaN] = useState(alpha_n_DEFAULT)
    const [alpha_m, setAlphaM] = useState(alpha_m_DEFAULT)
    /**** 
     * birth and death interval values given by [b1, b2] and [d1, d2] 
     * ****/
    const d1_DEFAULT = 0.267
    const d2_DEFAULT = 0.445
    const b1_DEFAULT = 0.278
    const b2_DEFAULT = 0.365
    // const d1_DEFAULT = 0.365
    // const d2_DEFAULT = 0.549
    // const b1_DEFAULT = 0.257
    // const b2_DEFAULT = 0.336
    //var d1 = d1_DEFAULT
    const [d1, _setd1] = useState(d1_DEFAULT)
    const [d2, _setd2] = useState(d2_DEFAULT)
    const [b1, _setb1] = useState(b1_DEFAULT)
    const [b2, _setb2] = useState(b2_DEFAULT)

    /**** 
     * delta time/ time stepping
     * ****/
    const dt_DEFAULT = 0.25 //time step
    const [dt, setDeltaT] = useState(dt_DEFAULT)

    const setDefaultParams = () => {

        _setd1(d1_DEFAULT)
        _setd2(d2_DEFAULT)
        _setb1(b1_DEFAULT)
        _setb2(b2_DEFAULT)
        setRadius(ra_DEFAULT)


    }


    var cellsArray: number[] = []

    const push_cellsAray = (row : number, col : number, val : number )  => {
        cellsArray[WIDTH_HEIGHT * row + col] = val;  
        
    }
    const get_cellsAray = (row : number, col : number )  => {
        return cellsArray[WIDTH_HEIGHT * row + col];
        
    }

    //randomize the grid 
    //determine from the randomziex numbers what we render

    //One  PRESET
    // var d1 = 0.365
    // var d2 = 0.549
    // var b1 = 0.257
    // var b2 = 0.336


    // var ra = 11 //outer radius 
    // var ri = ra/3 // inner radius 
    // var ri_area = Math.PI * (ri*ri)
    // var ra_area = (Math.PI * (ra*ra)) - (ri_area)
    // const ra_DEFAULT = 11

    // var alpha_n = 0.028
    // var alpha_m = 0.147

    // var dt = 0.05 //time step 

    /********************************************************
         * Event handlers
    ********************************************************/
    const setSeed = (seed : number) => {

        _setSeed(seed);
        resetGrid();
    };

    const setRadius = (e : number) =>{
        if (e <= 25){
            _setOuterRadius(e)
            _setInnerRadius(e/3)
        }
    }




    

    /********************************************************
         * GRID FUNCTIONS
    ********************************************************/
    const  random_number = (row: number, col : number, seed: number = seedUser) => {
        //console.log("random_number func : ", seed)
        if (seed > 0){

            let random = Math.sin(seed + row * col) * 10000;
            // console.log(random - Math.floor(random))
            return random - Math.floor(random);
        }else{
            //console.log("default")
            return Math.random();
        }
      }

    const randomizeFullGrid = () => {
        
        // for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
        //     cellsArray.push([])
        //     for (let col = 0; col< WIDTH_HEIGHT; col ++){
        //         cellsArray[row].push( Math.random());
                
        //     }
        
        // }

    }


    const initGridZero = () => {
        //this function will likely be called first
        for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                
                push_cellsAray(row, col, 0)
                
            }
        
        }

    }

    const randomizeCenterGrid = (centerWidth : number) => {
        //setStrokePolicy(false)
        let center_grid = (Math.floor(WIDTH_HEIGHT/2))
        let center_diff = (Math.floor((WIDTH_HEIGHT * centerWidth)/2))
        let center_start = center_grid - center_diff
        let center_end =   center_grid + center_diff

        for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                if ((col > center_start && col <= center_end) && 
                (row > center_start && row <= center_end)) push_cellsAray(row, col, random_number(row,col));
                else push_cellsAray(row, col, seedUser != 0? random_number(row,col)/10 : 0);
               
            }
            
        }
    }

    const resetGrid = () => {
        // console.log("in resetGrid: ", ra)
        // console.log("in resetGrid: ", ri)
        // console.log("in resetGrid: ", ri_area)

        if (cellsArray.length > 0){
            cellsArray = []
        }
        setnoLoop(false)
        arbitrateMode()
    }

    const fillGrid = (p : any, myShader : any) => {
        //it takes the rand nums in the grid and draws the color based on the numbers in the grid
        let xPos = 0;
        let yPos = 0;
        for (let row = 0; row < WIDTH_HEIGHT; row ++){
            xPos += SIZE 
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                
                yPos += SIZE
                let current_state = get_cellsAray(row, col)
                
                
                
                let fill_value = (current_state * RGB_MIN_RANGE);
                /*
                fill value is the rgb 255 * the decimal which 
                is a percentage of how far it is from black until white
                this can be changed with the fill value determining 
                only some of the RGB values , play around 
                */

                //myShader.setUniform('myColor', [fill_value,fill_value,fill_value])
                p.fill(fill_value,fill_value,fill_value)
                p.circle(yPos, xPos , SIZE);  

                // p.fill(70,70,70)
                // p.circle(yPos, xPos , 5);  
            

            }
            yPos = 0
        }
        
    }


    const clamp = function(value : number, lower_b : number, upper_b : number) {
        return Math.min(Math.max(value, lower_b), upper_b);
      };

      const clamp_test = function(value : number, lower_b : number, upper_b : number) {
        if (value < lower_b ) return lower_b
        else if (value > upper_b ) return upper_b
        else return value
      };

    const generalizeTransitionFunc = ( ) => {
        let row = 0
        let col = 0 
        while ( row < WIDTH_HEIGHT){

            while(col < WIDTH_HEIGHT){
                let m_n : Array<number> =  fillingIntegralN_M(row, col)
                let new_value = dt * transitionFunc_S(m_n[1], m_n[0]) // [-1,1]
                //console.log(new_value)
                //smooth time stepping scheme 
                //console.log("not clamped: ", new_value)
                //f(~x, t + dt) = f(~x, t) + dt S[s(n, m)] f(~x, t)
                push_cellsAray(row, col, clamp_test(get_cellsAray(row, col) + new_value, 0, 1 )) 
                col++


            }
            col = 0 
            row += 1

        }


    }



    /********************************************************
         * INTEGRAL FUNCTIONS
    ********************************************************/

    const emod = (pos : number, size : number  ) => {
        return ((pos % size) + size ) % size  


    }

    //outer and inner filling
    const fillingIntegralN_M = (_row : number = 0, _col : number = 0) => { //return value between 0 -1 normalize
        let c_row : number  = _row
        let c_col : number = _col
        let m : number = 0 
        let n : number = 0 

        for (let d_row = -(ra - 1) ; d_row < (ra - 1); ++d_row){ //iterate over the outer radius 
            let real_pos_row = emod(d_row + c_row, WIDTH_HEIGHT)

            for (let d_col = -(ra -1); d_col < (ra -1); ++ d_col){
                let real_pos_col = emod(d_col + c_col, WIDTH_HEIGHT)

                if (d_row*d_row + d_col* d_col  <= ri*ri){ //inner
                    
                    m  += get_cellsAray(real_pos_row,real_pos_col)
                    //M ++

                }else if (d_row*d_row + d_col* d_col  <= ra*ra) {//outer
                    n +=  get_cellsAray(real_pos_row,real_pos_col)
                    //N ++
                }
                
            }
        } 
        m /= ri_area
        //m= clamp(m , 0 ,1 )
        n /= ra_area
        //n = clamp(n , 0 ,1)

        return [m,n] // inner, outer
    }


    /********************************************************
         * SIGMOIDS AND THE TRANSITION FUNCTION 
    ********************************************************/
    const sigmoid1 = (x : number , a : number, alpha_val : number) => {
        return 1/(1 + Math.exp(-(x-a) * 4/alpha_val))
    }

    const sigmoid2 = (x : number , a : number , b : number) => {
        return sigmoid1(x,a, alpha_n) * (1- sigmoid1(x,b, alpha_n))
    }

    const sigmoidM = (x :number , y : number, m : number) => {
        return x * ( 1 - sigmoid1(m, 0.5,alpha_m) ) + (y * sigmoid1(m, 0.5,alpha_m))
    }

    const transitionFunc_S = (n : number, m : number ) => {
        //If the transition function in the discrete time-stepping scheme was sd(n, m) then the smooth one is s(n, m) = 2sd(n, m)−1.
        return  2 * sigmoid2(n, sigmoidM(b1,d1,m), sigmoidM(b2,d2,m) ) - 1
    }
    

    const arbitrateMode = () => {

        ri_area = (Math.PI * (ri*ri))
        ra_area = ((Math.PI * (ra*ra)) - (ri_area))
 

        switch(initOption){
            case "full":
                randomizeFullGrid();
                break;
            case "center":
                randomizeCenterGrid(0.35);
                break;
        }
    }




    /******************************************************
    ********************************************************/
    // const vertex  = `
    //     precision highp float;
    //     uniform mat4 uModelViewMatrix;
    //     uniform mat4 uProjectionMatrix;

    //     attribute vec3 aPosition;
    //     attribute vec2 aTexCoord;
    //     varying vec2 vTexCoord;

    //     void main() {
    //     vTexCoord = aTexCoord;
    //     vec4 positionVec4 = vec4(aPosition, 1.0);
    //     gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    //     }
    //     `;


    //     // the fragment shader is called for each pixel
    // const fragment  = `
    //     precision highp float;
    //     uniform vec2 p;
    //     uniform float r;
    //     const int I = 500;
    //     varying vec2 vTexCoord;
    //     void main() {
    //         vec2 c = p + gl_FragCoord.xy * r, z = c;
    //         float n = 0.0;
    //         for (int i = I; i > 0; i --) {
    //         if(z.x*z.x+z.y*z.y > 4.0) {
    //             n = float(i)/float(I);
    //             break;
    //         }
    //         z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;
    //         }
    //         gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);
    //     }`;
    useEffect(() => {
        const p5 = require("p5");
        
        p5.disableFriendlyErrors = true;
        var myShader: any;
        var fps ;
        const p5instance = new p5((p : any) => {
            
            //  p.preload = () => {
            //     // load each shader file (don't worry, we will come back to these!)
            //     myShader = p.createShader(vertex, fragment);
            //   }
            p.setup = () => {
                
                //console.log("HERE:", p5.disableFriendlyErrors )
                p.createCanvas( WIDTH_HEIGHT * SIZE, WIDTH_HEIGHT * SIZE).parent(renderRef.current);
                //p.createGraphics( WIDTH_HEIGHT + 200,WIDTH_HEIGHT + 200)
                if (!strokePolicy) p.noStroke()
                let color = ""
                switch(colorScheme){
                    case 0 :  p.colorMode(p.RGB); break;
                    case 1 :  p.colorMode(p.HSB); break;
                    case 2:  p.colorMode(p.HSL); break;
                    default:  p.colorMode(p.RGB);
                }

                arbitrateMode()
                
                


            }

            p.draw = () => {
               //fps = p.frameRate();
                p.background(0,0,0);
                //p.shader(myShader)
                // console.time('generalizeTransitionFunc')
                if (!noLoop){
                    generalizeTransitionFunc()

                    // console.timeEnd('generalizeTransitionFunc')

                    //console.log( "loooping", cellsArray[13][55])
                   
                }
                fillGrid(p, myShader);
                //console.log( "OUTTA", cellsArray[13][55])
                //console.log("FPS: " + fps.toFixed(2));
                //console.log(p.frameRate());
            }

        })
        return () => {
            //console.log("cleaning up...");
            
            // comment this out to get 2 canvases and 2 draw() loops
            p5instance.remove();
          };


    }, [ strokePolicy, seedUser, initOption, b1, b2, d1, d2, dt, ra, ri, ri_area, ra_area, noLoop, colorScheme])


//the entropy of the universe is tending to a maximum
    return(
    
        <div className={styles.foreground}>

                <Sparkles
                    color="random"
                    count={80}
                    minSize={9}
                    maxSize={14}
                    overflowPx={80}
                    fadeOutSpeed={30}
                    flicker={true}
            />
            <meta name="viewport" content="width=device-height"></meta>
            <div className={styles.title}>
                The Universe moves to an Entropic Maximum
            </div>

            
            <section> 
                <div className= {styles.life_box} ref={renderRef}></div>
            </section>

            <div className={styles.buttonlayout}>
                
                <ButtonLayout setStrokePolicy = {setStrokePolicy} strokePolicy = {strokePolicy}/>

                <BigBangButton resetHandler={resetGrid}></BigBangButton>

                <SeedInput setSeed={setSeed} seedUser = {seedUser}/>
            </div>
            <br></br>
            <div className={styles.buttonlayout}>
                <ColorButton changeColor = {setColorScheme}/>
                <FourDButton setNoLoop = {setnoLoop} noLoop = {noLoop}/>
                
            </div>

            <div className={styles.buttonlayout}>
                <ParamNav setd1 = {_setd1} d1 = {d1} setd2= {_setd2}
                    d2 = {d2} setb1={_setb1} b1={b1} setb2={_setb2} b2={b2} setrad={setRadius} rad = {ra} resetSettings={setDefaultParams}/>
                    
            </div>
            

        </div>

    )
}

//export default memo(P5Sketch)