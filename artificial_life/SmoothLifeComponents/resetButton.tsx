"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import {ButtonProps} from './ButtonProp';
import styles from './styles.module.css'

type AnimationSequence = Parameters<typeof animate>[0];

const ResetButton = ({ resetSettings } :{resetSettings : Function}) =>{
    const [scope, animate] = useAnimate()
    // const stars_num = 50
    // const stars = Array.from({length: stars_num});    
    // const randomNumber = (max : number , min : number) => {
    //   return Math.floor(Math. random() * (max - min + 1) + min)
    // }

    // const stars_animation : AnimationSequence = stars.map((_, index)=> [
    //   `.sparkle-${index}`,
    //   {
    //     x : randomNumber(-300,300),
    //     y : randomNumber(-400,400),
    //     scale : randomNumber(0.2,3.8),
    //     opacity : 1,

    //   }, 
    //   {
    //     duration : .8,
    //     at: "<"
    //   }
    // ])
    
    // const stars_animation_fade_out : AnimationSequence = stars.map((_, index)=> [
    //   `.sparkle-${index}`,
    //   {
    //     opacity : 0,
    //     scale : 0

    //   }, 
    //   {
    //     duration : .8,
    //     at: "<"
    //   }
    // ])

    // const stars_animation_reset : AnimationSequence = stars.map((_, index)=> [
    //   `.sparkle-${index}`,
    //   {
    //     x : 0,
    //     y : 0

    //   }, 
    //   {
    //     duration : .000001,
    //   }
    // ])
    

    // useEffect(() => {
    //   // Update the document title using the browser API
    //   animate([...stars_animation_reset, ...stars_animation, ...stars_animation_fade_out])
    // });
    
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
            <div  className= {styles.resetButton}>
                <motion.div
                className= {styles.bigBangButt}
                initial={{ opacity: 0, scale: 0.5 }}
                style={{backgroundColor: "#dab894"}}
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
                onClick={(e) => resetSettings()}
                onTap={animateBounce}
                //animate= {{ opacity : 1, scale : 1, x: 170, transition :  {ease: "easeOut", duration: .7} }}
                >
                    <span className={styles.buttonText}>Reset Parameters</span>

                </motion.div>
                
            </div>
    )
}

export default ResetButton;