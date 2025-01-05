/**
 * This componenet is used to play audio in pages.
 */
import { useContext, useEffect } from "react";
import { AppStateContext } from "../../AppContext";

// takes audio file that will be played
// the condition upon becoming true, the audio will be played
// delayTime = after the condition becomes true, then after how many miliseconds the audio will be played

const AudioPlayer = ({ audioFile, condition, delayTime = 3000 }) => {
  const { globalState, setGlobalState, stopCurrentAudio, playNewAudio } =
    useContext(AppStateContext);

  // when audio playing finishes, some cleanup code runs
  useEffect(() => {
    const handleAudioEnded = () => {
      setGlobalState((prevState) => ({
        ...prevState,
        audioPlayDone: true,
      }));
      console.log("Audio playback has finished");
    };

    if (globalState.stopCurrentlyPlayingAudio === true) {
      stopCurrentAudio();
    }

    let timer;
    if (condition) {
      timer = setTimeout(() => {
        playNewAudio(audioFile);

        // Attach the event listener after starting playback
        const audio = new Audio(audioFile);
        audio.addEventListener("ended", handleAudioEnded);
      }, delayTime);
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [audioFile, condition, delayTime, globalState.stopCurrentlyPlayingAudio]);

  return <div style={{ visibility: "hidden" }}>AudioPlayer</div>;
};

export default AudioPlayer;
