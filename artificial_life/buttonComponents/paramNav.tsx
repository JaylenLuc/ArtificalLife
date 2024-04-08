"use client"
import { MouseEventHandler, useState } from "react";
import { motion, Variants } from "framer-motion";
import styles from './styles.module.css'
import Slider from "./slider";
import Sparkles from 'react-sparkle'
import {ButtonProps} from './ButtonProp';
const itemVariants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };
  
export default function ParamNav({setb1, b1, setb2, b2, setd1, d1, setd2, d2}:
    {
        setb1: Function, b1: number,
        setb2:  Function, b2: number,
        setd1: Function, d1: number,
        setd2 : Function, d2: number,
    }) {
const [isOpen, setIsOpen] = useState(false);

return (
    <div>
        <motion.nav
        initial = {false}
        animate={isOpen ? "open" : "closed"}
        
        >
            <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={ { opacity: 1, scale: 1}}
                className={styles.paramNavBar}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpen(!isOpen)}
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
                 d2 = {d2} setb1={setb1} b1={b1} setb2={setb2} b2={b2} />
                </motion.li>

            </motion.ul>

            
        </motion.nav>
    </div>
);
}