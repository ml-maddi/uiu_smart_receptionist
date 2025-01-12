import React from "react";
import HeaderTopConversation from "./HeaderTopConversation";
import { Box } from "@mui/material";
import HeaderReturnConversation from "./HeaderReturnConversation";

const HeaderConversation = () => {
  return (
    <Box
      sx={{
        height: "20rem",
        width: "85%",
        // my: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",

        // bgcolor: "#ddd",
        mx: "auto",
      }}
    >
      <HeaderTopConversation />
      <HeaderReturnConversation />
    </Box>
  );
};

export default HeaderConversation;
