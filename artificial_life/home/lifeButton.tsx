import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

const LifeButton = () => {
    
    const images=[
            './images/cf3.png',
            './images/cf.png',
            './images/cf2.png',
            './images/cf.png',
            
    ]
        

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to loop through images
  const loopImages = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };


  useEffect(() => {
    const interval = setInterval(loopImages, 280);
    return () => clearInterval(interval);
  }, [currentIndex]); 

  return (

      <img className = {styles.buttonone} src={images[currentIndex]}  alt={`Image ${currentIndex}`} />

  );
};

export default LifeButton;