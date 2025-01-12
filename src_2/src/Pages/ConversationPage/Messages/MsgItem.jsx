import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { AudioPlayingStatus, QuestionEditingStatus } from "../../../Constants";
import SendIcon from "@mui/icons-material/Send";

import EditIcon from "@mui/icons-material/Edit";

import React, { useContext, useEffect, useState, useRef } from "react";
import { AppStateContext } from "../../../AppContext";
import { QuestionAnswering } from "../../../Functions";
import KeyboardOverlay from "../KeyboardOverlay";

const MsgItem = ({ user_type, editingStatus, children }) => {
  // const [showKeyboard, setShowKeyboard] = useState(false);
  const { globalState, setGlobalState, addAudioToQueue, playNewAudio } =
    useContext(AppStateContext);
  const [Question, setQuestion] = useState(children);
  const keyboard = useRef();

  // useEffect(() => {
  //   setGlobalState((prevState) => ({
  //     ...prevState,
  //     pageStates: {
  //       ...prevState.pageStates,
  //       ConversationStates: {
  //         ...prevState.pageStates.ConversationStates,
  //         keyboardRef: keyboard,
  //       },
  //     },
  //   }));
  // }, [keyboard]);

  const sendQuestion = async () => {
    setGlobalState((prevState) => ({
      ...prevState,
      messages: prevState.messages.map((message) => ({
        ...message,
        status: QuestionEditingStatus.DONE,
      })),
    }));
    await QuestionAnswering(
      globalState,
      setGlobalState,
      addAudioToQueue,
      Question
    );
  };
  useEffect(() => {
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "Answer audio" &&
      globalState.audioPlayingData.status === AudioPlayingStatus.NOT_STARTED
    ) {
      playNewAudio();
    }
  }, [globalState.audioPlayingData]);

  const handleEditClick = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      pageStates: {
        ...prevState.pageStates,
        ConversationStates: {
          ...prevState.pageStates.ConversationStates,
          showKeyboard: !prevState.pageStates.ConversationStates.showKeyboard,
          keyboardRef: keyboard,
        },
      },
    }));
  };

  // // Manual input handling for the text field
  const handleInputChange = (event) => {
    updateQuestion(event.target.value);
    // setInputValue();
  };
  const onChangeAll = (input) => {
    /**
     * Here we spread the inputs into a new object
     * If we modify the same object, react will not trigger a re-render
     */
    setQuestion(input.default);
    // setGlobalState((prevState) => ({
    //   ...prevState,
    //   userName: input.default,
    // }));
    console.log("Inputs changed", input);
  };
  const updateQuestion = (input) => {
    setQuestion(input);
    if (
      globalState.pageStates.ConversationStates.keyboardRef &&
      globalState.pageStates.ConversationStates.keyboardRef.current !== null
    ) {
      globalState.pageStates.ConversationStates.keyboardRef.current.setInput(
        input
      );
    }
  };
  // useEffect(() => {
  //   if (showKeyboard === true) {
  //     console.log("I got called");
  //     // keyboard.current.setInput(children);
  //   }
  // }, [showKeyboard]);

  // Based on selected language, name is set

  return (
    <>
      {user_type === "user" ? (
        <>
          {editingStatus === QuestionEditingStatus.DONE ? (
            <Box
              // justifyContent="flex-start"
              alignSelf={user_type === "user" ? "flex-start" : "flex-end"}
              // alignSelf="center"
              sx={{
                // top: "2rem",
                // left: "2rem",
                p: "2rem",
                my: "1rem",
                // height: "30rem",
                // width: "70%",
                // position: "absolute",
                bgcolor: user_type === "user" ? "orange" : "#eee",
                borderRadius:
                  user_type === "user"
                    ? "4px 16px 16px 16px"
                    : "16px 4px 16px 16px",
                // boxSizing: "border-box",
                // wordWrap: "break-word",
                maxWidth: "50%",
                textAlign: "justify",
              }}
            >
              <Typography variant="h5">{Question}</Typography>
            </Box>
          ) : (
            <Stack direction="column" mb="2rem">
              <TextField
                value={Question}
                onChange={handleInputChange}
                onFocus={() => {
                  updateQuestion(Question);
                }}
                placeholder={Question}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="success" onClick={handleEditClick}>
                        <EditIcon sx={{ fontSize: "2.5rem" }} />
                      </IconButton>
                      <IconButton color="success" onClick={sendQuestion}>
                        <SendIcon sx={{ fontSize: "2.5rem" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "50%",
                  // mb: "5rem",
                  "& .MuiOutlinedInput-root": {
                    color: "gray",
                    fontSize: "2rem",
                    color: "black",
                    bgcolor: "orange",
                    borderRadius: "1rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid #f7931e",
                    },
                  },
                }}
              />
              <KeyboardOverlay updateQuestion />
              {/* {showKeyboard ? (
            <>
              
              <Typography
                sx={{
                  color: "white",
                  fontSize: "2rem",
                  my: "2rem",
                }}
              >
                {translations[globalState.currentLanguage].languageSelectLabel}
              </Typography>
             
            </>
          )} */}
            </Stack>
          )}
        </>
      ) : (
        <Box
          // justifyContent="flex-start"
          alignSelf={user_type === "user" ? "flex-start" : "flex-end"}
          // alignSelf="center"
          sx={{
            // top: "2rem",
            // left: "2rem",
            p: "2rem",
            my: "1rem",
            // height: "30rem",
            // width: "70%",
            // position: "absolute",
            bgcolor: user_type === "user" ? "orange" : "#eee",
            borderRadius:
              user_type === "user"
                ? "4px 16px 16px 16px"
                : "16px 4px 16px 16px",
            // boxSizing: "border-box",
            // wordWrap: "break-word",
            maxWidth: "50%",
            textAlign: "justify",
          }}
        >
          <Typography variant="h5">{children}</Typography>
        </Box>
      )}
    </>
  );
};
export default MsgItem;
