'use client'
import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";



const MovingFrame = () => {
  const tokensArr = ["~", "^", "."]
  const token_length = tokensArr.length
  const [currTokens, setCurrTokens] = useState([""]);


  const generateRand = () => {
    let newTokens = [];

    for (let i = 0; i < 640; i++) {
      if  (Math.random() > 0.5){
        newTokens.push(tokensArr[Math.floor(Math.random() * token_length)]);
      }
    }
    return newTokens;
  }

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrTokens(generateRand())   
    }, 400);
     
    return () => clearInterval(interval); 
  }, [])
  
  
  return (
    <div>
      <div className = {styles.smallwords}>{currTokens.map(token => <span className={styles.waveback}>{token}</span>)}</div>      
      <h1 className = {styles.bigwords}>I am the matter of my own work</h1>
      <div className = {styles.smallwords}>{currTokens.reverse().map(token => <span className={styles.wavefront}>{token}</span>)}</div>
    </div>
  );
}

export default MovingFrame