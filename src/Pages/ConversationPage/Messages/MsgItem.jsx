import { Box, Paper, Typography } from "@mui/material";
import React from "react";

const MsgItem = ({ user_type, children }) => {
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
