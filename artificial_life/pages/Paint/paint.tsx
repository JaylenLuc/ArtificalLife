"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from "./styles.module.css";
import { abs } from 'mathjs';
const fft = require('jsfft');
import dynamic from "next/dynamic"; 
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
//FEATURE: move buttons anywhere the user likes, just drag ! left click hold or swipe on phone


export default function Paint () {
    const renderRef = useRef(null);
    const WIDTH_HEIGHT = 760
    const NUM_OBJ = 40
    const MAX_TERMS = 50
    const [curr_eq, set_eq] = useState("")
    let R: number[][] = []
    let G: number[][]= []
    let B: number[][] = []
    const [curr_file, setCurrFile] = useState("")
    const handleFileUpload = (e: any) => {
        const file = e.target.files[0]
        if (file) setCurrFile(URL.createObjectURL(file))

    } 


    const computeFastFFT = (matrix: number[][]): number[][] => {
        const size = matrix.length;
        const real = new Array(size).fill(0);
        const imag = new Array(size).fill(0);
    
        // Convert rows into real and imaginary parts
        for (let i = 0; i < size; i++) {
            real[i] = matrix[i];
            imag[i] = new Array(size).fill(0); // No imaginary components initially
        }
    
        // Perform 1D FFT on rows
        for (let i = 0; i < size; i++) {
            const ffti = new fft.ComplexArray(real[i]);
            ffti.FFT();
            real[i] = ffti.real;
            imag[i] = ffti.imag;
        }
    
        return [real, imag]; // Return real components of the FFT
    };
    
    const processImage = async () => {
        R = []
        G = []
        B = []
        const img = new Image();
        img.src = curr_file

        await new Promise((resolve) => (img.onload = resolve))

        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img,0,0)

        const imageData = ctx?.getImageData(0,0, canvas.width, canvas.height)
        
        for (let y = 0; y < imageData!.height; y++){
            const rowR: number[] = []
            const rowG: number[] = []
            const rowB: number[] = []
            for (let x = 0; x < imageData!.width; x++){
                const index = (y * imageData!.width + x) * 4
                const r = imageData!.data[index]
                const g = imageData!.data[index +1]
                const b = imageData!.data[index + 2]
                rowR.push(r)
                rowG.push(g)
                rowB.push(b)
            }
            R.push(rowR)
            G.push(rowG)
            B.push(rowB)

        }

    }

    const fftMode = (fftResult: any[], imgRes: any[],threshold=.0001) => {
        let equations : string[] = []
        let termCount = 0

        for (let y = 0; y < fftResult.length; y++){
            for (let x = 0; x < fftResult[0].length; x++) {
                if (abs(fftResult[y][x]) > threshold) {
                    let magnitude = Math.sqrt(fftResult[y][x] ** 2 + imgRes[y][x] ** 2);
                    const phase = Math.atan2(imgRes[y][x], fftResult[y][x]);
                    equations.push(`${magnitude.toFixed(2)} \\sin(${x} f_x + ${y} f_y + ${phase.toFixed(2)})`);
                    termCount += 1
                    if (termCount >= MAX_TERMS) break;
                }
                
                
            }
            if (termCount >= MAX_TERMS) break;
        }
        let res = equations.join(" + ")
        return  res;
  };

    const handleSub = async () => {
        await processImage() 

        set_eq("\\text{Computing frequencies, converting from spatial to frequency domain beep boop beep...} ")
        let current = ""
        console.log("here")
        //FFT MODE
        if (R.length === 0 || G.length === 0 || B.length === 0) {
            console.error("⚠️ Image data not loaded! Aborting FFT.");
            return;
        }
        
        console.log("Running FFT...");
    
        setTimeout(() => {
            const [fftR, imgR] = computeFastFFT(R);
            const [fftG, imgG] = computeFastFFT(G);
            const [fftB, imgB] = computeFastFFT(B);
    
            let current = `${fftMode(fftR, imgR)} + ${fftMode(fftG, imgG)} + ${fftMode(fftB, imgB)}`;
            set_eq(current);
            
            console.log("✅ FFT Complete:", current);
        }, 100); // Delay to allow UI to update
    }

    useEffect(() => {



    }, [ ])

    
return (

    <div className = {styles.main}>
        <div>
            <h1 style={{ color: "black" }}>Upload an Image for Equations Recognizing its Magnitude and Phase Information with 500 coefficient compression Using Fast Fourier Transformations</h1>
            <div >
            <label htmlFor="file-upload" className={styles.uploadthing}>
                Select File
            </label>
            <input
                type="file"
                id="file-upload"
                style={{ display: "none" }} // Hide the file input
                onChange={handleFileUpload}
            />
            </div>
            {curr_file && <img className={styles.pic} src={curr_file} style={{ minWidth:"30%", maxWidth: "30%", marginTop: "10px" }} ></img>} 
            <br></br>
        <button className={styles.button}disabled={!curr_file} onClick={handleSub}>Upload</button>
        </div>
        {/* {<span style={{ color: "black" }}>{curr_eq}</span>} */}

        <div style={{color : 'black'}}>
            <InlineMath math={"`A_{xy} \\sin(x f_x + y f_y + \\phi_{xy})`"}></InlineMath> 
        </div>
        <div className={styles.matheq} >
            <InlineMath  math={curr_eq} />
        </div>

    </div>

    )
}