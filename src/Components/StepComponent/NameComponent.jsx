/**
 * This componenet is used to show  the name input components.
 */
import {
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../AppContext";
import { translations } from "../../Constants";
import LanguageSelector from "../../Pages/GetStartedPage/LanguageSelector/LanguageSelector";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import { handleNameSpeaking, handleStartBtnClick } from "../../Functions";
const NameComponent = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const [inputValue, setInputValue] = useState(
    globalState.currentLanguage === "bn"
      ? globalState.userName
      : globalState.userNameEn
  );
  // manual input handling for the text field
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  // update spoken name into text field
  useEffect(() => {
    if (globalState.currentNameData !== null) {
      handleNameSpeaking(
        globalState,
        setGlobalState,
        globalState.currentNameData
      );
    }
  }, [globalState.currentNameData]);

  // based on selected language, name is set
  useEffect(() => {
    if (globalState.userName !== "") {
      setInputValue(
        globalState.currentLanguage === "bn"
          ? globalState.userName
          : globalState.userNameEn
      );
    }
  }, [globalState.currentLanguage, globalState.userName]);

  return (
    <Stack
      // bgcolor="orange"
      direction="column"
      // spacing={10}
      mx="auto"
      width="90%"
      height="100%"
      justifyContent="space-around"
    >
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        // bgcolor="green"
        // mx="auto"
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
      <Stack direction="column" height="40%">
        <Typography
          sx={{
            color: "white",
            fontSize: "2rem",
            mb: "2rem",
            mt: "-4rem",
          }}
        >
          {translations[globalState.currentLanguage].nameInputTopText}
        </Typography>
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          placeholder={
            translations[globalState.currentLanguage].nameInputPlaceHolder
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {/* <IconButton
                    // onClick={handleClickShowPassword}
                    edge="start"
                  >
                    <MicNoneIcon sx={{ fontSize: "3rem" }} />
                  </IconButton> */}
                  <AudioRecorder />
                </InputAdornment>
              ),
            },
          }}
          // variant="outlined"
          sx={{
            mb: "5rem",
            // Root class for the input field
            "& .MuiOutlinedInput-root": {
              color: "gray",
              fontSize: "2rem",
              bgcolor: "white",
              borderRadius: "1rem",
              // fontWeight: "bold",
              // Class for the border around the input field
              "& .MuiOutlinedInput-notchedOutline": {
                border: "2px solid #f7931e",
              },
            },
            // Class for the label of the input field
            "& .MuiInputLabel-outlined": {
              color: "gray",
              fontSize: "1.5rem",
              // fontWeight: "bold",
            },
          }}
        />
        <Typography
          sx={{
            color: "white",
            fontSize: "2rem",
            mb: "2rem",
          }}
        >
          {translations[globalState.currentLanguage].languageSelectLabel}
        </Typography>
        <LanguageSelector boxWidth="40%" marginTop="0" marginLeft="0" />
        <Typography
          sx={{
            color: "white",
            fontSize: "2rem",
            mt: "5rem",
          }}
        >
          {translations[globalState.currentLanguage].step2WarningText}
        </Typography>
      </Stack>

      {/* <AudioRecorder /> */}
      <Button
        variant="contained"
        sx={{
          bgcolor: "black",
          height: "5rem",
          fontSize: "2rem",
          // width: "35%",
          borderRadius: "1rem",
          border: "1px solid #f7931e",
        }}
        onClick={() => handleStartBtnClick(setGlobalState)}
      >
        {translations[globalState.currentLanguage].step2ButtonLabel}
      </Button>
    </Stack>
  );
};

export default NameComponent;
