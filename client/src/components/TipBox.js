import React, { useState, useEffect } from "react";
import "./TipBox.css"; // assuming the CSS is in this file

const tips = [
  "Turn up your volume for the best experience!",
  "You can play on your phone or computer by going to ekimbox.vercel.app",
  "Share your screen with your friends on Facetime or Discord!",
  "Full screen your browser with F11 on Windows or Cmd+Shift+F on Mac",
  "Game made by Ekim Karabey",
];

function TipBox() {
  const [tip, setTip] = useState(tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval); // This is to clear interval on component unmount
  }, []);

  return (
    <>
      <div
        className="card frosted-glass animated-border" // added 'animated-border' class
        style={{ padding: 4, paddingLeft: 12, paddingRight: 12 }}
      >
        <p style={{ fontSize: "0.8rem" }}>
          <strong>Tip:</strong> {tip}
        </p>
      </div>
    </>
  );
}

export default TipBox;
