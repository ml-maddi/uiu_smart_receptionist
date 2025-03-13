/**
 * This componenet is used to continuously detect user face .
 */

import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AppStateContext } from "../../AppContext";

import { isFaceDetectedContinuous, setCurrentImageData } from "../../Functions";

import welcomeBn from "../../Assets/audios/sara_welcome_bn.mp3";
import welcomeEn from "../../Assets/audios/sara_welcome_en.mp3";
import {
  AudioPlayingStatus,
  DifferentPages,
  DifferentStages,
  initState,
} from "../../Constants";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  // background-color: #f0f0f0;
`;

const VideoElement = styled.video`
  display: none; // Hide the video element
`;

const ContinuousFaceDetect = () => {
  // state variables
  const { globalState, setGlobalState, addAudioToQueue, playNewAudio } =
    useContext(AppStateContext);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [stream, setStream] = useState(null);
  const [faceGotDetected, setFaceDetected] = useState(false);

  const welcomeAudioData = {
    name: "Welcome audio",
    file: globalState.currentLanguage === "bn" ? welcomeBn : welcomeEn,
    delay: 300,
    status: AudioPlayingStatus.NOT_STARTED,
  };

  useEffect(() => {
    // func that starts taking images through webcam
    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };

        const id = setInterval(() => {
          captureImage();
        }, 3000);
        setIntervalId(id);
      } catch (error) {
        stopWebcam(); // new
        console.error("Error accessing webcam: ", error);
      }
    };
    // func that stops taking images through webcam
    const stopWebcam = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null; // Ensure videoRef.current exists
        }
        setStream(null); // add
      }

      // Check if videoRef.current exists before accessing it
      // removed
      // if (videoRef.current) {
      //   videoRef.current.srcObject = null;
      // }

      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }

      // Ensure the stream and other related states are reset
      // remove   >= this was the culprit
      // setStream(null);
    };

    if (globalState.userInFront === true) {
      // Stop webcam if userId is not null
      stopWebcam();
    }
    // Start webcam if userId is null
    if (globalState.userInFront === false && !stream) {
      startWebcam();
    }

    // Cleanup function to stop the webcam and interval
    return () => {
      stopWebcam();
    };
  }, [globalState.userInFront, stream, intervalId]);

  //   useEffect(() => {
  //     console.log("I am running2");
  //     console.log(faceGotDetected);
  //     console.log(globalState.currentLanguage);

  //     if (faceGotDetected) {
  //     //   runCode();

  //     }
  //   }, [faceGotDetected]);

  // func that takes user face image
  const captureImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const imgData = canvas.toDataURL("image/png").split(",")[1];

    // console.log(imgData);
    console.log("Got image data");

    setCurrentImageData(setGlobalState, imgData);
    const faceDetected = await isFaceDetectedContinuous(
      imgData,
      setGlobalState
    );
    console.log(faceDetected);
    setFaceDetected(faceDetected);
  };

  useEffect(() => {
    if (faceGotDetected && globalState.userId === null) {
      addAudioToQueue(welcomeAudioData);
    }
  }, [faceGotDetected]);

  useEffect(() => {
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "Welcome audio" &&
      globalState.audioPlayingData.status === AudioPlayingStatus.NOT_STARTED
    ) {
      playNewAudio();
    }
  }, [globalState.audioPlayingData]);

  // useEffect(() => {
  //   if (
  //     globalState.audioPlayingData !== null &&
  //     globalState.audioPlayingData.name === "Welcome audio" &&
  //     globalState.audioPlayingData.status === AudioPlayingStatus.DONE
  //   ) {
  //     console.log("I am in timer section");
  //     // Start a 1-minute timer
  //     const timer = setTimeout(() => {
  //       // Check globalState value and call another function
  //       console.log("reset timer started");
  //       if (globalState.userId === null) {
  //         setGlobalState((prevState) => ({
  //           ...initState,
  //           currentPage: DifferentPages.GET_STARTED,
  //         }));
  //       }
  //     }, 180000); // 60 seconds

  //     // Cleanup the timer if the component unmounts or the dependency changes
  //     return () => clearTimeout(timer);
  //   }
  // }, [globalState.audioPlayingData]);

  // useEffect(() => {
  //   if (
  //     globalState.userInFront === true &&
  //     globalState.currentPage === DifferentPages.GET_STARTED
  //   ) {
  //     console.log("I am in timer 2 section");
  //     // Start a 1-minute timer
  //     const timer = setTimeout(() => {
  //       if (
  //         globalState.currentStage === DifferentStages.USER_IN_GET_STARTED_PAGE
  //       ) {
  //         // Check globalState value and call another function
  //         console.log(globalState.currentStage);
  //         console.log("reset timer 2 started");
  //         setGlobalState((prevState) => ({
  //           ...initState,
  //           currentPage: DifferentPages.GET_STARTED,
  //           currentStage: DifferentStages.USER_IN_GET_STARTED_PAGE,
  //         }));
  //       }
  //     }, 15000); // 10 seconds

  //     // Cleanup the timer if the component unmounts or the dependency changes
  //     return () => clearTimeout(timer);
  //   }
  // }, [globalState.userInFront]);

  return (
    <Container>
      <VideoElement ref={videoRef} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Container>
  );
};

export default ContinuousFaceDetect;
