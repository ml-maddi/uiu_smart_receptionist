import React, { useContext, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { AppStateContext } from "../../AppContext";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import {
  getCurrentDetailRatingSpecificPage,
  getCurrentRatingSpecificPage,
  handleFeedbackSubmitting,
  toggleFeedbackPage,
  updateCurrentFeedbackPageNumber,
  updateRatingSpecificPage,
} from "../../Functions";
import CloseIcon from "@mui/icons-material/Close";
import Ratings from "./Ratings";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import { translations } from "../../Constants";
import RecordingComponents from "./RecordingComponents";

const FeedbackPage = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const [textFieldValue, setTextFieldValue] = useState(
    getCurrentDetailRatingSpecificPage(globalState) // Initial value
  );

  // Function to programmatically update the value
  const updateTextFieldValue = (newValue) => {
    setTextFieldValue(newValue);
  };
  useEffect(() => {
    updateTextFieldValue(getCurrentDetailRatingSpecificPage(globalState));
    // setGlobalState({ ...globalState, currentPage: "conversation" });
  }, [globalState.componentStates.feedbackStates]);

  useEffect(() => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentRatingValue: getCurrentRatingSpecificPage(prevState),
    }));
    // setGlobalState({ ...globalState, currentPage: "conversation" });
  }, [
    globalState.componentStates.feedbackStates.showFeedbackModal,
    globalState.componentStates.feedbackStates.currentFeedbackItem,
  ]);

  const theme = useTheme();

  return (
    <Modal
      open={globalState.componentStates.feedbackStates.showFeedbackModal}
      onClose={() => toggleFeedbackPage(setGlobalState)}
      sx={{
        width: "80%",
        height: "100%",
        mx: "auto",
        p: "3rem",
        // bgcolor: "gray",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
      }}
    >
      <Paper
        sx={{
          //   bgcolor: "green",
          px: "3rem",
          py: "2rem",
          display: "flex",
          flexDirection: "column",
          borderRadius: "2rem",
          position: "relative",
          //   alignItems: "center",
          //   justifyContent: "center",
          //   justifyItems: "center",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => toggleFeedbackPage(setGlobalState)}
          sx={(theme) => ({
            position: "absolute",
            right: 20,
            top: 15,
            color: theme.palette.grey[500],
            fontSize: "3rem",
          })}
        >
          <CloseIcon fontSize="3rem" />
        </IconButton>
        <Typography mt="3rem" variant="h6" color="orange">
          {translations[globalState.currentLanguage].feedbackText1}
        </Typography>
        <Typography fontWeight="bold" mt="1rem" variant="h4">
          {translations[globalState.currentLanguage].feedbackText2}
        </Typography>
        <Typography
          lineHeight="2rem"
          fontWeight="300"
          mt="1rem"
          mb="3rem"
          variant="h5"
        >
          {translations[globalState.currentLanguage].feedbackText3}
        </Typography>
        <Typography
          sx={{ height: "2rem", lineHeight: "2rem" }}
          fontWeight="bold"
          variant="h5"
          // mb="1rem"
        >
          {translations[globalState.currentLanguage].feedbackQuestions[0]}
        </Typography>
        <Ratings index={0} />
        <Typography
          sx={{ height: "4rem", lineHeight: "2rem" }}
          fontWeight="bold"
          variant="h5"
          // mb="1rem"
        >
          {translations[globalState.currentLanguage].feedbackQuestions[1]}
        </Typography>
        <Ratings index={1} />
        <Typography
          sx={{ height: "2rem", lineHeight: "2rem" }}
          fontWeight="bold"
          variant="h5"
          // mb="1rem"
        >
          {translations[globalState.currentLanguage].feedbackQuestions[2]}
        </Typography>
        <Ratings index={2} />
        <Typography
          sx={{ height: "4rem", lineHeight: "2rem" }}
          fontWeight="bold"
          variant="h5"
          // mb="1rem"
        >
          {translations[globalState.currentLanguage].feedbackQuestions[3]}
        </Typography>
        <Ratings index={3} />
        <Typography
          sx={{ height: "2rem", lineHeight: "2rem" }}
          fontWeight="bold"
          variant="h5"
          // mb="1rem"
        >
          {translations[globalState.currentLanguage].feedbackQuestions[4]}
        </Typography>
        <Ratings index={4} />
        <Typography
          sx={{ height: "2rem", lineHeight: "2rem" }}
          fontWeight="bold"
          variant="h5"
          // mb="1rem"
        >
          {translations[globalState.currentLanguage].feedbackQuestions[5]}
        </Typography>
        <Ratings index={5} />
        <Typography
          sx={{ height: "4rem", lineHeight: "2rem" }}
          fontWeight="bold"
          variant="h5"
          // mb="1rem"
        >
          {translations[globalState.currentLanguage].feedbackQuestions[6]}
        </Typography>
        <Ratings index={6} />

        <Button
          sx={{
            my: "2rem",
            fontSize: "2rem",
            width: "60%",
            mx: "auto",
            borderRadius: "2rem",
          }}
          variant="contained"
          color="warning"
          onClick={() => handleFeedbackSubmitting(globalState, setGlobalState)}
        >
          {translations[globalState.currentLanguage].surveySubmitBtnText}
        </Button>
        {/* <Typography mt="3rem" mb="1rem" fontWeight="bold" variant="h5">
          {translations[globalState.currentLanguage].feedbackText4}
        </Typography>
        <RecordingComponents /> */}
        {/* <Box
          // bgcolor="green"
          sx={{
            height: "30rem",
            width: "100%",
            borderRadius: "2rem",
            border: "1px solid gray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {globalState.notificationStates.processingAudio === true ? (
            <CircularProgress size={70} color="warning" />
          ) : (
            <TextField
              //   id="filled-textarea"
              // label="Multiline Placeholder"
              value={textFieldValue} // Controlled value
              onChange={(e) => setTextFieldValue(e.target.value)} // Allows manual editing
              variant="outlined"
              placeholder="feedback"
              multiline
              rows={12}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none", // Hides the border
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "1.5rem", // Increase font size
                },
                mt: "-4rem",
                // ml: "1rem",
                width: "90%",
                // height: "22rem",
                // bgcolor: "red",
              }}
              //   variant="filled"
            />
          )}
        </Box> */}

        {/* <MobileStepper
          variant="progress"
          sx={{
            mt: "3rem",
            fontSize: "1.5rem",
            "& .MuiLinearProgress-root": {
              backgroundColor: "lightgray", // Background of the progress bar
              "& .MuiLinearProgress-bar": {
                backgroundColor: "orange", // Progress bar (top line) color
              },
            },
          }}
          steps={
            globalState.componentStates.feedbackStates.allFeedbackStates.length
          }
          position="static"
          activeStep={
            globalState.componentStates.feedbackStates.currentFeedbackItem
          }
          nextButton={
            globalState.componentStates.feedbackStates.currentFeedbackItem !==
            globalState.componentStates.feedbackStates.allFeedbackStates
              .length -
              1 ? (
              <Button
                sx={{ fontSize: "1.5rem", color: "black" }}
                size="large"
                onClick={handleNext}
                disabled={
                  globalState.componentStates.feedbackStates
                    .currentFeedbackItem ===
                  globalState.componentStates.feedbackStates.allFeedbackStates
                    .length -
                    1
                }
              >
                {translations[globalState.currentLanguage].feedbackNextBtnText}
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleFeedbackSubmitting(globalState, setGlobalState)
                }
              >
                {translations[globalState.currentLanguage].surveySubmitBtnText}
              </Button>
            )
          }
          backButton={
            <Button
              sx={{ fontSize: "1.5rem", color: "black" }}
              size="large"
              onClick={handleBack}
              disabled={
                globalState.componentStates.feedbackStates
                  .currentFeedbackItem === 0
              }
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              {translations[globalState.currentLanguage].feedbackBackBtnText}
            </Button>
          }
        /> */}
      </Paper>
    </Modal>
  );
};

export default FeedbackPage;
