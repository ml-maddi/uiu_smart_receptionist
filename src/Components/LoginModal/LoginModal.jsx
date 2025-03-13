/**
 * This componenet is used to show either the face or name input components.
 */
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { AppStateContext } from "../../AppContext";
import {
  DifferentPages,
  DifferentStages,
  recognitionMethods,
  translations,
} from "../../Constants";
import PortraitIcon from "@mui/icons-material/Portrait";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import InterpreterModeOutlinedIcon from "@mui/icons-material/InterpreterModeOutlined";

// assets

import { LoginOption } from "./LoginOption";
import FaceImageCapture from "./FaceImageCapture/FaceImageCapture";
import IdImageCapture from "./IdImageCapture/IdImageCapture";

const loginOptionsNavIcons = [
  <PortraitIcon sx={{ fontSize: "3rem" }} />,
  <InterpreterModeOutlinedIcon sx={{ fontSize: "3rem" }} />,
  <DocumentScannerOutlinedIcon sx={{ fontSize: "3rem" }} />,
];

const LoginModal = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);

  const loginOptionsNavLabels = [
    <Typography sx={{ fontSize: "1rem", color: "black" }}>
      {translations[globalState.currentLanguage].loginOptionsNavText[0]}
    </Typography>,
    <Typography sx={{ fontSize: "1rem", color: "black" }}>
      {translations[globalState.currentLanguage].loginOptionsNavText[1]}
    </Typography>,
    <Typography sx={{ fontSize: "1rem", color: "black" }}>
      {translations[globalState.currentLanguage].loginOptionsNavText[2]}
    </Typography>,
  ];
  const handleClose = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentStage:
        prevState.currentPage === DifferentPages.GET_STARTED
          ? DifferentStages.USER_IN_GET_STARTED_PAGE
          : "",
      componentStates: {
        ...prevState.componentStates,
        getStartedModalStates: {
          ...prevState.componentStates.getStartedModalStates,
          openModal: false,
        },
      },
    }));
  };

  const changeSelection = (event, newValue) => {
    setGlobalState((prevState) => ({
      ...prevState,

      componentStates: {
        ...prevState.componentStates,
        getStartedModalStates: {
          ...prevState.componentStates.getStartedModalStates,
          selectedLoginOption: newValue,
          loginOptionBtnPressed: "",
        },
      },
    }));
  };

  return (
    <Modal
      open={globalState.componentStates.getStartedModalStates.openModal}
      onClose={handleClose}
    >
      <Box
        sx={{
          mx: "auto",
          mt: "8rem",
          width: "84%",
          height: "65%",
          borderRadius: "2rem",

          bgcolor: "rgba(0,0,0, 0.8)",
          border: "2px solid #f7931e",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {globalState.componentStates.getStartedModalStates
          .loginOptionBtnPressed !== "" ? (
          globalState.componentStates.getStartedModalStates
            .loginOptionBtnPressed === recognitionMethods.FACE ? (
            <FaceImageCapture />
          ) : globalState.componentStates.getStartedModalStates
              .selectedLoginOption === recognitionMethods.SPEAKER ? (
            <FaceImageCapture />
          ) : (
            <IdImageCapture />
          )
        ) : (
          <LoginOption
            selectedOption={
              globalState.componentStates.getStartedModalStates
                .selectedLoginOption
            }
          />
        )}

        {/* <img
          style={{
            width: "80%",
            height: "80%",
            borderRadius: "4rem",
          }}
          src={}
        /> */}
        <BottomNavigation
          sx={{
            width: "98%",
            height: "8rem",
            marginTop: "4rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            borderRadius: "2rem",
            // bgcolor: "orange",

            // alignItems: "flex-start",
          }}
          showLabels
          value={
            globalState.componentStates.getStartedModalStates
              .selectedLoginOption
          }
          onChange={changeSelection}
        >
          {/* <LoginNavAction optionNum={0} />
          <LoginNavAction optionNum={1} />
          <LoginNavAction optionNum={2} /> */}
          <BottomNavigationAction
            label={loginOptionsNavLabels[0]}
            icon={loginOptionsNavIcons[0]}
          />
          <BottomNavigationAction
            label={loginOptionsNavLabels[1]}
            icon={loginOptionsNavIcons[1]}
          />
          <BottomNavigationAction
            label={loginOptionsNavLabels[2]}
            icon={loginOptionsNavIcons[2]}
          />
        </BottomNavigation>
      </Box>
    </Modal>
  );
};

export default LoginModal;
