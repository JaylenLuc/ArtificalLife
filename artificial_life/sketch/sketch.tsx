"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import ButtonLayout from  "../buttonComponents/buttonLayout"
import styles from './styles.module.css'
import BigBangButton from "../buttonComponents/bigBangButton"
import SeedInput from '../buttonComponents/seedInput';
//https://arxiv.org/pdf/1111.1567.pdf




const P5Sketch = () => {


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
    const [seedUser, _setSeed] = useState(-1)
    /**** 
     * radius checks
     * ****/
    var ra = 11 //outer radius 
    var ri = ra/3 // inner radius 
    var ri_area = Math.PI * (ri*ri)
    var ra_area = (Math.PI * (ra*ra)) - (ri_area)
    const ra_DEFAULT = 11 
    /**** 
     * sigmoid alpha values
     * ****/
    var alpha_n = 0.028
    var alpha_m = 0.147

    const alpha_n_DEFAULT = 0.028
    const alpha_m_DEFAULT = 0.147
    //αn = 0.028, αm = 0.147

    /**** 
     * birth and death interval values given by [b1, b2] and [d1, d2] 
     * ****/
    var d1 = 0.267
    var d2 = 0.445
    var b1 = 0.278
    var b2 = 0.365
    const d1_DEFAULT = 0.267
    const d2_DEFAULT = 0.445
    const b1_DEFAULT = 0.278
    const b2_DEFAULT = 0.365


    /**** 
     * delta time
     * ****/
    var dt = 0.25 //time step
    const dt_DEFAULT = 0.25 //time step


    var cellsArray: number[][] = []

    //randomize the grid 
    //determine from the randomziex numbers what we render

    /********************************************************
         * Event handlers
    ********************************************************/
    const setSeed = (seed : number) => {

        _setSeed(seed);
        resetGrid();
    };
    

    /********************************************************
         * GRID FUNCTIONS
    ********************************************************/
    const  random_number = (row: number, col : number, seed: number = seedUser) => {
        //console.log("random_number func : ", seed)
        if (seed >= 0){

            let random = Math.sin(seed + row * col) * 10000;
            // console.log(random - Math.floor(random))
            return random - Math.floor(random);
        }else{
            //console.log("default")
            return Math.random();
        }
      }

    const randomizeFullGrid = () => {
        
        for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            cellsArray.push([])
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                cellsArray[row].push( Math.random());
                
            }
        
        }

    }


    const initGridZero = () => {
        //this function will likely be called first
        for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            cellsArray.push([])
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                cellsArray[row].push( 0 );
                
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
            cellsArray.push([])
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                if ((col > center_start && col <= center_end) && 
                (row > center_start && row <= center_end)) cellsArray[row].push( random_number(row,col));

                else cellsArray[row].push(0);
               
            }
            
        }
    }

    const resetGrid = () => {
        console.log("in resetGrid: ",seedUser)
        if (cellsArray.length > 0){
            cellsArray = []
        }
        arbitrateMode()
    }

    const fillGrid = (p : any) => {
        //it takes the rand nums in the grid and draws the color based on the numbers in the grid
        let xPos = 0 ;
        let yPos = 0 ;
        for (let row = 0; row < WIDTH_HEIGHT; row ++){
            xPos += SIZE
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                
                yPos += SIZE
                let current_state = cellsArray[row][col]
                if (!strokePolicy) p.noStroke()
                
                
                
                let fill_value = (current_state * RGB_MIN_RANGE);
                /*
                fill value is the rgb 255 * the decimal which 
                is a percentage of how far it is from black until white
                this can be changed with the fill value determining 
                only some of the RGB values , play around 
                */
                p.fill(fill_value,fill_value , fill_value)

                p.circle(yPos, xPos , SIZE);  
            

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
        for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            for (let col = 0 ; col < WIDTH_HEIGHT; col ++){
                let m_n : Array<number> =  fillingIntegralN_M(row, col)
                let new_value = dt * transitionFunc_S(m_n[1], m_n[0]) // [-1,1]
                //console.log(new_value)
                //smooth time stepping scheme 
                //console.log("not clamped: ", new_value)
                //f(~x, t + dt) = f(~x, t) + dt S[s(n, m)] f(~x, t)
                cellsArray[row][col] = clamp_test(cellsArray[row][col] + new_value, 0, 1 ) 


            }

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
        let M : number = 0 
        let N : number = 0 

        for (let d_row = -(ra - 1) ; d_row < (ra - 1); ++d_row){ //iterate over the outer radius 
            let real_pos_row = emod(d_row + c_row, WIDTH_HEIGHT)

            for (let d_col = -(ra -1); d_col < (ra -1); ++ d_col){
                let real_pos_col = emod(d_col + c_col, WIDTH_HEIGHT)

                if (d_row*d_row + d_col* d_col  <= ri*ri){ //inner
                    m  += cellsArray[real_pos_row][real_pos_col]
                    //M ++

                }else if (d_row*d_row + d_col* d_col  <= ra*ra) {//outer
                    n += cellsArray[real_pos_row][real_pos_col]
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
        switch(initOption){
            case "full":
                randomizeFullGrid();
                break;
            case "center":
                console.log("center")
                randomizeCenterGrid(0.35);
                break;
        }
    }




    /******************************************************
    ********************************************************/

    useEffect(() => {
        const p5 = require("p5");

        const p5instance = new p5((p : any) => {
            p.setup = () => {
                p.createCanvas( WIDTH_HEIGHT * SIZE, WIDTH_HEIGHT * SIZE).parent(renderRef.current);
                //p.createGraphics( WIDTH_HEIGHT + 200,WIDTH_HEIGHT + 200)
                arbitrateMode()


            }

            p.draw = () => {
                    
                p.background(0,0,0);

                generalizeTransitionFunc()
                
                fillGrid(p);
            }

        })
        return () => {
            //console.log("cleaning up...");
            
            // comment this out to get 2 canvases and 2 draw() loops
            p5instance.remove();
          };


    }, [strokePolicy, seedUser, initOption])


//the entropy of the universe is tending to a maximum
    return(
        <div className={styles.master}>
            <meta name="viewport" content="width=device-height"></meta>
            <div className={styles.title}>The Universe moves to an Entropic Maximum</div>
            <section> 
                <div className= {styles.life_box} ref={renderRef}></div>
            </section>

            <div className={styles.buttonlayout}>
                
                <ButtonLayout setStrokePolicy = {setStrokePolicy} strokePolicy = {strokePolicy}/>

                <BigBangButton resetHandler={resetGrid}></BigBangButton>

                <SeedInput resetGrid = {resetGrid} setSeed={setSeed} seedUser = {seedUser}/>
            </div>
        </div>
    )
}

export default P5Sketch;