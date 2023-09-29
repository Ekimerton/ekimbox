import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import bgMusic from "./sounds/bgmusic4.wav";
import bgMusic2 from "./sounds/bgmusic5.wav";
import bgMusic3 from "./sounds/bgmusic3.wav";

function BackgroundMusic({ stage, messageApi }) {
  const [isMusic1Loaded, setMusic1Loaded] = useState(false);
  const [isMusic2Loaded, setMusic2Loaded] = useState(false);
  const [isMusic3Loaded, setMusic3Loaded] = useState(false);

  const [play1, { stop: stop1 }] = useSound(bgMusic, {
    loop: true,
    volume: 0.07,
    onload: () => setMusic1Loaded(true),
  });

  const [play2, { stop: stop2 }] = useSound(bgMusic2, {
    loop: true,
    playbackRate: 1,
    volume: 0.1,
    onload: () => setMusic2Loaded(true),
  });

  const [play3, { stop: stop3 }] = useSound(bgMusic3, {
    loop: true,
    volume: 0.1,
    onload: () => setMusic3Loaded(true),
  });

  useEffect(() => {
    // Check loading status for music
    if (!isMusic1Loaded || !isMusic2Loaded || !isMusic3Loaded) {
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
      if (stage === "register") {
        play1();
      } else if (stage === "answer" || stage === "score") {
        play3();
      } else if (stage === "vote") {
        play2();
      } else {
        play1();
      }
    }

    return () => {
      stop1();
      stop2();
      stop3();
    };
  }, [stage, isMusic1Loaded, isMusic2Loaded]); // Add the loaded states to the dependency array

  return null; // This component doesn't render anything visually
}

export default BackgroundMusic;
