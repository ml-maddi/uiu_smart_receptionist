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
import { translations } from "../../Constants";
import { Tooltip } from "react-tooltip";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

import welcomeBn from "../../Assets/audios/sara_welcome_bn.mp3";
import welcomeEn from "../../Assets/audios/sara_welcome_en.mp3";

import questionAskBn from "../../Assets/audios/question_ask_bn.wav";
import questionAskEn from "../../Assets/audios/question_ask_en.wav";

const SaraConversationIntro = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const [condition, setCondition] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (globalState.componentStates.getStartedModalStates.openModal === false) {
      if (globalState.userId !== null) {
        setCondition(
          globalState.pageStates.getStartedStates.welcomeAudioPlayDone === false
        );
        // plays audio to tell user that they can ask question by tapping mic button
        if (globalState.currentLanguage === "bn") {
          setCurrentAudio(questionAskBn);
        } else if (globalState.currentLanguage === "en") {
          setCurrentAudio(questionAskEn);
        }

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
    globalState.pageStates.getStartedStates.welcomeAudioPlayDone,
    globalState.componentStates.getStartedModalStates.openModal,
    globalState.audioPlayDone,
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
      {condition && currentAudio && (
        <AudioPlayer audioFile={currentAudio} condition delayTime={100} />
      )}
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
      {/* <Tooltip
        sx={(theme) => ({
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "black!important",
          fontSize: "20rem",
        })}
        // PopperProps={{
        //   disablePortal: true,
        // }}
        // placement="bottom"
        open={globalState.pageStates.getStartedStates.showMicToolTip === false}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        TransitionComponent={Zoom}
        title={translations[globalState.currentLanguage].loginText}
      > */}
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
