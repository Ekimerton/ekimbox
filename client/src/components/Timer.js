import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

const Timer = ({ timeEnd }) => {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    let timer = null;

    const calculateRemainingTime = () => {
      const now = moment().tz("America/New_York");
      const end = moment(timeEnd).tz("America/New_York");
      const duration = moment.duration(end.diff(now));
      const hours = duration.hours().toString().padStart(2, "0");
      const minutes = duration.minutes().toString().padStart(2, "0");
      const seconds = duration.seconds().toString().padStart(2, "0");
      setRemainingTime(`${hours}:${minutes}:${seconds}`);
    };

    calculateRemainingTime();
    timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [timeEnd]);

  return <p style={{ textAlign: "center" }}> [ {remainingTime} ]</p>;
};

export default Timer;
