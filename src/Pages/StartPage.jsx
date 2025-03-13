/**
 * This componenet is used to enable image capturing from the beginning, as user interaction is needed to use auto audio,video capture starting.
 */
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { AppStateContext } from "../AppContext";
import { DifferentPages } from "../Constants";

const StartPage = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const navigate = useNavigate();
  const handleGoToGetStartedPage = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentPage: DifferentPages.GET_STARTED,
      pageStates: {
        ...prevState.pageStates,
        startStates: {
          ...prevState.pageStates.startStates,
          btnPressed: true,
        },
      },
    }));
    // Set a timeout to apply the effect after 2 seconds
    setTimeout(() => {
      navigate("/getStart");
      setGlobalState((prevState) => ({
        ...prevState,

        pageStates: {
          ...prevState.pageStates,
          startStates: {
            ...prevState.pageStates.startStates,
            btnPressed: false,
          },
        },
      }));
    }, 2000); // 2000ms = 2 seconds
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button
        variant="contained"
        // size="large"
        sx={{
          width: "20rem",
          height: "5rem",
          fontSize: "3rem",
        }}
        onClick={handleGoToGetStartedPage}
      >
        Start
      </Button>
    </Box>
  );
};

export default StartPage;
