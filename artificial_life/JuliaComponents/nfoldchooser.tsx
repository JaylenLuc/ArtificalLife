
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"

import styles from './styles.module.css'
//BROKEN COMPONENT

const NfoldChooser = ( {c, setC }: { setC : React.Dispatch<React.SetStateAction<number[]>> , c : number[]}) => {
    const changeC = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.split(' ').map(parseFloat);
        setC(newValue)
      };
    const format = () => {
        return c[0].toFixed(5) + ' ' + c[1].toFixed(5) + 'i';
    }

    useEffect(() => {
        //console.log("here",c)
      }, [c]);
    return (
        <input 
            className = {styles.c_inout} 
            value = {format() } 
            onChange={(e) => changeC(e)}
        />

    ) 
}



export default NfoldChooser;