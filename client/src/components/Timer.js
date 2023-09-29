import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import ticking from "./host/sounds/ticking.wav";
import useSound from "use-sound";

const Timer = ({ timeEnd, fontSize = 24, audible = false }) => {
  const [remainingTime, setRemainingTime] = useState("");

  const [playTicking] = useSound(ticking, {
    volume: 0.8,
    loop: false,
  });

  useEffect(() => {
    let timer = null;

    const calculateRemainingTime = () => {
      const now = moment().tz("America/New_York");
      const end = moment(timeEnd).tz("America/New_York");
      const duration = moment.duration(end.diff(now));

      const minutes = Math.max(duration.minutes(), 0)
        .toString()
        .padStart(2, "0");
      const seconds = Math.max(duration.seconds(), 0)
        .toString()
        .padStart(2, "0");

      if (minutes === "00" && seconds === "10" && audible) {
        playTicking();
      }
      setRemainingTime(`${minutes}:${seconds}`);
    };

    calculateRemainingTime();
    timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [timeEnd, playTicking]);

  return (
    <div
      className="card frosted-glass"
      style={{
        padding: 8,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: fontSize,
          margin: 0,
        }}
      >
        Time Left: {remainingTime}
      </p>
    </div>
  );
};

export default Timer;
