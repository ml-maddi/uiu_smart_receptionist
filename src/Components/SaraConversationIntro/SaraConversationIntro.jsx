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
import { AudioPlayingStatus, translations } from "../../Constants";
import { Tooltip } from "react-tooltip";

import questionAskBn from "../../Assets/audios/question_ask_bn.wav";
import questionAskEn from "../../Assets/audios/question_ask_en.wav";

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
      if (
        globalState.userId !== null &&
        globalState.pageStates.getStartedStates.welcomeAudioPlayDone
      ) {
        addAudioToQueue(questionAskAudioData);

        // showing tool tip over mic button to show that they can ask question by tapping mic button
        const showTooltipTimer = setTimeout(() => {
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
          }, 4000); // 3 seconds after show
          // Cleanup for hideTooltipTimer
          return () => clearTimeout(hideTooltipTimer);
        }, 1000); // initial 2 seconds delay
        // Cleanup for showTooltipTimer
        return () => clearTimeout(showTooltipTimer);
      }
    }
  }, [
    globalState.userId,
    globalState.componentStates.getStartedModalStates.openModal,
    globalState.pageStates.getStartedStates.welcomeAudioPlayDone,
  ]);

  useEffect(() => {
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "Question_ask audio" &&
      globalState.audioPlayingData.status === AudioPlayingStatus.NOT_STARTED
    ) {
      playNewAudio();
    }
  }, [globalState.audioPlayingData]);

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
