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

  return (
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
          user_type === "user" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        // boxSizing: "border-box",
        // wordWrap: "break-word",
        maxWidth: "50%",
        textAlign: "justify",
      }}
    >
      <Typography variant="h5">{children}</Typography>
    </Box>
  );
};
export default MsgItem;
