import React, { useEffect, useRef } from 'react';
//https://arxiv.org/pdf/1111.1567.pdf
const P5Sketch = () => {


    /********************************************************
         * CONSTANTS 
    ********************************************************/
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 150
    //const HEIGHT = 150
    const SIZE = 2
    const RENDER_THRESHOLD = .1
    const RGB_MIN_RANGE = 255 //min range

    //transition function
    const ra = 21 //outer radius 
    const ri = ra/3 // inner radius 

    const ri_area = Math.PI * (ri*ri)
    const ra_area = (Math.PI * (ra*ra)) - (ri_area)
    const alpha = 0.147
    //αn = 0.028, αm = 0.147
    //im just gonna assume there 
    
    var cellsArray: number[][] = []

    //randomize the grid 
    //determine from the randomziex numbers what we render

    /********************************************************
         * GRID FUNCTIONS
    ********************************************************/

    const randomizeGrid = () => {
        for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            cellsArray.push([])
            for (let col = 0; col< WIDTH_HEIGHT; col ++){
                cellsArray[row].push( Math.random());
                //console.log(cellsArray[row][col])
            }
            //console.log("\n")
        }

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
                    m  += cellsArray[real_pos_row][real_pos_col]

                }else if (d_row*d_row + d_col* d_col  <= ra*ra) {//outer
                    n += cellsArray[real_pos_row][real_pos_col]

                }
                
            }
        } 
        m /= ri_area

        n /= ra_area

        console.log("m = ", m, " ", "n = ", n)
        return [m,n]
    }


    /********************************************************
         * SIGMOIDS AND THE TRANSITION FUNCTION 
    ********************************************************/
    const sigmoid1 = (x : number , a : number) => {
        return 1/(1 + Math.exp(-(x-a) * 4/alpha))
    }


    /********************************************************
         * MAIN DRIVER
    ********************************************************/

    useEffect(() => {
        const p5 = require("p5");

        const p5instance = new p5((p : any) => {
            p.setup = () => {
                p.createCanvas(WIDTH_HEIGHT + 500, WIDTH_HEIGHT + 500).parent(renderRef.current);
                randomizeGrid();
                
            }

            p.draw = () => {
                    
                p.background(0,0,0);
                fillingIntegralN_M();
                fillGrid(p);

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