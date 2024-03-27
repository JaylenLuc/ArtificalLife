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
    const ra = 21 //outer radius 
    const ri = ra/3 // inner radius 
    const ri_area = Math.PI * (ri*ri)
    const ra_area = (Math.PI * (ra*ra)) - (ri_area)
    const alpha = 0.028
    //αn = 0.028, αm = 0.147
    //im just gonna assume there is only one alpha
    const d1 = 0.267
    const d2 = 0.445
    const b1 = 0.278
    const b2 = 0.365
    // birth and death intervals are given by [b1, b2] and [d1, d2] 

    const dt = 0.1 //time step


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
                //if ( current_state > RENDER_THRESHOLD){
                p.noStroke()
                //35 - 255 -> array of length 220
                // 0 to 220 + MIN_RANGE
                
                let fill_value = (current_state * RGB_MIN_RANGE);
                //console.log(fill_value )
                p.fill(fill_value,fill_value , fill_value)
                p.circle(yPos, xPos , SIZE);  
            //}

            }
            yPos = 0
        }
        //console.log("here1")
    }

    // const clamp = (value : number, lower_b : number, upper_b : number) => {
    //     if (value > upper_b ) return upper_b
    //     else if (value < lower_b ) return lower_b
    //     else return value


    // }

    const clamp = function(value : number, lower_b : number, upper_b : number) {
        return Math.min(Math.max(value, lower_b), upper_b);
      };

    const generalizeTransitionFunc = () => {
        for (let row = 0 ; row < WIDTH_HEIGHT; row ++){
            for (let col = 0 ; col < WIDTH_HEIGHT; col ++){
                let m_n : Array<number> =  fillingIntegralN_M(row, col)
                let new_value = transitionFunc_S(m_n[1], m_n[0])
                cellsArray[row][col] += clamp(dt * new_value, 0, 1)
                //console.log(cellsArray[row][col])

            }

        }
        //console.log("here")
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

        //console.log("m = ", m, " ", "n = ", n)

        //console.log("tranisition value: ", transitionFunc_S(n,m))

        return [m,n] // inner, outer
    }


    /********************************************************
         * SIGMOIDS AND THE TRANSITION FUNCTION 
    ********************************************************/
    const sigmoid1 = (x : number , a : number) => {
        return 1/(1 + Math.exp(-(x-a) * 4/alpha))
    }

    const sigmoid2 = (x : number , a : number , b : number) => {
        return sigmoid1(x,a) * (1- sigmoid1(x,b))
    }

    const sigmoidM = (x :number , y : number, m : number) => {
        return x * ( 1 - sigmoid1(m, 0.5) ) + y * sigmoid1(m, 0.5)
    }

    const transitionFunc_S = (n : number, m : number ) => {
        //If the transition function in the discrete time-stepping scheme was sd(n, m) then the smooth one is s(n, m) = 2sd(n, m)−1.
        return 2 * sigmoid2(n, sigmoidM(b1,d1,m), sigmoidM(b2,d2,m) ) - 1
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

                generalizeTransitionFunc()
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