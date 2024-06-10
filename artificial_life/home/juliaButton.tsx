import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

const JuliaButton = () => {
    
    const images=[
            './images/js1.png',
            './images/js2.png',
            './images/js3.png',
            
    ]
        

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to loop through images
  const loopImages = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };


  useEffect(() => {
    const interval = setInterval(loopImages, 210);
    return () => clearInterval(interval);
  }, [currentIndex]); 

  return (

      <img className = {styles.buttonone} src={images[currentIndex]}  alt={`Image ${currentIndex}`} />

  );
};

export default JuliaButton;