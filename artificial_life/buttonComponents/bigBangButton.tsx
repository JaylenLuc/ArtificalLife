"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import {ButtonProps} from './ButtonProp';
import styles from './styles.module.css'

const BigBangButton = ({ onClick }: ButtonProps) =>{
    const [scope, animate] = useAnimate()

    return (
            <div className= {styles.bigBangButt}>
                <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                style={{backgroundColor: "#d2e7d6"}}
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
                onClick={onClick}
                //animate= {{ opacity : 1, scale : 1, x: 170, transition :  {ease: "easeOut", duration: .7} }}
                >
                    <span className={styles.buttonText}>Reverse Entropy</span>
                </motion.div>
                
            </div>
    )
}

export default BigBangButton;