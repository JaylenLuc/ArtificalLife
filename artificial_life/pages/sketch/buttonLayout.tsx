"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'

const ButtonLayout = ( {setStrokePolicy,strokePolicy}:{setStrokePolicy: React.Dispatch<React.SetStateAction<boolean>>, strokePolicy: boolean}) =>{

    const [strokeButtonText, setStrokeButtonText] = useState("Remove Cell Stroke") //Add Cell Stroke
    const colors = ['#FFD1DC','#C3B1E1']
    var bit = 0 
    const [buttonColor, seButtonColor] = useState(colors[bit])
    const strokeButtonClicked = () => {
        console.log(strokePolicy)
        setStrokePolicy(!strokePolicy)
        
        strokePolicy? setStrokeButtonText("Add Cell Stroke"):  setStrokeButtonText("Remove Cell Stroke") 
        strokePolicy ? bit = 1 : bit = 0
        
        animate('#FFD1DC','#C3B1E1', {
            duration: 2,
            onUpdate: latest => seButtonColor(colors[bit  % 2])
          })
    }

    return (
        <div className={styles.buttonlayout}>
            
            <div className = {styles.button_stroke}>
                <motion.div
                className={styles.button_stroke}
                style={{backgroundColor: buttonColor}}
                whileHover={{ scale : 1.5, rotate: 360}}
                animate={{ x: 170, transition : {ease: "easeOut", duration: .7} }}
                
                onClick={() => strokeButtonClicked()}
                >
                    <span className={styles.buttonText}> {strokeButtonText} </span>
                </motion.div>
                {/* <button className='button' onClick={() => strokeButtonClicked()}>{strokeButtonText}</button> */}
            </div>
        </div>
    )
}

export default ButtonLayout