"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from "./styles.module.css";

export default function art() {
   useEffect(() => {
        return () => {
            //console.log("cleaning up...");
            
            // comment this out to get 2 canvases and 2 draw() loops
          };
        


    }, [ ])

    
return (

    <div> 
        <meta name="viewport" content="width=device-height"></meta>
        <div className={styles.row}>
            <div className={styles.col}>
                <img src='/images/collage1.png' style={{'width':'100%'}}></img>
            </div>
            <div className={styles.col}>

                <img src='/images/collage2.png' style={{'width':'100%'}}></img>
            </div>
            <div className={styles.col}>

                <img src='/images/collage3.jpg' style={{'width':'100%'}}></img>
            </div>
            <div className={styles.col}>
                <img src='/images/collage4.jpeg' style={{'width':'100%'}}></img>
            </div>
        </div> 
        <div className={styles.row}>
            <div className={styles.col}>
           
            </div>
        </div>
    </div>

    )
}