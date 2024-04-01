"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'

const ButtonLayout = ( {setStrokePolicy,strokePolicy}:{setStrokePolicy: React.Dispatch<React.SetStateAction<boolean>>, strokePolicy: boolean}) =>{
    const [scope, animate] = useAnimate()
    const [strokeButtonText, setStrokeButtonText] = useState("Remove Cell Stroke") //Add Cell Stroke

    const strokeButtonClicked = () => {
        console.log(strokePolicy)
        setStrokePolicy(!strokePolicy)
        
        strokePolicy? setStrokeButtonText("Add Cell Stroke"):  setStrokeButtonText("Remove Cell Stroke") 
        // animate(scope.current, 


        // )

        animate(scope.current, 
            {
                rotate : 360
            },

            {
                duration: 0.5,
                onComplete() {
                animate(scope.current, { rotate: 0 }, { duration: 0 });
                },
            })
            //follow video for intrusctios on stars
        
        // { opacity: 1, scale: 1.5, transition : {
        //     duration: 2.5,
        //     ease: [0, 1, 0.3, 1.01],
        //     scale: {
        //       type: "spring",
        //       damping: 5,
        //       stiffness: 100,
        //       restDelta: 0.001
        //     }
        //   }}
        // ,
        // {
        //     duration: 0.5,
        //     onComplete() {
        //     animate(scope.current, { scale : 1});
        //     },
        // }
        
    }   
    return (
            <div className = {styles.button_stroke}>
                <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                className={styles.button_stroke}
                style={{backgroundColor: "#cebaa0"}}
                ref={scope}
                animate={ { opacity: 1, scale: 1}}
                transition={{
                  duration: 2.5,
                  ease: [0, 1, 0.3, 1.01],
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
    )
}

export default ButtonLayout