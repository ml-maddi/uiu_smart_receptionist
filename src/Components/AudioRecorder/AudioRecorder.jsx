/**
 * This componenet is used to record speaker audio.
 */

import { Button, IconButton } from "@mui/material";
import React, { useState, useRef, useContext } from "react";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { AppStateContext } from "../../AppContext";
const AudioRecorder = () => {
  // some state variables to handle audio playing logics
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimeout = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const { setGlobalState } = useContext(AppStateContext);

  // func gets called upon start of the recording
  const startRecording = async () => {
    try {
      // Reset any previous audio context and analyzer
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);

      audioChunks.current = []; // Reset chunks on each recording start
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      // when recording is done handles the received audio data
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        if (audioBlob.size > 0) {
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log("Audio URL:", audioUrl); // Use this URL to play or download the recorded audio
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64data = reader.result.split(",")[1];
            console.log(base64data);
            setGlobalState((prevState) => ({
              ...prevState,
              currentNameData: base64data,
              componentStates: {
                ...prevState.componentStates,
                getStartedModalStates: {
                  ...prevState.componentStates.getStartedModalStates,
                  nameAudioProcessing: true,
                },
              },
            }));
          };
        } else {
          console.warn("Recording resulted in an empty blob.");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      detectSilence();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // handles recording stop event
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    // Clear timeout if it exists
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
      silenceTimeout.current = null;
    }
  };

  // func that detects  silence and stops recording accordingly
  const detectSilence = () => {
    const buffer = new Uint8Array(analyserRef.current.fftSize);
    const checkSilence = () => {
      analyserRef.current.getByteTimeDomainData(buffer);
      const isSilent = buffer.every((value) => Math.abs(value - 128) < 5);

      if (isSilent) {
        if (!silenceTimeout.current) {
          silenceTimeout.current = setTimeout(stopRecording, 5000);
        }
      } else {
        if (silenceTimeout.current) {
          clearTimeout(silenceTimeout.current);
          silenceTimeout.current = null;
        }
      }

      if (isRecording) {
        requestAnimationFrame(checkSilence);
      }
    };
    checkSilence();
  };

  return (
    <IconButton
      sx={{
        width: "4rem",
        height: "4rem",
        borderRadius: "50%",
        border: "2px solid gray",
        bgcolor: isRecording === false ? "white" : "orange",
      }}
      onClick={isRecording === false ? startRecording : stopRecording}
    >
      <MicNoneIcon
        sx={{
          fontSize: "3rem",
          color: isRecording === false ? "gray" : "white",
        }}
      />
    </IconButton>
    // <>
    //   {isRecording === false ? (
    //     <IconButton
    //       sx={{
    //         width: "4rem",
    //         height: "4rem",
    //         borderRadius: "50%",
    //         border: "2px solid gray",
    //       }}
    //       onClick={startRecording}
    //     >
    //       <MicNoneIcon
    //         sx={{
    //           fontSize: "3rem",
    //           color: "gray",
    //         }}
    //       />
    //     </IconButton>
    //   ) : (
    //     <IconButton
    //       sx={{
    //         width: "4rem",
    //         height: "4rem",
    //         borderRadius: "50%",
    //         bgcolor: "orange",
    //         border: "2px solid gray",
    //       }}
    //       onClick={stopRecording}
    //     >
    //       <MicNoneIcon
    //         sx={{
    //           fontSize: "3rem",
    //           color: "white",
    //         }}
    //       />
    //     </IconButton>
    //   )}
    // </>
  );
};

export default AudioRecorder;
