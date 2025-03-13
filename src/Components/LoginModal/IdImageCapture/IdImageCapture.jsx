/**
 * This componenet is used to show  the face capturing component, circular area for the captured face.
 */

import React, { useRef, useState, useEffect, useContext } from "react";
import Webcam from "react-webcam";
//styles
import "./IdImageCapture.css";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { AppStateContext } from "../../../AppContext";
import {
  disableFaceRecogContinueBtn,
  isFaceDetectedInFaceRecogMethod,
  recognizeFace,
  resetFaceImageWeb,
  setFaceImageWeb,
  stopPlayingAudio,
} from "../../../Functions";
import { Tooltip } from "react-tooltip";
import {
  AudioPlayingStatus,
  DifferentStages,
  translations,
} from "../../../Constants";

import retakeContinueBn from "../../../Assets/audios/face_retake_contine_bn.wav";
import retakeContinueEn from "../../../Assets/audios/face_retake_contine_en.wav";

const IdImageCapture = () => {
  const webcamRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // to show the captured image in preview, global state image doesn't immediately show up
  const [countdown, setCountdown] = useState(3);
  const [isCapturing, setIsCapturing] = useState(false);
  const { globalState, setGlobalState, addAudioToQueue, playNewAudio } =
    useContext(AppStateContext);

  const resetCapture = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentStage: DifferentStages.USER_USING_IMAGE_TAKING_WINDOW_1,
    }));
    setIsPreview(false);
    resetFaceImageWeb(setGlobalState);
    setCapturedImage(null);
    setIsCapturing(false);
  };

  const startCapture = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentStage: "",
    }));
    stopPlayingAudio(setGlobalState);
    setIsCapturing(true);
    setIsPreview(false);
    setCountdown(3);
  };

  const RetakeContinueAudioData = {
    name: "RetakeContinue audio",
    file:
      globalState.currentLanguage === "bn"
        ? retakeContinueBn
        : retakeContinueEn,
    delay: 300,
    status: AudioPlayingStatus.NOT_STARTED,
  };

  useEffect(() => {
    if (
      isPreview &&
      globalState.componentStates.getStartedModalStates
        .retakeContinueAudioPlayed === false
    ) {
      addAudioToQueue(RetakeContinueAudioData);
    }
  }, [isPreview]);
  useEffect(() => {
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "RetakeContinue audio" &&
      globalState.audioPlayingData.status === AudioPlayingStatus.NOT_STARTED
    ) {
      playNewAudio();
    }
  }, [globalState.audioPlayingData]);

  // if face got detected, then  checks if user is already in the database ,  if not already registered creates user using the face value and takes user to name adding component
  // if user found as registered, take to Get Started page with mic button to enable asking question
  const handleContinueBtnPress = async () => {
    const faceDetected = await isFaceDetectedInFaceRecogMethod(
      globalState,
      setGlobalState
    );
    if (faceDetected === true) {
      await recognizeFace(globalState, setGlobalState);
    } else {
      setIsPreview(false);
    }
    // changed here === commented out full thing for testing recognition only
    // const faceDetected = await isFaceDetected(globalState, setGlobalState);
    // if (faceDetected === true) {
    //   // let userId = await recognizeFace(globalState, setGlobalState);
    //   // if (userId === null) {
    //   //   // userId = await createUserUsingFace(globalState, setGlobalState);
    //   //   gotoNameAdd(setGlobalState);
    //   // } else {
    //   //   await handleUserFound(setGlobalState, userId);
    //   // }
    // }
  };
  useEffect(() => {
    if (
      globalState.componentStates.getStartedModalStates
        .faceComponentContinueBtnPressed === true
    ) {
      handleContinueBtnPress();
    }
  }, [
    globalState.componentStates.getStartedModalStates
      .faceComponentContinueBtnPressed,
  ]);

  // after every 1 second takes user image
  useEffect(() => {
    if (isCapturing && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && isCapturing) {
      captureImage();
    }
  }, [isCapturing, countdown]);

  useEffect(() => {
    if (isPreview === true) {
      // if user face image is showing in the preview window,
      // show a tooltip first about two buttons usage
      setGlobalState((prevState) => ({
        ...prevState,
        currentStage: DifferentStages.USER_USING_IMAGE_RETAKING_WINDOW_2,
      }));

      // changed here === commented out full thing as tooltip showing is not mendatory
      // const showTooltipTimer = setTimeout(() => {
      //   setGlobalState((prevState) => ({
      //     ...prevState,
      //     // currentImageData: "",
      //     componentStates: {
      //       ...prevState.componentStates,
      //       getStartedModalStates: {
      //         ...prevState.componentStates.getStartedModalStates,
      //         showContinueToolTip: true,
      //       },
      //     },
      //   }));
      //   // Set the tooltip to false after 3 more seconds (total 5 seconds)
      //   const hideTooltipTimer = setTimeout(() => {
      //     setGlobalState((prevState) => ({
      //       ...prevState,
      //       // currentImageData: "",
      //       componentStates: {
      //         ...prevState.componentStates,
      //         getStartedModalStates: {
      //           ...prevState.componentStates.getStartedModalStates,
      //           showContinueToolTip: false,
      //         },
      //       },
      //     }));
      //   }, 5000); // 3 seconds after show
      //   // Cleanup for hideTooltipTimer
      //   return () => clearTimeout(hideTooltipTimer);
      // }, 2000); // initial 2 seconds delay
      // // Cleanup for showTooltipTimer
      // return () => clearTimeout(showTooltipTimer);
    }
  }, [isPreview]);

  // useEffect(() => {
  //   if (
  //     isPreview === true &&
  //     globalState.componentStates.getStartedModalStates
  //       .retakeContinueAudioPlayed === false
  //   ) {
  //     setTimeout(() => {
  //       setGlobalState((prevState) => ({
  //         ...prevState,
  //         // currentImageData: "",
  //         componentStates: {
  //           ...prevState.componentStates,
  //           getStartedModalStates: {
  //             ...prevState.componentStates.getStartedModalStates,
  //             retakeContinueAudioPlayed: true,
  //           },
  //         },
  //       }));
  //     }, 5000);
  //   }
  // }, [
  //   isPreview,
  //   globalState.componentStates.getStartedModalStates.retakeContinueAudioPlayed,
  // ]);

  // updates global state value using captured image value
  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFaceImageWeb(setGlobalState, imageSrc);
    setCapturedImage(imageSrc);
    setIsPreview(true);
    setIsCapturing(false);
    disableFaceRecogContinueBtn(setGlobalState, false);
  };

  return (
    <Stack
      direction="column"
      width="90%"
      mx="auto"
      // bgcolor="green"
      height="90%"
      justifyContent="space-around"
    >
      {isPreview ? (
        <>
          <Box
            // src={capturedImage}
            // className="circular-image"
            sx={{
              bgcolor: "orange",
              width: "50rem",
              height: "40rem",
              overflow: "hidden",
              mx: "auto",
              borderRadius: "2rem",
              border: "1rem solid orange",
            }}
          >
            <img
              src={capturedImage}
              alt="Captured"
              className="circular-image"
            />
          </Box>
          {/* <Tooltip
            id="face_continue-tooltip"
            content="Tap continue button to say your name"
            place="bottom-end"
            // position="90px 0px 90px 90px"
            style={{
              zIndex: "3",
              fontSize: "2rem",
              borderRadius: "1rem",
            }}
            isOpen={
              globalState.componentStates.getStartedModalStates
                .showContinueToolTip
            }
          /> */}
          <Stack
            direction="row"
            alignItems="center"
            width="98%"
            height="8rem"
            justifyContent="space-between"
            //   bgcolor="green"
            mx="auto"
          >
            <Button
              className={
                globalState.componentStates.getStartedModalStates
                  .faceRecognition.disableContinueBtn
                  ? "animate__animated animate__pulse animate__infinite"
                  : ""
              }
              variant="contained"
              sx={{
                bgcolor: "black",
                height: "100%",
                fontSize: "2rem",
                width: "45%",
                borderRadius: "1rem",
              }}
              onClick={resetCapture}
            >
              {translations[globalState.currentLanguage].retakePhotoBtnText}
            </Button>
            <Button
              className={
                globalState.componentStates.getStartedModalStates
                  .faceRecognition.disableContinueBtn === false
                  ? "animate__animated animate__pulse animate__infinite"
                  : ""
              }
              // data-tooltip-id="face_continue-tooltip"
              variant="contained"
              sx={{
                bgcolor: "orange",
                height: "100%",
                fontSize: "2rem",
                width: "45%",
                borderRadius: "1rem",
                "&:disabled": {
                  bgcolor: "grey.500", // Grayish background when disabled
                  color: "white", // Ensure text remains readable
                  opacity: 0.7, // Slightly faded but still visible
                },
              }}
              disabled={
                globalState.componentStates.getStartedModalStates
                  .faceRecognition.disableContinueBtn
              }
              onClick={
                () => handleContinueBtnPress()
                // handleFaceComponentContinueBtnPressed(setGlobalState)
              }
            >
              {translations[globalState.currentLanguage].continuePhotoBtnText}
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Box
            // src={capturedImage}
            // className="circular-image"
            sx={{
              bgcolor: "orange",
              width: "50rem",
              height: "40rem",
              overflow: "hidden",
              mx: "auto",
              borderRadius: "2rem",
              position: "relative",
              border: "0.5rem solid orange",
            }}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={false}
              className="circular-image"
            />

            {isCapturing && (
              <div className="countdown-overlay">
                <span>{countdown}</span>
              </div>
            )}
          </Box>
          <Button
            variant="contained"
            className={
              globalState.currentStage ===
              DifferentStages.USER_USING_IMAGE_TAKING_WINDOW_1
                ? "animate__animated animate__pulse animate__infinite"
                : ""
            }
            sx={{
              color: "white",
              bgcolor: "orange",
              height: "8rem",
              borderRadius: "1rem",
            }}
            onClick={startCapture}
            startIcon={
              <CameraAltOutlinedIcon
                sx={{ width: "3rem", height: "3rem", mr: "1rem" }}
              />
            }
          >
            <Typography sx={{ fontSize: "2.5rem", fontWeight: "100" }}>
              {translations[globalState.currentLanguage].takePhotoBtnText}
            </Typography>
          </Button>
        </>
      )}
    </Stack>
  );
};

export default IdImageCapture;
