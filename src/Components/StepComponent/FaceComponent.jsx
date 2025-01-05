/**
 * This componenet is used to show  the face component.
 */

import React, { useContext } from "react";
import { AppStateContext } from "../../AppContext";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import FaceImageCapture from "./FaceImageCapture/FaceImageCapture";
import { translations } from "../../Constants";

const FaceComponent = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        width="90%"
        justifyContent="space-between"
        // bgcolor="green"
        mx="auto"
      >
        <Typography
          // id="modal-modal-title"
          variant="h2"
          // component="h2"
          color="white"
        >
          {translations[globalState.currentLanguage].getStartedBtnText}
        </Typography>
        <Typography // id="modal-modal-title"
          variant="h4"
          // component="h2"
          color="orange"
        >
          {translations[globalState.currentLanguage].stepText}{" "}
          {globalState.componentStates.getStartedModalStates.currentStep === 1
            ? translations[globalState.currentLanguage].stepNum1
            : translations[globalState.currentLanguage].stepNum2}{" "}
          / {translations[globalState.currentLanguage].stepNum2}
        </Typography>
      </Stack>
      <FaceImageCapture />
    </>
  );
};

export default FaceComponent;
