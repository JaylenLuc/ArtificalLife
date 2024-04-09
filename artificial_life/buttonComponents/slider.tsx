"use client"
import React, { MouseEventHandler, SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'
import {ButtonProps} from './ButtonProp';
interface InputProps {
    children: string;
    value: number;
    set:  Function;
    min?: number;
    max?: number;
    step? : number

  }
  //{setStrokePolicy,strokePolicy}:{setStrokePolicy: React.Dispatch<React.SetStateAction<boolean>>, strokePolicy: boolean}
  function Input({
    value,
    children,
    set,
    min = 0,
    max = 1,
    step = 0.001
  }: InputProps) {

    const change = (e : any ) => {
        console.log("val being set: ",parseFloat(e.target.value))
        set(parseFloat(e.target.value))
        
        
    }

    return (
      <label>
        <code>{children}</code>
        <input
          value={value}
          type="range"
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            
            change(e)
            return false;
        }}
        />
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange= {(e) => {
            change(e)
            return false;
        }}
        />
      </label>
    );
  }
  

const Slider = ({setb1, b1, setb2, b2, setd1, d1, setd2, d2, setrad, rad}:
    {
        setb1: Function, b1: number,
        setb2:  Function, b2: number,
        setd1:  Function, d1: number,
        setd2 : Function, d2: number,
        setrad : Function , rad : number
    }) => {


    return (
        <div>
            <div >
                <Input value={b1} set={setb1}>
                Birth 1
                </Input>
            </div>
            <div>
                <Input value={b2} set={setb2} >
                Birth 2
                </Input>
            </div>
            <div>            
                <Input value={d1} set={setd1}>
                Death 1
                </Input>
            </div>
            <div>            
                <Input value={d2} set={setd2}>
                Death 2
                </Input>
            </div>
            <div>            
                <Input value={rad} set={setrad} step = {1} max={30} min={1}>
                Radius
                </Input>
            </div>

            {/* <button className={styles.paramButton}></button> */}
        </div>

      );

}

export default Slider;
