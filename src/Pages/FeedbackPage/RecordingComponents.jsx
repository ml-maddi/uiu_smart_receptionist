import React, { useContext, useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { AppStateContext } from "../../AppContext";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { handleFeedbackSpeaking } from "../../Functions";

const RecordingComponents = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimeout = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const startRecording = async () => {
    console.log("I was clicked");
    // handleConversationMicBtnPressed(setGlobalState);
    try {
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
            // setGlobalState((prevState) => ({
            //   ...prevState,
            //   currentRatingDetailData: base64data,
            //   notificationStates: {
            //     ...prevState.notificationStates,
            //     showNotification: true,
            //     notificationType: "success",
            //     notificationMessage: "Audio Received!",
            //     processingAudio: true,
            //   },
            // }));
            handleFeedbackSpeaking(globalState, setGlobalState, base64data);
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
      detectSilence();
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
    <>
      {isRecording === true ? (
        <Stack
          direction="row"
          spacing={4}
          sx={{
            position: "absolute",
            bottom: "11rem",
            left: "5rem",
            // justifyContent: "space-between",
            width: "80%",
            // bgcolor: "green",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<MicIcon sx={{ fontSize: "2rem!important" }} />}
            sx={(theme) => ({
              fontWeight: "bold",
              color: "white",
              fontSize: "1.5rem",
              bgcolor: "orange",
              px: "1rem",
              py: "0.7rem",
              borderRadius: "2rem",
            })}
          >
            Listening...
          </Button>

          <Button
            variant="outlined"
            startIcon={<CloseIcon sx={{ fontSize: "1.5rem" }} />}
            sx={(theme) => ({
              fontWeight: "bold",
              color: theme.palette.grey[500],
              fontSize: "1.5rem",
              bgcolor: theme.palette.grey[100],
              px: "1rem",
              py: "0.7rem",
              borderRadius: "2rem",
            })}
            onClick={stopRecording}
          >
            Stop Recording
          </Button>
        </Stack>
      ) : (
        <Box
          direction="row"
          display="flex"
          sx={{
            position: "absolute",
            bottom: "11rem",
            left: "5rem",
            justifyContent: "space-between",
            width: "80%",
            zIndex: "10000",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<MicNoneIcon sx={{ fontSize: "2rem!important" }} />}
            sx={(theme) => ({
              fontWeight: "bold",
              color: "white",
              fontSize: "1.5rem",
              bgcolor: "orange",
              px: "1rem",
              py: "0.7rem",
              borderRadius: "2rem",
            })}
            onClick={() => {
              startRecording();
              // console.log("recording btn clicked");
            }}
          >
            Start Recording
          </Button>

          {/* <Button
            variant="outlined"
            sx={(theme) => ({
              color: theme.palette.grey[800],
              fontSize: "3rem",
              p: "0.5rem",
              bgcolor: theme.palette.grey[100],
              borderRadius: "50%",
            })}
            onClick={() => {
              startRecording();
              // console.log("recording btn clicked");
            }}
          >
            <MicNoneIcon fontSize="3rem" />
          </Button> */}
          {globalState.currentRatingDetailData !== null && (
            <Button
              variant="outlined"
              startIcon={<CloseIcon sx={{ fontSize: "1.5rem" }} />}
              sx={(theme) => ({
                fontWeight: "bold",
                color: theme.palette.grey[500],
                fontSize: "1.5rem",
                bgcolor: theme.palette.grey[100],
                px: "2rem",
                py: "0.7rem",
                borderRadius: "2rem",
              })}
            >
              Clear
            </Button>
          )}
        </Box>
      )}
    </>
  );
};

export default RecordingComponents;
