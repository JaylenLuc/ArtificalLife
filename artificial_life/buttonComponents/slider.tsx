"use client"
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useForceUpdate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"
import styles from './styles.module.css'
interface InputProps {
    children: string;
    value: number;
    set: (newValue: number) => void;
    min?: number;
    max?: number;
  }
  
  function Input({
    value,
    children,
    set,
    min = 0,
    max = 1
  }: InputProps) {

    return (
      <label>
        <code>{children}</code>
        <input
          value={value}
          type="range"
          step={0.001}
          min={min}
          max={max}
          onChange={(e) => set(parseFloat(e.target.value))}
        />
        <input
          type="number"
          value={value}
          step={0.001}
          min={min}
          max={max}
          onChange={(e) => set(parseFloat(e.target.value) || 0)}
        />
      </label>
    );
  }
  

const Slider = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [delta, setDelta] = useState(0);

    return (
        <div>
            <div >
                <Input value={x} set={setX}>
                Alpha N 
                </Input>
            </div>
            <div>
                <Input value={y} set={setY}>
                Alpha M
                </Input>
            </div>
            <div>            
                <Input value={delta} set={setDelta}>
                Delta T
                </Input>
            </div>
        </div>

      );

}

export default Slider;
