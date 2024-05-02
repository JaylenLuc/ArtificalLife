"use client"
import React, { MouseEventHandler, SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'
import {ButtonProps} from './ButtonProp';
interface InputProps {
    children: any;
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
    step = 0.001,

  }: InputProps) {

    const change = (e : any ) => {
        let targetVal = parseFloat(e.target.value)
        console.log("val being set: ",e.target.value, " ", targetVal)
        // if (!isNaN(targetVal) ){
        set(e.target.value)
        // }else if (e.target.value == "." || e.target.value == "0."){
        //     set(e.target.value)
        // }else{
        //     set("")
        // }
        
    }

    return (
      <label>
        <code>{children}</code>
        <input
        className={styles.slider_thumb}
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
          type="float"
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
  

const Slider = ({setb1, b1, setb2, b2, setd1, d1, setd2, d2, setrad, rad,setm,setn,n,m}:
    {
        setb1: Function, b1: number,
        setb2:  Function, b2: number,
        setd1:  Function, d1: number,
        setd2 : Function, d2: number,
        setrad : Function , rad : number,
        setm : Function ,setn : Function,n : number,m : number
    }) => {


    return (
        <div>
            <div >
                <Input value={b1} set={setb1}  max={1} min={0}>
                    <span className = {styles.buttonText}>Birth 1</span>
                </Input>
            </div>
            <div>
                <Input value={b2} set={setb2}  max={1} min={0}>
                <span className = {styles.buttonText} >Birth 2</span>
                </Input>
            </div>
            <div>            
                <Input value={d1} set={setd1}  max={1} min={0}>
                <span className = {styles.buttonText}>Death 1</span>
                </Input>
            </div>
            <div>            
                <Input value={d2} set={setd2}  max={1} min={0}>
                <span className = {styles.buttonText}>Death 2</span>
                </Input>
            </div>
            <div>            
                <Input value={rad} set={setrad} max={60} min={1}>
                <span className = {styles.buttonText}>Radius</span>
                </Input>
            </div>
            <div>            
                <Input value={n} set={setn}  max={1} min={0}>
                <span className = {styles.buttonText}>alphaN</span>
                </Input>
            </div>
            <div>            
                <Input value={m} set={setm} max={1} min={0} >
                <span className = {styles.buttonText}>alphaM</span>
                </Input>
            </div>

            {/* <button className={styles.paramButton}></button> */}
        </div>

      );

}

export default Slider;
