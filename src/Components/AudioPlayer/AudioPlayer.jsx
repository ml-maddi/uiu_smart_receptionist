/**
 * This componenet is used to play audio in pages.
 */
import { useContext, useEffect } from "react";
import { AppStateContext } from "../../AppContext";

// takes audio file that will be played
// the condition upon becoming true, the audio will be played
// delayTime = after the condition becomes true, then after how many miliseconds the audio will be played

const AudioPlayer = ({ condition, delayTime = 3000 }) => {
  const { globalState, stopCurrentAudio, playNewAudio } =
    useContext(AppStateContext);

  // when audio playing finishes, some cleanup code runs
  useEffect(() => {
    if (globalState.stopCurrentlyPlayingAudio === true) {
      stopCurrentAudio();
    }

    let timer;
    if (condition) {
      timer = setTimeout(() => {
        playNewAudio();
      }, delayTime);
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [condition, globalState.stopCurrentlyPlayingAudio === true]);

  return <div style={{ visibility: "hidden" }}>AudioPlayer</div>;
};

export default AudioPlayer;
