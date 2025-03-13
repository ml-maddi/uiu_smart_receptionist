// portion shown at the bottom of the get started page when there is no user infront of the system

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
// constants
import {
  DifferentPages,
  DifferentStages,
  translations,
} from "../../../Constants";
import { AppStateContext } from "../../../AppContext";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import { v4 as uuidv4 } from "uuid";

const BottomInfo = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);

  const handleGetStartedBtnClick = () => {
    const sessionId = uuidv4();
    setGlobalState((prevState) => ({
      ...prevState,
      currentStage: DifferentStages.USER_USING_IMAGE_TAKING_WINDOW_1,
      componentStates: {
        ...prevState.componentStates,
        getStartedModalStates: {
          ...prevState.componentStates.getStartedModalStates,
          openModal: true,
        },
      },
      surveyData: {
        ...prevState.surveyData,
        fullTime: {
          sessionId: sessionId,
          userId: "",
          startUsingTimeStamp: new Date().toISOString(),
          endUsingTimeStamp: "",
        },
      },
    }));
  };
  const handleGetStartedBtnPressed = () => {
    // Set a timeout to apply the effect after 2 seconds
    setTimeout(() => {
      console.log("Get Started Button Pressed");
      handleGetStartedBtnClick();
    }, 1000); // 2000ms = 2 seconds
  };

  // useEffect(() => {
  //   if (globalState.currentPage === DifferentPages.GET_STARTED) {
  //     setGlobalState((prevState) => ({
  //       ...prevState,
  //       currentStage: DifferentStages.USER_IN_GET_STARTED_PAGE,
  //     }));
  //   }
  // }, [globalState.currentPage]);

  // useEffect(() => {
  //   // setGlobalState((prevState) => ({
  //   //   ...prevState,
  //   //   currentStage: DifferentStages.USER_IN_GET_STARTED_PAGE,
  //   // }));
  //   return () => {
  //     setGlobalState((prevState) => ({
  //       ...prevState,
  //       currentStage: DifferentStages,
  //     }));
  //   };
  // }, []);

  return (
    <Box
      bgcolor="white"
      width="85%"
      height="25%"
      sx={{
        mx: "auto",
        mt:
          globalState.currentPage === DifferentPages.GET_STARTED
            ? "3rem"
            : "1.5rem",
        px: 4,
        py: 3,
        borderRadius: "2rem",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={8}>
        <Stack
          // bgcolor="orange"
          direction="column"
          // spacing="2"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            letterSpacing={4}
            // fontSize={30}
            // textAlign="center"
          >
            {translations[globalState.currentLanguage].welcome1}
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            letterSpacing={4}
            marginTop={2}
          >
            {translations[globalState.currentLanguage].welcome2}
          </Typography>
        </Stack>
        <Button
          className={
            globalState.currentStage ===
            DifferentStages.USER_IN_GET_STARTED_PAGE
              ? "animate__animated animate__pulse animate__infinite"
              : ""
          }
          variant="contained"
          sx={{
            fontSize: "2rem",
            borderRadius: "1rem",
            bgcolor: "#f7931e",
          }}
          onClick={handleGetStartedBtnPressed}
        >
          <Typography sx={{ fontSize: "2rem" }}>
            {translations[globalState.currentLanguage].getStartedBtnText}
          </Typography>
          <ArrowRightAltIcon
            sx={{
              fontSize: "3rem",
            }}
          />
        </Button>
      </Stack>
    </Box>
  );
};

export default BottomInfo;
