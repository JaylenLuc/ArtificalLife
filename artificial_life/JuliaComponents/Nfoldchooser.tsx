
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"

import styles from './styles.module.css'
//BROKEN COMPONENT

const NfoldChooser = ( {fold, setFold, setC, def, c, def2} : { setFold : React.Dispatch<React.SetStateAction<number>> , 
    fold : number, setC : React.Dispatch<React.SetStateAction<number[]>> , def : number[], c : number[], def2 : number[]}) => {
    const changeFold = () => {
        
        setFold(fold == 1? 2 : 1)
        if (fold == 2){
            c[0] = def[0]
            c[1] = def[1]
            setC(def)
           // console.log(fold)
        }else if (fold == 1){
            c[0] = def2[0]
            c[1] = def2[1]
            setC(def2)
            //console.log("else if " , fold)
        }

      };


    useEffect(() => {
        //console.log("here",c)
      }, [fold, c]);
    return (
        <button 
            className = {styles.nfoldbutt} 
            onClick={(e) => changeFold()}
        >{ (fold == 1? "2 fold symmetry" : "3 fold symmetry")}</button>

    ) 
}



export default NfoldChooser;