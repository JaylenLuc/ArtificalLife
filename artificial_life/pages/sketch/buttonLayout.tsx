"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'

const ButtonLayout = ( {setStrokePolicy,strokePolicy}:{setStrokePolicy: React.Dispatch<React.SetStateAction<boolean>>, strokePolicy: boolean}) =>{
    const buttonref = useRef(null)!;
    const [scope, animate] = useAnimate()
    const [strokeButtonText, setStrokeButtonText] = useState("Remove Cell Stroke") //Add Cell Stroke
    const colors = ['#FFD1DC','#C3B1E1']
    var bit = 0 
    const [buttonColor, setButtonColor] = useState(colors[bit])
    const _strokeButtonUpdate = () => {
        setButtonColor(colors[bit  % 2])
        animate(scope.current, {
            transition : {
            duration: 0.3,
            
            scale: {
            type: "spring",
            damping: 5,
            stiffness: 100,
            restDelta: 0.001,
            },
        }})
    }
    const strokeButtonClicked = () => {
        console.log(strokePolicy)
        setStrokePolicy(!strokePolicy)
        
        strokePolicy? setStrokeButtonText("Add Cell Stroke"):  setStrokeButtonText("Remove Cell Stroke") 
        strokePolicy ? bit = 1 : bit = 0
        
        animate('#FFD1DC','#C3B1E1', {
            onUpdate: latest => _strokeButtonUpdate()
        })

    }   
    return (
        <div className={styles.buttonlayout}>
            
            <div className = {styles.button_stroke}>
                <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                className={styles.button_stroke}
                style={{backgroundColor: buttonColor}}
                ref={scope}
                animate={ { opacity: 1, scale: 1}}
                transition={{
                  duration: 0.3,
                  ease: [0, 0.71, 0.2, 1.01],
                  scale: {
                    type: "spring",
                    damping: 5,
                    stiffness: 100,
                    restDelta: 0.001
                  }
                }}
                //animate= {{ opacity : 1, scale : 1, x: 170, transition :  {ease: "easeOut", duration: .7} }}
                onClick={() => strokeButtonClicked()}
                >
                    <span className={styles.buttonText}> {strokeButtonText} </span>
                </motion.div>
                
            </div>
        </div>
    )
}

export default ButtonLayout