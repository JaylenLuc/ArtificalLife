import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

const ButtonOne = () => {
    
    const images=[
            './images/b1p1.png',
            './images/b1p2.png',
            './images/b1p3.png',
            
    ]
        

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to loop through images
  const loopImages = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };


  useEffect(() => {
    const interval = setInterval(loopImages, 180);
    return () => clearInterval(interval);
  }, [currentIndex]); 

  return (

      <img className = {styles.buttonone} src={images[currentIndex]}  alt={`Image ${currentIndex}`} />

  );
};

export default ButtonOne;