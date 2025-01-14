import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";

import MsgItem from "./MsgItem";
import { AppStateContext } from "../../../AppContext";
import { translations } from "../../../Constants";

const Messages = () => {
  const { globalState } = useContext(AppStateContext);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [globalState.messages]);

  return (
    <Box
      ref={containerRef}
      position="absolute"
      top="20%"
      left="3rem"
      height="75%"
      width="90%"
      overflow="auto"
      display="flex"
      flexDirection="column"
    >
      {globalState.messages.length === 0 && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            alignContent: "center",
            justifyItems: "center",
          }}
        >
          <Typography variant="h4">
            {translations[globalState.currentLanguage].noMessageTxt}
          </Typography>
        </Box>
      )}
      {[...globalState.messages].reverse().map((msg) => (
        <MsgItem
          key={msg.user_id}
          user_type={msg.user_type}
          editingStatus={msg.status}
        >
          {msg.text}
        </MsgItem>
      ))}
    </Box>
  );
};

export default Messages;
