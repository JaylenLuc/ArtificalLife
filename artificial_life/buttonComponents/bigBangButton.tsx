"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import {ButtonProps} from './ButtonProp';
import styles from './styles.module.css'

type AnimationSequence = Parameters<typeof animate>[0];

const BigBangButton = ({ resetHandler }: ButtonProps) =>{
    const [scope, animate] = useAnimate()
    const stars = Array.from({length: 48});    
    const randomNumber = (max : number , min : number) => {
      return Math.floor(Math. random() * (max - min + 1) + min)
    }
    const stars_animation : AnimationSequence = stars.map((_, index)=> [
      `.sparkle-${index}`,
      {
        x : randomNumber(-300,300),
        y : randomNumber(-400,400),
        scale : randomNumber(0.2,3.8),
        opacity : 1,

      }, 
      {
        duration : .8,
        at: "<"
      }
    ])
    
    const stars_animation_fade_out : AnimationSequence = stars.map((_, index)=> [
      `.sparkle-${index}`,
      {
        opacity : 0,
        scale : 0

      }, 
      {
        duration : .8,
        at: "<"
      }
    ])

    const stars_animation_reset : AnimationSequence = stars.map((_, index)=> [
      `.sparkle-${index}`,
      {
        x : 0,
        y : 0

      }, 
      {
        duration : .000001,
      }
    ])
    

    useEffect(() => {
      // Update the document title using the browser API
      animate([...stars_animation_reset, ...stars_animation, ...stars_animation_fade_out])
    });
    
    const animateStars = () => {
      animate(scope.current, 
        {
            scale: 0.8,
        },

        {
            duration: 0.3,
            onComplete() {
            animate(scope.current, { scale : 1}, { duration: 0.2 }, );
            },
        })
    
      animate([...stars_animation_reset, ...stars_animation, ...stars_animation_fade_out])
    }

    return (
            <div  className= {styles.bigBangButt}>
                <motion.div
                className= {styles.bigBangButt}
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
                onClick={resetHandler}
                onTap={animateStars}
                //animate= {{ opacity : 1, scale : 1, x: 170, transition :  {ease: "easeOut", duration: .7} }}
                >
                    <span className={styles.buttonText}>Reverse Entropy</span>
                    <span 
                      aria-hidden 
                      className='absolute inset-0 opacity-0 -z-10 pointer-events-none'
                    >
                      {Array.from({length: 48}).map((_,index) => (
                        <svg key= {index} viewBox="0 0 122 117" width="10" height="10" className={`absolute  opacity-0 left-1/2 top-1/4 sparkle-${index}`}>
                            <path
                              fill=	"#FFFAA0"
                              d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,
                              116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z"
                            />
                        </svg>
                        ))}
                      
                    </span>
                </motion.div>
                
            </div>
    )
}

export default BigBangButton;