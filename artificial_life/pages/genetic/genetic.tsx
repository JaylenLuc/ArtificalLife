"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from "./styles.module.css";
import { add, complex, distance, forEach, i, multiply, random, sin, sqrt } from 'mathjs';

//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function Genetic () {
    let play = true
    const setPlay = () => {
        play = !play;
    }
    let  GLOB_p = null;
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 760
    const NUM_OBJ = 5;
    let obj_arr : BrushStroke[] = [];

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
        strokeWeight : number;
        strokeColor : number;

        constructor() {
            this.startX = random(WIDTH_HEIGHT);
            this.startY = random(WIDTH_HEIGHT);
            this.endX = this.startX + random(-200, 200);
            this.endY = this.startY + random(-200, 200);
            this.controlX1 = this.startX + random(-350, 350);
            this.controlY1 = this.startY + random(-350, 350);
            this.controlX2 = this.endX + random(-150, 150);
            this.controlY2 = this.endY + random(-150, 150);
            this.strokeWeight = random(2, 20);
            this.strokeColor = GLOB_p!.color(random(0, 255), random(0, 255), random(0, 255), random(100, 255));
        }

        draw() {
            GLOB_p!.strokeWeight(this.strokeWeight);
            GLOB_p!.stroke(this.strokeColor);
            GLOB_p!.noFill();
            GLOB_p!.beginShape();
            GLOB_p!.curveVertex(this.startX, this.startY);
            GLOB_p!.curveVertex(this.startX, this.startY);
            GLOB_p!.curveVertex(this.controlX1, this.controlY1);
            GLOB_p!.curveVertex(this.controlX2, this.controlY2);
            GLOB_p!.curveVertex(this.endX, this.endY);
            GLOB_p!.curveVertex(this.endX, this.endY);
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
            calcFitnessCurvature(newStroke);
            obj_arr.push(newStroke);

        }

    }

    const calcFitnessCurvature = (brush : BrushStroke) => {
            
            let dist = Math.pow(Math.sqrt(brush.controlX2 - brush.controlX1), 2) + 
                Math.pow(Math.sqrt(brush.controlX2 - brush.controlX1), 2);
            brush.fitness =1/dist * sin(dist); 
    }
    function mutate(stroke : BrushStroke, mutationRate = 0.2) {
        if (random() < mutationRate) stroke.startX += random(-150, 150) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.startY += random(-150, 150) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.endX += random(-150, 150) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.endY += random(-150, 150) % WIDTH_HEIGHT;
        if (random() < mutationRate) stroke.controlX1 += random(-50, 50);
        if (random() < mutationRate) stroke.controlY1 += random(-50, 50);
        if (random() < mutationRate) stroke.controlX2 += random(-50, 50);
        if (random() < mutationRate) stroke.controlY2 += random(-50, 50);
        if (random() < mutationRate) stroke.strokeWeight = random() < .5?  stroke.strokeWeight += random(-20, 20) : random(1,20);
        if (random() < mutationRate) stroke.strokeColor = GLOB_p!.color(random(0, 255), random(0, 255), random(0, 255), random(100, 255));
    } 
   const cross = () => {
        obj_arr.sort((brush1 : BrushStroke, brush2 : BrushStroke) =>  brush2.fitness - brush1.fitness );
        const top_k = obj_arr.slice(0, Math.floor(NUM_OBJ / 2 ));
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
        child.strokeWeight = random() < 0.5 ? parent1.strokeWeight : parent2.strokeWeight;
        child.strokeColor = GLOB_p!.lerpColor(parent1.strokeColor, 
            parent2.strokeColor, 0.5); // Mix colors
        let index = (NUM_OBJ-Math.floor((NUM_OBJ * .5))) + Math.floor(NUM_OBJ - Math.floor(NUM_OBJ / 2) * Math.random())
        
        delete obj_arr[index];
        
        
        mutate(child);
        obj_arr.push(child);
        //console.log(child.fitness)

    }

    useEffect(() => {
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
                //p.pixelDensity(1)
                p.colorMode(p.RGB);
                p.strokeWeight(2);
                p.willReadFrequently = true
                initRepr();

                

            }

            p.mouseClicked = () => {
            
            }

            p.draw = () => {
                if (play){
                    obj_arr.forEach((brush) => {
                        brush.draw();
                    })
                    calcFitnessCurvature(obj_arr[obj_arr.length - 1]);
                    cross();
                }
            }
        })
        return () => {
            p5instance.remove();
          };
        


    }, [ ])

    
return (
    <div>
        
        <button id="playbutton" className={styles.playButt} onClick={() => {
                setPlay();
                let currButton = document.getElementById("playbutton");
                currButton!.innerHTML = play? "Pause" : "Resume";
            }
        } 
        >Pause</button>
        <div ref={renderRef} className = {styles.main}>
            <meta name="viewport" content="width=device-height"></meta>
        </div>
    </div>

    )
}