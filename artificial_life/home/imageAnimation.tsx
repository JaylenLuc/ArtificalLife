import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

const MainImage = () => {
    
    const images=[
            './images/main1.jpg',
            './images/main2.jpg',
            './images/main3.jpg',
            './images/main4.jpg',
            './images/main5.jpg',
            './images/main6.jpg',
            './images/main7.jpg',
            './images/main8.jpg',
            './images/main9.jpg',
            './images/main10.jpg',
            './images/main11.jpg',
            
    ]

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to loop through images
  const loopImages = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Use useEffect to update the index and loop through images
  useEffect(() => {
    const interval = setInterval(loopImages, 200); // Change the delay as needed
    return () => clearInterval(interval);
  }, [currentIndex]); // Add currentIndex as dependency to re-run effect when index changes

  return (
    <div className = {styles.background}>
      <img src={images[currentIndex]} width="600" height="700" alt={`Image ${currentIndex}`} />
    </div>
  );
};

export default MainImage;