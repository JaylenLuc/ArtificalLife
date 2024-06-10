import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

const ClickAway = () => {
    
    const images=[
            './images/ca1.png',
            './images/ca2.png',
            './images/ca3.png',
            
    ]
        

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to loop through images
  const loopImages = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };


  useEffect(() => {
    const interval = setInterval(loopImages, 200);
    return () => clearInterval(interval);
  }, [currentIndex]); 

  return (

      <img className = {styles.buttonone} src={images[currentIndex]}  alt={`Image ${currentIndex}`} />

  );
};

export default ClickAway;