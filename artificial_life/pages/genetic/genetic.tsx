"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from "./styles.module.css";
import { add, complex, distance, forEach, i, multiply, random, sin, sqrt } from 'mathjs';
import { TriangleStripDrawMode } from 'three';

export default function Genetic () {
    const play = useRef(true)

    const setPlay = (p=!play.current) => {
        play.current = p
    }
    const [perp, setPerp] = useState(false);
    let  GLOB_p: any  = null;
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 750
    const NUM_OBJ =10;
    const fractal_WEIGHT =1.8;
    let size = WIDTH_HEIGHT;
    let childindex : number | null = null;
    let prevDim : number | null = null;
    const box_sizes : number[] = []

    while (size >= 2){
        let boxSideLength = Math.floor(size/2);
        box_sizes.push(boxSideLength);
        size = boxSideLength;
    }
    console.log(box_sizes);

    let mask = Array<number>();
    let targetMask = Array<number>();
    let half = NUM_OBJ-Math.floor((NUM_OBJ * .5));
    let obj_arr : BrushStroke[] = [];
    //let obj_arr = new Array<BrushStroke>(NUM_OBJ);

    class BrushStroke {
        fitness : number = -1;
        startX : number;
        startY : number;
        endX : number;
        endY: number;
        controlX1 : number;
        controlX2 : number;
        controlY2 : number;
        controlY1 : number;
        controlX3 : number;
        controlY3 : number;
        controlY4 : number;
        controlX4 : number;
        controlX5 : number;
        controlY5 : number;
        controlX6 : number;
        controlY6 : number;
        strokeWeight : number;
        strokeColor : number;

        constructor() {
            this.startX = (random(WIDTH_HEIGHT));
            this.startY = (random(WIDTH_HEIGHT)) ;
            this.endX = (((this.startX + random(-200, 200)) % WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.endY = (((this.startY + random(-200, 200) )% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlX1 = ((this.startX + random(-350, 350)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlY1 = ((this.startY + random(-350, 350)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlX2 = ((this.endX + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlY2 = ((this.endY + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlX3 =  ((this.startX + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlY3 =  ((this.endY + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlX4 =  ((this.startX + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlY4 =  ((this.endY + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlX5 =  ((this.controlY3 + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlY5 =  ((this.controlX3 + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlX6 =  ((this.controlY5 + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
            this.controlY6 =  ((this.controlX5 + random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;



        this.strokeWeight = random(2, 12);
            this.strokeColor = GLOB_p!.color(random(0, 255), random(0, 255), random(0, 255), random(50, 150));
        }

        draw() {
            GLOB_p!.strokeWeight(this.strokeWeight);
            GLOB_p!.stroke(this.strokeColor);
            GLOB_p!.noFill();
            GLOB_p!.beginShape();
            GLOB_p!.curveVertex(this.startX, this.startY);
            GLOB_p!.curveVertex(this.controlX1, this.controlY1);
            GLOB_p!.curveVertex(this.controlX2, this.controlY2);
            GLOB_p!.curveVertex(this.controlX3, this.controlY3);
            GLOB_p!.curveVertex(this.controlX4, this.controlY4);
            GLOB_p!.curveVertex(this.controlX5, this.controlY5);
            GLOB_p!.curveVertex(this.controlX6, this.controlY6);

            GLOB_p!.curveVertex(this.endX, this.endY);
            //GLOB_p!.filter(GLOB_p!.BLUR, 1)
            
            GLOB_p!.endShape();
        }
    }

    
    // symmetry, color harmony, or complexity.
//     1) Randomly initialize populations p
//      2) Determine fitness of population
//      3) Until convergence repeat:
//       a) Select parents from population
//       b) Crossover and generate new population
//       c) Perform mutation on new population
//       d) Calculate fitness for new population
    const initRepr = () => {
        for (let i = 0; i < NUM_OBJ; i++){
            let newStroke = new BrushStroke();
           // calcFitnessCurvature(newStroke, false, null, 0);
            newStroke.fitness = 0
            obj_arr.push(newStroke);

        }

    }
    const setTargetMask = () => {
        targetMask = createMask(GLOB_p);

    } 
    const meanSquared = () => {
        mask = createMask(GLOB_p);
        let error = 0 ;
        for (let i = 0 ; i < WIDTH_HEIGHT; i ++){
            for (let y = 0 ; y < WIDTH_HEIGHT; y ++){
                error += Math.pow(targetMask[i * WIDTH_HEIGHT + y] - mask[i * WIDTH_HEIGHT + y], 2)
            
            }
        }
        let mse = 1/(1+error)
        console.log("mse : ", mse)
        return mse

        //return 1


    }
    const jaccardCoefficient = () => {
       mask = createMask(GLOB_p);
        let intersection = 0 ;
        let union = 0;
        for (let i = 0 ; i < WIDTH_HEIGHT * WIDTH_HEIGHT; i ++){
                if (targetMask[i] == 1 && mask[i] == 1){
                    intersection += 1
                }
                if (targetMask[i] == 1){
                    union += 1
                }
            
        }
        return intersection/union
    }

    const pixel_pixel = () => {

    }

    const meansquaredFitness = (brush: BrushStroke) => {
        let score = meanSquared();
        brush.fitness = score;
    }
    const jaccardFitness = (brush : BrushStroke) => {
        let score = jaccardCoefficient();
        brush.fitness = score;
    }

    const createMask = (p : any ) => {
        p.loadPixels(); //pixels array
        let curr_mask = Array<number>();
        for (let row  = 0 ; row < WIDTH_HEIGHT; row ++ ){
            for (let col = 0 ; col < WIDTH_HEIGHT; col ++){
                let indexStart = ((WIDTH_HEIGHT * row) + col ) * 4;
                curr_mask[(row * WIDTH_HEIGHT) + col] = p.pixels[indexStart] > 0 ||
                                            p.pixels[indexStart + 1] > 0  ||
                                            p.pixels[indexStart + 2] > 0  ||
                                            p.pixels[indexStart + 3] > 0 ? 1 : 0; 
            }

        }
        return curr_mask
        //console.log("mask : ", mask);
    }

    const boxCount = () => {
        let counts : number[] = []
        box_sizes.forEach(size => {
            let count = 0 ;
            for (let row = 0 ; row < WIDTH_HEIGHT; row += size ){
                for (let col = 0 ; col < WIDTH_HEIGHT; col += size){
                    let found = false;
                    //once remainding rows and columns are less than teh box size then count 
                    //the rest (if box size left to count is greater than the area remainding then just take the min)
                    const maxRow = Math.min(row + size, WIDTH_HEIGHT);
                    const maxCol = Math.min(col + size, WIDTH_HEIGHT);

                    for (let boxRow = row; boxRow < maxRow; boxRow ++){
                        for (let boxCol = col ; boxCol < maxCol; boxCol ++){
                            if (mask[(boxRow * WIDTH_HEIGHT) + boxCol]){
                                found = true;
                                count ++;
                                break;
                            }

                        }
                        if (found) break;
                    }

                }
            }             
            counts.push(count); 

        });
        return counts;
    }
    const linearRegression = () => {
        //log(N(E))/log(E)
        //x = sizes y = count
        let log_e = box_sizes.map(size => Math.log(size));
        let N_of_e : number[] =  boxCount().map(count => Math.log(count));
        let sigma_xy = (log_e.reduce((acc, size, index) => acc + (size* N_of_e[index]), 0  ));
       //console.log(sigma_xy);
        let sigmaxsquared = log_e.reduce((acc, size) => acc + size**2, 0);
       //console.log(sigmaxsquared);
        let alpha : number =  sigma_xy/sigmaxsquared;
        //console.log("alpha: ",alpha)
        return alpha
        //alpha=∑xiyi/∑x2i.




    }
    const calcFitnessCurvature = (brush : BrushStroke, applyWeight: boolean = false, prevDim : number| null = null, currDim : number | null = null) => {
        //console.log("-------------------------------------------")
        //console.log("prev: ", prevDim );
        //console.log("now: ", currDim)
        //console.log("--------------------------------------------")
        let dist = Math.sqrt(Math.pow((brush.controlX5 - brush.controlX1), 2) + 
            Math.pow((brush.controlY5 - brush.controlY1), 2));
        //console.log("dist",dist)
        let adder = ( sin(dist)) ;
        brush.fitness =   adder * (prevDim == null? currDim! : currDim! - prevDim!)* (applyWeight? fractal_WEIGHT : 1); 
}
    function mutate(stroke : BrushStroke, mutationRate = 0.05) {
        if (random() < mutationRate) stroke.startX = ((stroke.startX += random(-250, 250) % WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.startY = ((stroke.startY += random(-250, 250) % WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.endX = ((stroke.endX += random(-250, 250) % WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.endY = ((stroke.endY += random(-250, 250) % WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlX1 = ((stroke.controlX1 += random(-150, 150) % WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlY1 = ((stroke.controlY1 += random(-150, 150) % WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlX2 = ((stroke.controlX2 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlY2 = ((stroke.controlY2 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlY3 = ((stroke.controlY3 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlX3 = ((stroke.controlX3 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlY4 = ((stroke.controlY3 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlX4 = ((stroke.controlX3 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlY5 = ((stroke.controlY4 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlX5 = ((stroke.controlX4 += random(-150, 150)% WIDTH_HEIGHT) + WIDTH_HEIGHT) % WIDTH_HEIGHT;


        if (random() < mutationRate) stroke.strokeWeight = random() < .5?  (((stroke.strokeWeight += random(-1, 1)) % 12) + 12) % 12 : random(1,12);
        if (random() < mutationRate) stroke.strokeColor = GLOB_p!.color(random(0, 255), random(0, 255), random(0, 255), random(50, 150));
    } 
   const cross = () => {
        if (!perp && childindex != null && prevDim != null){
            let currDim = fractalDimensionality();
            //console.log("score before: ",obj_arr[childindex].fitness);
            calcFitnessCurvature(obj_arr[childindex], true, prevDim, currDim );
            //console.log("score after: ",obj_arr[childindex].fitness);
                    }
        else if (!perp && prevDim == null) prevDim = fractalDimensionality();
        let jaccarddiff = jaccardCoefficient();
        if (perp && prevDim == null){
            prevDim = jaccarddiff;
        }
        else if (perp && prevDim != null){
            let jc = jaccarddiff;
            console.log("jaccard: ", jc, " ", prevDim)
            jaccarddiff = jc - prevDim
            prevDim = jc
        }
        obj_arr.sort((brush1 : BrushStroke, brush2 : BrushStroke) =>  brush2.fitness - brush1.fitness );
        const top_k = obj_arr.slice(0, Math.floor(NUM_OBJ * 0.1 ));
        
        let mating_individuals = [];
        for (let i = 0 ; i < 2; i++){
            mating_individuals.push(top_k[Math.floor(top_k.length * Math.random())]);
        }

        const [parent1, parent2] = mating_individuals;

        let child = new BrushStroke();

        // Combine properties from both parents
        child.startX = random() < 0.5 ? parent1.startX : parent2.startX;
        child.startY = random() < 0.5 ? parent1.startY : parent2.startY;
        child.endX = random() < 0.5 ? parent1.endX : parent2.endX;
        child.endY = random() < 0.5 ? parent1.endY : parent2.endY;
        child.controlX1 = random() < 0.5 ? parent1.controlX1 : parent2.controlX1;
        child.controlY1 = random() < 0.5 ? parent1.controlY1 : parent2.controlY1;
        child.controlX2 = random() < 0.5 ? parent1.controlX2 : parent2.controlX2;
        child.controlY2 = random() < 0.5 ? parent1.controlY2 : parent2.controlY2;
        child.controlX3 = random() < 0.5 ? parent1.controlX3 : parent2.controlX3;
        child.controlX3 = random() < 0.5 ? parent1.controlX3 : parent2.controlX3;
        child.controlY4 = random() < 0.5 ? parent1.controlY4 : parent2.controlY4;
        child.controlY4 = random() < 0.5 ? parent1.controlY4 : parent2.controlY4;
        child.strokeWeight = random() < 0.5 ? parent1.strokeWeight : parent2.strokeWeight;
        child.strokeColor = GLOB_p!.lerpColor(parent1.strokeColor, parent2.strokeColor, 0.5); // Mix colors

        childindex = (half + Math.floor((half * Math.random())));
        //console.log("index : ", index);
        //obj_arr.splice(index, 1);
        mutate(child);
        obj_arr[childindex] = child;
        if (perp){
            //meansquaredFitness(child)
            console.log("before: ", child.fitness)
            child.fitness = jaccarddiff 
            console.log("after : ", child.fitness)
        }
            //index = (Math.floor(obj_arr.length/2) + Math.floor((obj_arr.length/2) * Math.random()) )
        //console.log("array size: ", obj_arr.length)

    }
    const fractalDimensionality = () => {
        mask = createMask(GLOB_p);
        return linearRegression();

}
    useEffect(() => {
        prevDim = null
        const p5 = require("p5");
        var myShader: any;
        p5.disableFriendlyErrors = true;
        const p5instance = new p5((p : any) => {
            GLOB_p = p;
            //  p.preload = () => {
            //     // load each shader file (don't worry, we will come back to these!)
            //     myShader = p.createShader(vertex, fragment);
            //   }
            p.setup = () => {
                p.createCanvas( WIDTH_HEIGHT, WIDTH_HEIGHT).parent(renderRef.current);
                p.pixelDensity(1)
                p.colorMode(p.RGB);
                p.strokeWeight(2);
                p.willReadFrequently = true
                initRepr();
                

            }

            p.mouseClicked = () => {
            
            }

            p.draw = () => {
               // console.log("use effect: play", play)
                if (perp && !play.current && p.mouseIsPressed){
                    p.stroke(p.color(255,255,255))
                    p.strokeWeight(5)

                    p.line(p.pmouseX,p.pmouseY, p.mouseX, p.mouseY )
                }
                else if (play.current){

                    p.clear(); 
                    obj_arr.forEach((brush) => {
                        brush.draw();
                    })
                    cross();
                    
                }
            }
        })
        return () => {
            p5instance.remove();
          };
        


    }, [perp, ])

    
return (
    <div>
        <button id="perp" className={styles.playButt} onClick={() => {
                console.log("og: ", perp)
                setPerp((prevPerp) => {
                    const newPerp = !prevPerp;
                    console.log("og: ", prevPerp);
                    console.log("after: ", newPerp);
            
                    let currButton = document.getElementById("perp");
                    currButton!.innerHTML = newPerp ? "fractal dimensionality" : "you draw it learns";
            
                    if (newPerp) {
                        prevDim = null;
                        setPlay(false);
                    } else {
                        targetMask = Array<number>();
                        mask = Array<number>();
                        prevDim = null;
                        setPlay(true);
                    }
            
                    console.log("play: ", play, " perp: ", newPerp);
                    return newPerp;
                });
            
            
            } }
        >you draw it learns</button>
       {!perp? 
            <button id="playbutton" className={styles.playButt} onClick={() => {
                setPlay();
                let currButton = document.getElementById("playbutton")
                currButton!.innerHTML = play.current? "pause" : "resume";
            } }
        >{play.current? "pause" : "resume"}</button> :
            <button id="playbutton1" className={styles.playButt} onClick={() => {
        let currButton = document.getElementById("playbutton1");
            setPlay()
            currButton!.innerHTML = play.current? "reset" : "finish drawing";
            targetMask = []
            obj_arr = []
            initRepr();
            if (play.current){
            
                
                setTargetMask();
                console.log("target mask: t",targetMask)
            }
            prevDim = null
            GLOB_p.clear();
            
            console.log("curr: ", play)
         }}>finish drawing</button>
   
        }
        <div ref={renderRef} className = {styles.main}>
            <meta name="viewport" content="width=device-height"></meta>
        </div>
    </div>

    )
}