/**
 * This componenet is used to record user voice and ask question using it.
 */

import React, { useContext, useState, useRef, useEffect } from "react";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { Box } from "@mui/material";
import axios from "axios";
import micBg1 from "../../Assets/rectangle-6.svg";
import { AppStateContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { handleGetStartedMicBtnPressed, QuestionAsking } from "../../Functions";
import { DifferentStages } from "../../Constants";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { StopCircleRounded } from "@mui/icons-material";

// No audio checking and notifying
const containsBangla = (str) => /[\u0980-\u09FF]/.test(str);

const Mic1 = () => {
  const { globalState, setGlobalState, addAudioToQueue, stopCurrentAudio } =
    useContext(AppStateContext);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimeout = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const navigate = useNavigate();

  // func that handles asking question, calls QuestionAsking() from functions.jsx file
  const askQuestion = async () => {
    await QuestionAsking(
      globalState,
      setGlobalState,
      addAudioToQueue,
      navigate,
      globalState.currentQuestionData
    );
  };

  // if the current question text data is not empty, call the backend api func handler
  useEffect(() => {
    if (globalState.currentQuestionData !== "") {
      askQuestion();
    }
  }, [globalState.currentQuestionData]);

  // func that is used to start audio recording
  const startRecording = async () => {
    stopCurrentAudio();
    // if (audioContextRef.current && !audioContextRef.current.paused) {
    //   audioContextRef.current.pause();
    //   audioContextRef.current.currentTime = 0; // Reset the playback position
    // }

    handleGetStartedMicBtnPressed(setGlobalState);
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
              currentQuestionData: base64data,
              notificationStates: {
                ...prevState.notificationStates,
                showNotification: true,
                notificationType: "success",
                notificationMessage: "Audio Received!",
              },
            }));
          };
        } else {
          setGlobalState((prevState) => ({
            ...prevState,
            notificationStates: {
              ...prevState.notificationStates,
              showNotification: true,
              notificationType: "error",
              notificationMessage: "Audio couldn't be understood!",
            },
          }));
          console.warn("Recording resulted in an empty blob.");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimeout(() => {
        detectSilence();
      }, 3000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // func that is used to stop audio recording

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setGlobalState((prevState) => ({
        ...prevState,
        pageStates: {
          ...prevState.pageStates,
          getStartedStates: {
            ...prevState.pageStates.getStartedStates,
            micBtnPressed: false,
          },
        },
      }));
    }
    // Clear timeout if it exists
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
      silenceTimeout.current = null;
    }
  };

  // continuousy detects silence for 7 seconds at once
  const detectSilence = () => {
    const buffer = new Uint8Array(analyserRef.current.fftSize);

    let silentStart = null; // Track when silence started
    const checkSilence = () => {
      // if (!isRecording) {
      //   console.log("Stopped recording, exiting silence detection.");
      //   return; // Stop checking if not recording
      // }

      analyserRef.current.getByteTimeDomainData(buffer);
      const isSilent = buffer.every((value) => Math.abs(value - 128) < 5);

      if (isSilent && isRecording) {
        if (!silentStart) {
          silentStart = performance.now(); // Start silence timer
          console.log("Silence detected. Timer started.");
        } else if (performance.now() - silentStart >= 5500) {
          console.log("5 seconds of silence detected. Stopping recording.");
          stopRecording();
          return;
        } else {
          console.log(
            `Silence ongoing for ${performance.now() - silentStart}ms.`
          );
        }
      } else {
        if (silentStart) {
          console.log("Sound detected. Resetting silence timer.");
        }
        silentStart = null; // Reset silent start if sound is detected
      }

      requestAnimationFrame(checkSilence); // Continue checking
    };

    console.log("Starting silence detection...");
    checkSilence();
  };

  return (
    <Box
      className={
        globalState.currentStage ===
        DifferentStages.SIGNED_USER_IN_GET_STARTED_PAGE
          ? "animate__animated animate__pulse animate__infinite"
          : ""
      }
      data-tooltip-id="my-tooltip"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "12rem",
        width: "18rem",
        position: "absolute",
        right: "1rem",
        top: "1rem",
        backgroundImage: `url(${micBg1})`,
        backgroundSize: "100% 100%",
      }}
      onClick={() =>
        isRecording === false ? startRecording() : stopRecording()
      }
    >
      {isRecording ? (
        <StopCircleOutlinedIcon
          className={
            globalState.currentStage ===
            DifferentStages.SIGNED_USER_IN_GET_STARTED_PAGE
              ? "animate__animated animate__pulse animate__infinite"
              : ""
          }
          sx={{
            color: "revert",
            fontSize: 90,
            ml: 4,
          }}
        />
      ) : (
        <MicNoneIcon
          className={
            globalState.currentStage ===
            DifferentStages.SIGNED_USER_IN_GET_STARTED_PAGE
              ? "animate__animated animate__pulse animate__infinite"
              : ""
          }
          sx={{
            color: "#fff",
            fontSize: 90,
            ml: 4,
          }}
        />
      )}
    </Box>
  );
};

export default Mic1;
