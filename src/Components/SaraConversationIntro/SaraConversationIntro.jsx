/**
 * This componenet is used to show user name, login text, mic button for audio recording
 * also shows animation (recording/stale)
 */

import { Box, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import GuestInfo from "./GuestInfo";
import SaraIntro from "./SaraIntro";
import Wave from "./Wave";

// assets

import fancyBg from "../../Assets/body.svg";

import Mic1 from "./Mic1";
// contexts
import { AppStateContext } from "../../AppContext";
import ListeningIntro from "./ListeningIntro";
import {
  AudioPlayingStatus,
  DifferentStages,
  translations,
} from "../../Constants";
import { Tooltip } from "react-tooltip";

import questionAskBn from "../../Assets/audios/question_ask_bn.wav";
import questionAskEn from "../../Assets/audios/question_ask_en.wav";
import { speakNameOut } from "../../Functions";

const SaraConversationIntro = () => {
  const { globalState, setGlobalState, addAudioToQueue, playNewAudio } =
    useContext(AppStateContext);
  const [condition, setCondition] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  const questionAskAudioData = {
    name: "Question_ask audio",
    file: globalState.currentLanguage === "bn" ? questionAskBn : questionAskEn,
    delay: 300,
    status: AudioPlayingStatus.NOT_STARTED,
  };

  useEffect(() => {
    if (globalState.componentStates.getStartedModalStates.openModal === false) {
      if (globalState.userId !== null && globalState.userName !== null) {
        console.log(globalState.userName);
        setGlobalState((prevState) => ({
          ...prevState,
          currentStage: DifferentStages.SIGNED_USER_IN_GET_STARTED_PAGE,
        }));
        speakNameOut(globalState, setGlobalState, addAudioToQueue);
      }
    }
  }, [
    globalState.userId,
    globalState.componentStates.getStartedModalStates.openModal,
    globalState.userName,
  ]);

  useEffect(() => {
    if (globalState.componentStates.getStartedModalStates.openModal === false) {
      if (
        globalState.userId !== null &&
        globalState.pageStates.getStartedStates.greetNameAudioPlayDone === true
      ) {
        const showTooltipTimer = setTimeout(() => {
          addAudioToQueue(questionAskAudioData);
          setGlobalState((prevState) => ({
            ...prevState,
            pageStates: {
              ...prevState.pageStates,
              getStartedStates: {
                ...prevState.pageStates.getStartedStates,
                showMicToolTip: true,
              },
            },
          }));
          // Set the tooltip to false after 3 more seconds (total 5 seconds)
          const hideTooltipTimer = setTimeout(() => {
            setGlobalState((prevState) => ({
              ...prevState,
              pageStates: {
                ...prevState.pageStates,
                getStartedStates: {
                  ...prevState.pageStates.getStartedStates,
                  showMicToolTip: false,
                },
              },
            }));
          }, 5000); // 3 seconds after show
          // Cleanup for hideTooltipTimer
          return () => clearTimeout(hideTooltipTimer);
        }, 4000); // initial 2 seconds delay
        // Cleanup for showTooltipTimer
        return () => clearTimeout(showTooltipTimer);
      }
    }
  }, [
    globalState.userId,
    globalState.componentStates.getStartedModalStates.openModal,
    globalState.pageStates.getStartedStates.greetNameAudioPlayDone,
  ]);

  useEffect(() => {
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "Name audio" &&
      globalState.audioPlayingData.status === AudioPlayingStatus.NOT_STARTED
    ) {
      playNewAudio();
    }
  }, [globalState.audioPlayingData.name]);

  useEffect(() => {
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "Question_ask audio" &&
      globalState.pageStates.getStartedStates.greetNameAudioPlayDone === true &&
      globalState.audioPlayingData.status === AudioPlayingStatus.NOT_STARTED
    ) {
      playNewAudio();
    }
  }, [
    globalState.audioPlayingData.name,
    globalState.pageStates.getStartedStates.greetNameAudioPlayDone,
  ]);

  return (
    <Box
      sx={{
        // bgcolor: "green",
        width: "85%",
        height: "35%",

        mx: "auto",
        mt: "1rem",
        px: 4,
        py: 3,
        borderRadius: "2rem",
        position: "relative",
        overflow: "hidden",
        transition: "height 0.3s ease", // Add smooth animation here
      }}
    >
      <Tooltip
        id="my-tooltip"
        content="Tap the mic button to ask question"
        place="bottom-end"
        // position="90px 0px 90px 90px"
        style={{
          zIndex: "3",
          fontSize: "2rem",
          borderRadius: "1rem",
        }}
        isOpen={globalState.pageStates.getStartedStates.showMicToolTip}
      />

      <Box
        // data-tooltip-content="Click me!"
        sx={{
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
        }}
      >
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
          }}
          src={fancyBg}
        />

        <Mic1 />
      </Box>
      {/* </Tooltip> */}
      <Box position="absolute">
        <GuestInfo />
      </Box>

      {globalState.pageStates.getStartedStates.micBtnPressed === true ? (
        <Box
          // bgcolor="red"
          mt="2rem"
          position="absolute"
          sx={{
            width: 1,
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -60%)",
          }}
        >
          <Wave />
          <ListeningIntro />
        </Box>
      ) : (
        <Box
          // bgcolor="red"
          mt="8rem"
          position="absolute"
          sx={{
            width: 1,
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -60%)",
          }}
        >
          <SaraIntro />
          <Wave />
        </Box>
      )}
    </Box>
  );
};

export default SaraConversationIntro;
