import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

const Timer = ({ timeEnd, fontSize = 24 }) => {
  const [remainingTime, setRemainingTime] = useState("");

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
      setRemainingTime(`${minutes}:${seconds}`);
    };

    calculateRemainingTime();
    timer = setInterval(calculateRemainingTime, 110);

    return () => clearInterval(timer);
  }, [timeEnd]);

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
