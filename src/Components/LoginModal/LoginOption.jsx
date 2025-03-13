import { Box, Button } from "@mui/material";
import React, { useContext } from "react";
import faceImg from "../../Assets/face.jpg";
import speakerImg from "../../Assets/speaker.jpg";
import idImg from "../../Assets/id.jpg";
import { recognitionMethods, translations } from "../../Constants";
import { AppStateContext } from "../../AppContext";

export const LoginOption = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const images = [faceImg, speakerImg, idImg];

  const handleBtnClick = () => {
    setGlobalState((prevState) => ({
      ...prevState,

      componentStates: {
        ...prevState.componentStates,
        getStartedModalStates: {
          ...prevState.componentStates.getStartedModalStates,
          loginOptionBtnPressed:
            prevState.componentStates.getStartedModalStates
              .selectedLoginOption === 0
              ? recognitionMethods.FACE
              : prevState.componentStates.getStartedModalStates
                  .selectedLoginOption === 1
              ? recognitionMethods.SPEAKER
              : recognitionMethods.ID,
        },
      },
      surveyData: {
        ...prevState.surveyData,
        recognition: {
          ...prevState.surveyData.recognition,
          sessionId: prevState.surveyData.fullTime.sessionId,
          recognitionStartTimeStamp: Date.now(),
          totalAttempts: prevState.surveyData.recognition.totalAttempts + 1,
          method:
            prevState.componentStates.getStartedModalStates
              .selectedLoginOption === 0
              ? recognitionMethods.FACE
              : prevState.componentStates.getStartedModalStates
                  .selectedLoginOption === 1
              ? recognitionMethods.SPEAKER
              : recognitionMethods.ID,
        },
      },
    }));
  };

  return (
    <Box
      sx={{
        width: "98%",
        height: "80%",
        // borderRadius: "0.2rem",
        position: "relative",
      }}
    >
      <img
        style={{
          width: "100%",
          height: "90%",
          borderRadius: "2rem",
          objectFit: "cover",
          // objectPosition: "50% 50%",
        }}
        src={
          images[
            globalState.componentStates.getStartedModalStates
              .selectedLoginOption
          ]
        }
      />
      <Button
        className={"animate__animated animate__pulse animate__infinite"}
        variant="contained"
        sx={{
          position: "absolute",
          left: "50%",
          translate: "-50%",
          bottom: "0rem",
          bgcolor: "orange",
          borderRadius: "0.8rem",
          //   padding: "1rem 1.2rem ",
          fontSize: "1.5rem",
          color: "black",
        }}
        onClick={handleBtnClick}
      >
        {
          translations[globalState.currentLanguage].loginOptionsBtnText[
            globalState.componentStates.getStartedModalStates
              .selectedLoginOption
          ]
        }
      </Button>
    </Box>
  );
};
