import { useState, useEffect } from "react";
import "./CircleTransition.css";

function useCircleTransition(duration = 10000, title = null, subtitle = null) {
  const [animate, setAnimate] = useState(false);

  const triggerAnimation = () => {
    setAnimate(true);
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [animate, duration]);

  // Define the CircleTransitionDiv Component
  const CircleTransitionDiv = (
    <div className={animate ? "transition-circle" : ""}>
      {title && <h1>{title}</h1>}
      {subtitle && <h3>{subtitle}</h3>}
    </div>
  );

  return {
    triggerAnimation,
    CircleTransitionDiv,
  };
}

export default useCircleTransition;
