"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'
import { ButtonProps } from './ButtonProp';
//{setSeed, resetHandler}:{setSeed: React.Dispatch<React.SetStateAction<number>>, resetHandler : ButtonProps}
const SeedInput = ( {setSeed, resetGrid, seedUser}: { setSeed : Function , resetGrid : Function, seedUser : number}) =>{
    const [scope, animate] = useAnimate()
    const [seedInputText, setSeedText] = useState("");

    const resetSeed = () => {
        if (seedUser != 0){
            setSeed(0)
            setSeedText("")

        }

    }

    const setSeedTextArea = (e : any) => {
        setSeedText(e)


    }


    const seedButtonClicked = () => {

        //if no input the default value is 0???
        let newSeed = Number (seedInputText)
        if (!isNaN(newSeed) && newSeed > 0 && seedUser != newSeed) { 
            console.log("valid and set")
            setSeed(newSeed)
            console.log(seedUser)
        } else{ 
            console.log("invalid seed")
        }
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

        
    }   
    return (
            <div >
                <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                ref={scope}
                className={styles.seedButtonLayout}
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
                >

                    <input className={styles.seedInputArea} onChange={(e) => setSeedTextArea(e.target.value)}  placeholder="Enter number > 0" value = {seedInputText} />
                    
                        <button
                            className={styles.seedInputButton}
                            onClick={seedButtonClicked}
                            title="initiliaze Life Seed"
                        >Set Life Seed</button>
                        

                        <button
                            className={styles.seedInputButton}
                            onClick={resetSeed}
                            title="Reset Life Seed to Default"
                        >Reset Life Seed</button>


                </motion.div>
                
            </div>
    )
}

export default SeedInput

