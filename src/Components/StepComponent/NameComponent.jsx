/**
 * This component is used to show the name input components.
 */
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";
import { AppStateContext } from "../../AppContext";
import {
  NameRecordingStatus,
  translations,
  NameProcessingStatus,
} from "../../Constants";
import LanguageSelector from "../../Pages/GetStartedPage/LanguageSelector/LanguageSelector";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import {
  getPlaceholderText,
  handleNameSpeaking,
  handleStartBtnClick,
} from "../../Functions";
import EditIcon from "@mui/icons-material/Edit";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./styles.css";

// Import keyboard layouts
import englishLayout from "simple-keyboard-layouts/build/layouts/english";
import bengaliLayout from "simple-keyboard-layouts/build/layouts/bengali";

const NameComponent = () => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const [layout, setLayout] = useState("default");
  const [keyboardLayout, setKeyboardLayout] = useState(englishLayout);
  const keyboard = useRef();

  // // Manual input handling for the text field
  const handleInputChange = (event) => {
    updateUserName(event.target.value);
    // setInputValue();
  };
  const onChangeAll = (input) => {
    /**
     * Here we spread the inputs into a new object
     * If we modify the same object, react will not trigger a re-render
     */
    setGlobalState((prevState) => ({
      ...prevState,
      userName: input.default,
    }));
    console.log("Inputs changed", input);
  };

  const updateUserName = (input) => {
    setGlobalState((prevState) => ({
      ...prevState,
      userName: input,
    }));
    keyboard.current.setInput(input);
  };

  useEffect(() => {
    // Reset state value when the component is mounted
    if (
      globalState.componentStates.getStartedModalStates.nameAudioProcessing ===
      NameRecordingStatus.DONE
    ) {
      setGlobalState((prevState) => ({
        ...prevState,
        componentStates: {
          ...prevState.componentStates,
          getStartedModalStates: {
            ...prevState.componentStates.getStartedModalStates,
            nameRecordingStatus: NameRecordingStatus.NOT_STARTED,
            nameProcessingStatus: NameProcessingStatus.NOT_STARTED,
          },
        },
      }));
    }
  }, []); // Empty dependency array ensures this runs only on mount

  // Update spoken name into text field
  useEffect(() => {
    if (
      globalState.componentStates.getStartedModalStates.nameRecordingStatus ===
        NameRecordingStatus.DONE &&
      globalState.currentNameData !== null
    ) {
      handleNameSpeaking(
        globalState,
        setGlobalState,
        globalState.currentNameData
      );
    }
  }, [
    globalState.componentStates.getStartedModalStates.nameRecordingStatus,
    globalState.currentNameData,
  ]);

  useEffect(() => {
    if (showKeyboard === true) {
      console.log("I got called");
      keyboard.current.setInput(globalState.userName);
    }
  }, [showKeyboard]);

  // Based on selected language, name is set
  useEffect(() => {
    // Update keyboard layout when the language changes
    setKeyboardLayout(
      globalState.currentLanguage === "bn" ? bengaliLayout : englishLayout
    );
  }, [globalState.currentLanguage]);

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    const currentLayout = layout;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";
    setLayout(shiftToggle);
  };

  return (
    <Stack
      direction="column"
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
      >
        <Typography variant="h2" color="white">
          {translations[globalState.currentLanguage].getStartedBtnText}
        </Typography>
        <Typography variant="h4" color="orange">
          {translations[globalState.currentLanguage].stepText}{" "}
          {globalState.componentStates.getStartedModalStates.currentStep === 1
            ? translations[globalState.currentLanguage].stepNum1
            : translations[globalState.currentLanguage].stepNum2}{" "}
          / {translations[globalState.currentLanguage].stepNum2}
        </Typography>
      </Stack>
      <Stack direction="column" height={!showKeyboard ? "40%" : "62%"}>
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
          value={globalState.userName}
          onChange={handleInputChange}
          onFocus={() => {
            updateUserName(globalState.userName);
          }}
          placeholder={getPlaceholderText(globalState)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="success"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                >
                  <EditIcon sx={{ fontSize: "2.5rem" }} />
                </IconButton>
                <AudioRecorder />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: "5rem",
            "& .MuiOutlinedInput-root": {
              color: "gray",
              fontSize: "2rem",
              bgcolor: "white",
              borderRadius: "1rem",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "2px solid #f7931e",
              },
            },
          }}
        />
        {showKeyboard ? (
          <>
            <Keyboard
              keyboardRef={(r) => (keyboard.current = r)}
              layoutName={layout}
              // onChangeAll={onChangeAll}
              onChange={updateUserName}
              onKeyPress={onKeyPress}
              {...keyboardLayout}
            />
            <Typography
              sx={{
                color: "white",
                fontSize: "2rem",
                my: "2rem",
              }}
            >
              {translations[globalState.currentLanguage].languageSelectLabel}
            </Typography>
            <LanguageSelector boxWidth="40%" marginTop="0" marginLeft="0" />
          </>
        ) : (
          <>
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
          </>
        )}
      </Stack>
      <Button
        variant="contained"
        sx={{
          bgcolor: "black",
          height: "5rem",
          fontSize: "2rem",
          borderRadius: "1rem",
          border: "1px solid #f7931e",
        }}
        onClick={() => {
          handleStartBtnClick(globalState, setGlobalState);
        }}
      >
        {translations[globalState.currentLanguage].step2ButtonLabel}
      </Button>
      {/* {!showKeyboard ? (
       
      ) : null} */}
    </Stack>
  );
};

export default NameComponent;
