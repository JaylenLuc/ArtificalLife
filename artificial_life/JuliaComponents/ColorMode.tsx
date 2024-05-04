
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"

import styles from './styles.module.css'
//BROKEN COMPONENT

const ColorMode = ( {mode, setColor, } : { setColor : React.Dispatch<React.SetStateAction<number>> , 
    mode : number,}) => {
    const mode1 = "Fractional Color Mode"
    const mode2 = "HSV Mode"
    const [text , settext] = useState(mode1)
    const changeColor = () => {
        if (mode == 1){
            setColor(2)
            settext(mode2)
        }else if (mode == 2){
            setColor(1)
            settext(mode1)
        }
      };


    useEffect(() => {
        //console.log("here",c)
      }, [mode, text]);
    return (
        <button 
            className = {styles.colormode} 
            onClick={(e) => changeColor()}
        >{ text}</button>

    ) 
}



export default ColorMode;