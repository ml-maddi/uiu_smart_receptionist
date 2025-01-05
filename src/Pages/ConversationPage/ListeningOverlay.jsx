import React from "react";
import Wave from "../../Components/SaraConversationIntro/Wave";
import ListeningIntro from "../../Components/SaraConversationIntro/ListeningIntro";
import { Box } from "@mui/material";

const ListeningOverlay = () => {
  return (
    <Box
      // bgcolor="red"
      mt="5rem"
      position="absolute"
      sx={{
        width: "90%",
        bgcolor: "white",
        mx: "3rem",
        borderRadius: "2rem",
        height: "20%",
        top: "20%",
        py: "2rem",
        // left: "50%",
        // transform: "translate(-50%, -60%)",
        color: "black",
      }}
    >
      <Wave />
      <ListeningIntro />
    </Box>
  );
};

export default ListeningOverlay;
