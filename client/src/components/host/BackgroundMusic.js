import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import bgMusic from "./sounds/bgmusic4.wav";
import bgMusic2 from "./sounds/bgmusic5.wav";

function BackgroundMusic({ stage, messageApi }) {
  const [isMusic1Loaded, setMusic1Loaded] = useState(false);
  const [isMusic2Loaded, setMusic2Loaded] = useState(false);

  const [play1, { stop: stop1 }] = useSound(bgMusic, {
    loop: true,
    volume: 0.01,
    onload: () => setMusic1Loaded(true),
  });

  const [play2, { stop: stop2 }] = useSound(bgMusic2, {
    loop: true,
    playbackRate: 0.8,
    volume: 0.01,
    onload: () => setMusic2Loaded(true),
  });

  useEffect(() => {
    // Check loading status for music
    if (!isMusic1Loaded || !isMusic2Loaded) {
      messageApi.loading({
        content: "Loading music...",
        duration: 0,
        style: { width: "100%", alignItems: "center" },
        key: "musicLoading",
      });
    } else {
      messageApi.destroy("musicLoading"); // Destroy loading notification once both tracks are loaded
    }
  }, [isMusic1Loaded, isMusic2Loaded]);

  useEffect(() => {
    if (isMusic1Loaded && isMusic2Loaded) {
      // Ensure music is loaded before playing
      if (!stage || stage === "register") {
        play1();
      } else {
        play2();
      }
    }

    return () => {
      stop1();
      stop2();
    };
  }, [stage, isMusic1Loaded, isMusic2Loaded]); // Add the loaded states to the dependency array

  return null; // This component doesn't render anything visually
}

export default BackgroundMusic;
