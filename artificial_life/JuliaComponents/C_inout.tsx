
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"

import styles from './styles.module.css'

const C_inout = ( {c, setC }: { setC : React.Dispatch<React.SetStateAction<number[]>> , c : number[]}) => {
    const changeC = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.split(' ').map(parseFloat);
        setC(newValue)
      };
    const format = () => {
        return c[0].toFixed(5) + ( c[1] > 0 ? ' + ' : ' ') + c[1].toFixed(5) + 'i';
    }

    useEffect(() => {
        //console.log("here",c)
      }, []);
    return (
        <input 
            className = {styles.c_inout} 
            value = {format() } 
            onChange={(e) => changeC(e)}
            readOnly
            
        />

    ) 
}



export default C_inout;