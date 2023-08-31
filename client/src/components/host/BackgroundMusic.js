import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import bgMusic from "./sounds/bgmusic4.wav";
import bgMusic2 from "./sounds/bgmusic5.wav";

function BackgroundMusic({ stage, notificationApi }) {
  const [play1, { stop: stop1, sound: sound1 }] = useSound(bgMusic, {
    loop: true,
    volume: 0.2,
  });

  const [play2, { stop: stop2, sound: sound2 }] = useSound(bgMusic2, {
    loop: true,
    playbackRate: 0.8,
    volume: 0.2,
  });

  console.log(sound1);

  useEffect(() => {
    // Check loading status for music
    if (!sound1 || !sound2) {
      notificationApi.loading({
        content: "Trying to connect to server...",
        duration: 0,
        style: { width: "100%", alignItems: "center" },
      });
    }
  }, [sound1, sound2]);

  useEffect(() => {
    if (!stage || stage === "register") {
      play1();
    } else {
      play2();
    }

    return () => {
      stop1();
      stop2();
    };
  }, [stage]);

  return null; // This component doesn't render anything visually
}

export default BackgroundMusic;
