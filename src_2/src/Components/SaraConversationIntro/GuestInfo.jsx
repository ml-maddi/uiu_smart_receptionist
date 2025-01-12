/**
 * This componenet is used to show user name and login text in selected language .
 */

import { Box, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React, { useContext, useState, useEffect, useRef } from "react";
import MicNoneIcon from "@mui/icons-material/MicNone";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// assets
import userImg from "../../Assets/user-photo.png";
import "animate.css";

// constants
import { initState, translations } from "../../Constants";
// contexts

import { useNavigate } from "react-router-dom";
import { AppStateContext } from "../../AppContext";
const GuestInfo = () => {
  // context handler
  const { globalState, setGlobalState } = useContext(AppStateContext);

  // audio recording handling
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSilent, setIsSilent] = useState(false);
  const silenceTimerRef = useRef(null); // Timer for detecting silence
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null); // Store the stream to stop it when done
  const audioRef = useRef(null);

  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      spacing={globalState.currentPage === "welcome" ? 3 : 5}
      display="flex"
      sx={{ alignItems: "center" }}
    >
      <Avatar
        alt="user image"
        src={globalState.userId ? globalState.currentImageData : userImg}
        sx={{
          width: globalState.currentImageData ? "10rem" : "15%",
          height: globalState.currentImageData ? "10rem" : "15%",
        }}
      />
      <Stack direction="column" spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {globalState.userName
            ? globalState.userName
            : translations[globalState.currentLanguage].userName}
        </Typography>
        <Typography variant="h5" color="#eb8908">
          {translations[globalState.currentLanguage].loginText}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default GuestInfo;
