import React, { useContext } from "react";
import Wave from "../../Components/SaraConversationIntro/Wave";
import ListeningIntro from "../../Components/SaraConversationIntro/ListeningIntro";
import { Box, Button } from "@mui/material";
import { StopCircleOutlined } from "@mui/icons-material";
import { translations } from "../../Constants";
import { AppStateContext } from "../../AppContext";

const ListeningOverlay = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const stopListening = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      pageStates: {
        ...prevState.pageStates,
        ConversationStates: {
          ...prevState.pageStates.ConversationStates,
          stopListening: true,
        },
      },
    }));
  };
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
        height: "25%",
        top: "20%",
        py: "2rem",
        // left: "50%",
        // transform: "translate(-50%, -60%)",
        color: "black",
      }}
    >
      <Wave />
      <ListeningIntro />
      <Box
        className="animate__animated animate__pulse animate__infinite"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt="3.5rem"
      >
        <Button
          color="warning"
          sx={{ fontSize: "2.5rem" }}
          variant="outlined"
          onClick={stopListening}
        >
          {translations[globalState.currentLanguage].listeningStopBtnText}
          <StopCircleOutlined sx={{ mx: "1rem", fontSize: "3rem" }} />
        </Button>
      </Box>
    </Box>
  );
};

export default ListeningOverlay;
