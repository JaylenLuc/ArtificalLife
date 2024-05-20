"use client"
import { MouseEventHandler, useEffect, useState } from "react";
import { animate, motion, useAnimate, Variants } from "framer-motion";
import styles from './styles.module.css'
import Slider from "./slider";
import Sparkles from 'react-sparkle'
import {ButtonProps} from './ButtonProp';
import ResetButton from "./resetButton";
const itemVariants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };
  
export default function ParamNav({setb1, b1, setb2, b2, setd1, d1, setd2, d2, setrad, rad, resetSettings, setm, m ,setn, n, presets, setParameters}:
    {
        setb1: Function, b1: number,
        setb2:  Function, b2: number,
        setd1: Function, d1: number,
        setd2 : Function, d2: number,
        setrad : Function, rad : number,
        resetSettings : Function,
        setm :Function,
        m : number,
        setn : Function,
        n : number,
        setParameters : Function
        presets : {[key: string]: {[key: string] : number }} | null
    }) {
    const [scope, animate] = useAnimate()
     const setIsOpen = (val : boolean) => {
        _setIsOpen(val)
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
    const [isOpen, _setIsOpen] = useState(false);
    const getPreset = (e : any) => {
        let k = e.target.innerText
        setParameters(k)
        
    }

    useEffect(() => {
        // Update the document title using the browser API
        
      }, []);

    return (
        <div className = {styles.bar}>
            <motion.nav
            initial = {false}
            animate={isOpen ? "open" : "closed"}
            
            >
                <motion.button
                    ref = {scope}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={ { opacity: 1, scale: 1}}
                    className={styles.paramNavBar}
                    whileTap={{ scale: 0.5 }}
                    onClick={() => setIsOpen(!isOpen)}
                    transition={{
                        duration: 3.5,
                        ease: [0, 1, 0.3, 1.01],
                        scale: {
                        type: "spring",
                        damping: 5,
                        stiffness: 100,
                        restDelta: 0.001
                        }
                    }}
                    
                >

                <span className = {styles.buttonText}>Adjust Artifical Life Constants</span>
                    <motion.div
                    variants={{
                        open: { rotate: 180 },
                        closed: { rotate: 0 }
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ originY: 0.55 }}
                    >
                    <svg width="15" height="15" viewBox="0 0 20 20">
                        <path d="M0 7 L 20 7 L 10 16" />
                    </svg>

                    </motion.div>
                </motion.button>


                <motion.ul
                    className={styles.navul}
                    variants={{
                    open: {
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        transition: {
                        type: "spring",
                        bounce: 0,
                        duration: 0.7,
                        delayChildren: 0.3,
                        staggerChildren: 0.05
                        }
                    },
                    closed: {
                        clipPath: "inset(10% 50% 90% 50% round 10px)",
                        transition: {
                        type: "spring",
                        bounce: 0,
                        duration: 0.3
                        }
                    }
                    }}
                    style={{ pointerEvents: isOpen ? "auto" : "none" }}
                >
                    <motion.li className={styles.navli} variants={itemVariants}>
                        <Slider setd1 = {setd1} d1 = {d1} setd2= {setd2}
                    d2 = {d2} setb1={setb1} b1={b1} setb2={setb2} b2={b2} setrad = {setrad} rad = {rad} setm = {setm} setn = {setn} n ={n} m  ={m}/>
                    </motion.li>
                    <br></br>
                    <br></br>
                    { 
                    presets != null?
                    
                        <div className = {styles.presetdiv}>
                            <div className={styles.presetTextTitle}>PRESETS:</div>
                            <br></br>
                            {Object.entries(presets).map((entry : any) => (
                                <motion.li className={styles.navlipre} variants={itemVariants} key={entry[0]} onClick = { getPreset}>
                                    <p className = {styles.presetN}><span className = {styles.presetText}>{entry[0]}</span></p>
                                </motion.li>
                            ))}
                            </div> 
                        : <div className = {styles.presetdiv}>  <div className={styles.presetTextTitle}>PRESETS: NONE</div></div>
                    
                    }



                    <ResetButton resetSettings = {resetSettings}/>
                </motion.ul>

                
            </motion.nav>
        </div>
    );
}