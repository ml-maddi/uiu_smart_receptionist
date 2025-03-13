import { Box, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React, { useContext, useState, useEffect, useRef } from "react";
import MicNoneIcon from "@mui/icons-material/MicNone";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// assets
import userImg from "../../Assets/user-photo.png";
import micImg from "../../Assets/mic_glow_animation/mic_basic_1.jpg";
// import "./mic_glow.css";
import "animate.css";

// constants
import { initState, translations } from "../../Constants";
// contexts

import { useNavigate } from "react-router-dom";
import { AppStateContext } from "../../AppContext";
import {
  handleConversationMicBtnPressed,
  QuestionAsking,
} from "../../Functions";
const Mic2 = () => {
  // context handler
  const { globalState, setGlobalState, addAudioToQueue, stopCurrentAudio } =
    useContext(AppStateContext);
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimeout = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const askQuestion = async () => {
    await QuestionAsking(
      globalState,
      setGlobalState,
      addAudioToQueue,
      navigate,
      globalState.currentQuestionData
    );
  };

  useEffect(() => {
    if (globalState.currentQuestionData !== "") {
      askQuestion();
    }
  }, [globalState.currentQuestionData]);

  const handleRecording = async () => {
    await stopCurrentAudio();
  };
  const startRecording = async () => {
    console.log("calling start recording");

    // if (audioContextRef.current && !audioContextRef.current.paused) {
    //   audioContextRef.current.pause();
    //   audioContextRef.current.currentTime = 0; // Reset the playback position
    // }
    stopCurrentAudio();
    handleConversationMicBtnPressed(setGlobalState);
    try {
      // Reset any previous audio context and analyzer
      //   if (audioContextRef.current) {
      //     audioContextRef.current.close();
      //   }

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
      // detectSilence();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

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
          ConversationStates: {
            ...prevState.pageStates.ConversationStates,
            micBtnPressed: false,
            stopListening: false,
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

  useEffect(() => {
    if (globalState.pageStates.ConversationStates.stopListening === true) {
      stopRecording();
    }
  }, [globalState.pageStates.ConversationStates.stopListening]);

  // continuousy detects silence for 7 seconds at once
  const detectSilence = () => {
    const buffer = new Uint8Array(analyserRef.current.fftSize);

    let silentStart = null; // Track when silence started
    const checkSilence = () => {
      // if (!isRecording) {
      //   console.log("Stopped recording, exiting silence detection.");
      //   return; // Stop checking if not recording
      // }

      // if (globalState.pageStates.ConversationStates.stopListening === true)
      //   return;

      analyserRef.current.getByteTimeDomainData(buffer);
      const isSilent = buffer.every((value) => Math.abs(value - 128) < 5);

      if (isSilent) {
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
    // if (globalState.pageStates.ConversationStates.stopListening === false){

    // }
    checkSilence();
  };

  return (
    <Stack
      direction="row"
      spacing={5}
      display="flex"
      sx={{ alignItems: "center" }}
    >
      {isRecording ? (
        <Avatar
          // className="animate__animated animate__pulse animate__infinite"
          sx={{
            width: "9rem",
            height: "9rem",
            // bgcolor: "#fff",
            backgroundSize: "cover",
            backgroundPosition: "center",

            animation: "micAnimation 8s infinite",
            // border: "0.5rem solid orange",
            // animation: `${spin} 1s infinite ease`,
            // backgroundImage: { glow_bg },
            // mixBlendMode: "exclusion",
          }}
          //   onClick={
          //     status === "recording" ? handleStopRecording : handleStartRecording
          //   }
          onClick={() =>
            isRecording === false ? startRecording() : stopRecording()
          }
        >
          <MicNoneIcon sx={{ color: "orange", fontSize: 70 }} />
        </Avatar>
      ) : (
        <Box
          className="animate__animated animate__pulse animate__infinite"
          sx={{
            width: "9rem",
            height: "9rem",
            // bgcolor: "orange",
            backgroundImage: `url(${micImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // border: "0.5rem solid orange",
            // animation: `${spin} 1s infinite ease`,
            // backgroundImage: { glow_bg },
            // mixBlendMode: "exclusion",
          }}
          //   onClick={
          //     status === "recording" ? handleStopRecording : handleStartRecording
          //   }
          onClick={() => (isRecording ? stopRecording() : startRecording())}
        ></Box>
      )}

      <Stack direction="column" spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {globalState.userName
            ? globalState.userName
            : translations[globalState.currentLanguage].userName}
        </Typography>
        <Typography variant="h5" color="#eb8908">
          {translations[globalState.currentLanguage].loginText}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Mic2;
