"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import styles from './styles.module.css'

type AnimationSequence = Parameters<typeof animate>[0];

const Savepreset = ({ savePreset } :{savePreset : Function}) =>{
    const [scope, animate] = useAnimate()
    const animateBounce = () => {
      animate(scope.current, 
        {
            scale: 0.8,
            
        },

        {
            duration: 0.1,
            onComplete() {
            animate(scope.current, { scale : 1}, { duration: 0.1 }, );
            },
        })

    }

    return (
            <div >
                <motion.div
                className= {styles.savepreset}
                initial={{ opacity: 0, scale: 0.5 }}
                
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
                onClick={(e) => savePreset()}
                onTap={animateBounce}
                //animate= {{ opacity : 1, scale : 1, x: 170, transition :  {ease: "easeOut", duration: .7} }}
                >
                    <span className={styles.buttonText}>save current settings</span>

                </motion.div>
                
            </div>
    )
}

export default Savepreset;