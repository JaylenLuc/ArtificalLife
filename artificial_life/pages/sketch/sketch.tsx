import React, { useEffect, useRef } from 'react';
//https://arxiv.org/pdf/1111.1567.pdf




const P5Sketch = () => {


    /********************************************************
         * UNIVERSAL LIFE CONSTANTS AND/OR VARS
    ********************************************************/

    const renderRef = useRef(null);
    var WIDTH_HEIGHT = 150 //the true number of cells WIDTH_HEIGHT ^ 2
    //const HEIGHT = 150
    var SIZE = 4
    const RGB_MIN_RANGE = 255 //min range

    /**** 
     * radius checks
     * ****/
    var ra = 11 //outer radius 
    var ri = ra/3 // inner radius 
    var ri_area = Math.PI * (ri*ri)
    var ra_area = (Math.PI * (ra*ra)) - (ri_area)

    /**** 
     * sigmoid alpha values
     * ****/
    var alpha_n = 0.028
    var alpha_m = 0.147
    //αn = 0.028, αm = 0.147

    /**** 
     * birth and death interval values given by [b1, b2] and [d1, d2] 
     * ****/
    var d1 = 0.267
    var d2 = 0.445
    var b1 = 0.278
    var b2 = 0.365

    /**** 
     * delta time
     * ****/
    var dt = 0.7 //time step


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
                p.noStroke()
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


    /******************************************************
    ********************************************************/

    useEffect(() => {
        const p5 = require("p5");

        const p5instance = new p5((p : any) => {
            p.setup = () => {
                p.createCanvas( WIDTH_HEIGHT * SIZE, WIDTH_HEIGHT * SIZE).parent(renderRef.current);
                //p.createGraphics( WIDTH_HEIGHT + 200,WIDTH_HEIGHT + 200)
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
        <>
            <meta name="viewport" content="width=device-width, initial-scale=3"></meta>
            <div id = "life_box" ref={renderRef}></div>
        </>
    )
}

export default P5Sketch;