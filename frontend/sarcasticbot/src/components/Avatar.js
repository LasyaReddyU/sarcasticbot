import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../lotties/skate.json';

const Avatar = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: '#4A90E2',}}>
      <Lottie 
        options={defaultOptions}
        height={400}
        width={400}
      />
      <h2 style={{ marginTop: '20px' }}>SarcasticBot</h2>
    </div>
  );
};

export default Avatar;
