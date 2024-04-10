"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'
import { ButtonProps } from './ButtonProp';
//{setSeed, resetHandler}:{setSeed: React.Dispatch<React.SetStateAction<number>>, resetHandler : ButtonProps}
const SeedInput = ( {setSeed, seedUser }: { setSeed : Function , seedUser : number}) =>{
    const [scope, animate] = useAnimate()
    const [scope1, animate1] = useAnimate()
    const [scope2, animate2] = useAnimate()
    const [seedInputText, setSeedText] = useState("");

    const resetSeed = () => {
        if (seedUser != 0){
            setSeed(0)
            setSeedText("")

        }
        animate(scope1.current, 
            {
                rotate : 360
            },

            {
                duration: 0.5,
                onComplete() {
                animate(scope1.current, { rotate: 0 }, { duration: 0 });
                },
        })
        animateWhole();

    }

    const setSeedTextArea = (e : any) => {
        setSeedText(e)


    }


    const seedButtonClicked = () => {

        //if no input the default value is 0???
        let newSeed = Number (seedInputText)
        if (!isNaN(newSeed) && newSeed > 0 && seedUser != newSeed && seedInputText.length <= 8) { 
            console.log("valid and set")
            setSeed(newSeed)
            console.log(seedUser)
        } else{ 
            setSeedText("")
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

        animateWhole();
        

        
    }   


    const animateWhole = () => {

        
        animate(scope2.current, 
            {
                scale: 0.8,
                borderRadius: "30%",
            },

            {
                duration: 0.3,
                onComplete() {
                animate(scope2.current, { scale : 1, borderRadius: "10%" }, { duration: 0.2 }, );
                },
            })
    }
    return (
            <div>
                <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                className={styles.seedButtonLayout}
                ref = {scope2}
                // whileTap={{
                //     scale: 0.8,
                //     borderRadius: "100%",
                //     transition: { duration: .3 }
                // }}
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
                            ref={scope}
                            className={styles.seedInputButton}
                            onClick={seedButtonClicked}
                            title="initiliaze Life Seed"
                        ><div className={styles.buttonText}> Set Life Seed</div></button>
                        

                        <button
                            ref={scope1}
                            className={styles.seedInputButton}
                            onClick={resetSeed}
                            title="Reset Life Seed to Default"
                        ><div className={styles.buttonText}>Reset Life Seed</div></button>


                </motion.div>
                
            </div>
    )
}

export default SeedInput

