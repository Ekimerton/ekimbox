import React from "react";

const TriangleBackground = () => {
  const triangles = [
    "hsl(320,100%,70%)",
    "hsl(240,100%,70%)",
    "hsl(160,100%,70%)",
    "hsl(80,100%,70%)",
  ];

  const shapes = Array.from({ length: 60 }, (_, i) => (
    <svg
      key={i}
      className="shape"
      viewBox="0 0 100 115"
      preserveAspectRatio="xMidYMin slice"
    >
      {triangles.map((color, index) => (
        <polygon key={index} fill="none" stroke={color} strokeWidth="5">
          <animate
            attributeName="points"
            repeatCount="indefinite"
            dur="4s"
            begin={`${index}s`}
            from="50 57.5, 50 57.5, 50 57.5"
            to="50 -75, 175 126, -75 126"
          />
        </polygon>
      ))}
    </svg>
  ));

  return <div className="triangle-container">{shapes}</div>;
};

export default TriangleBackground;
