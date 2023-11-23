import React from 'react'
import Lottie from 'lottie-react';
import AdminAnim from './../../../../../assets/AdminAnimation.json';
import { useSpring, animated } from 'react-spring';


function AdminAnimation() {
  return (
    <Lottie
        animationData={AdminAnim} // Replace with your animation data
        loop={true} // Set to true to make the animation loop continuously
        autoplay={true} 
        className=" mt-0 w-36 ml-4"
      />
  )
}

export default AdminAnimation