import React, { useEffect, useRef } from 'react';

const P5Sketch = () => {
    const renderRef = useRef(null);
    const WIDTH = 150
    const HEIGHT = 150
    const SIZE = 2
    const RENDER_THRESHOLD = .1
    const RGB_MIN_RANGE = 255 //min range

    //transition function
    const ra = 21 //outer radius 
    const ri = ra/3
    var cellsArray: number[][] = []

    //randomize the grid 
    //determine from the randomziex numbers what we render



    const randomizeGrid = () => {
        for (let row = 0 ; row < HEIGHT; row ++){
            cellsArray.push([])
            for (let col = 0; col< WIDTH; col ++){
                cellsArray[row].push( Math.random());
                console.log(cellsArray[row][col])
            }
            console.log("\n")
        }

    }



    useEffect(() => {
        const p5 = require("p5");

        const p5instance = new p5((p : any) => {
            p.setup = () => {
                p.createCanvas(WIDTH + 500, HEIGHT + 500).parent(renderRef.current);
                randomizeGrid();
                
            }

            p.draw = () => {
                    
                p.background(0,0,0);
                let xPos = 0 ;
                let yPos = 0 ;
                for (let row = 0; row < HEIGHT; row ++){
                    xPos += SIZE
                    for (let col = 0; col< WIDTH; col ++){
                        
                        yPos += SIZE
                        let current_state = cellsArray[row][col]
                        if ( current_state > RENDER_THRESHOLD){
                            p.noStroke()
                            //35 - 255 -> array of length 220
                            // 0 to 220 + MIN_RANGE
                            let fill_value = (current_state * RGB_MIN_RANGE);
                            p.fill(fill_value,fill_value , fill_value)
                            p.circle(yPos, xPos , SIZE);  
                        }

                    }
                    yPos = 0
                }
            }

        })
        return () => {
            console.log("cleaning up...");
            
            // comment this out to get 2 canvases and 2 draw() loops
            p5instance.remove();
          };


    }, [])


    return(
        <div ref={renderRef}></div>
    )
}

export default P5Sketch;