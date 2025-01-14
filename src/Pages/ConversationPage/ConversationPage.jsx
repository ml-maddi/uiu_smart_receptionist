import React, { useEffect, Component, useContext } from "react";
// assets
import bgGradient from "../../Assets/orange-noisy-gradient.png";
// components
import { Backdrop, Box } from "@mui/material";
import HeaderConversation from "./Header/HeaderConversation";
// contexts

import MessagesArea from "./MessagesArea";
import SaraAvatar from "../../Components/SaraAvatar/SaraAvatar";
import { AppStateContext } from "../../AppContext";
import AlertNotifier from "../../Components/AlertNotifier/AlertNotifier";
import ListeningOverlay from "./ListeningOverlay";
import FeedbackPage from "../FeedbackPage/FeedbackPage";
import ShowThankYou from "../../Components/ShowThankYou";
import { DifferentPages } from "../../Constants";

const ConversationPage = () => {
  // current page handling
  const { globalState, setGlobalState } = useContext(AppStateContext);
  useEffect(() => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentPage: DifferentPages.CONVERSATION,
    }));

    // setGlobalState({ ...globalState, currentPage: "conversation" });
  }, [setGlobalState]);

  return (
    <Box
      sx={{
        width: "100vw", // Full width of the viewport
        height: "100vh", // Full height of the viewport
        position: "fixed", // Fix the element to the viewport
        top: 0,
        left: 0,
        pt: "5rem", // Padding if needed
        backgroundImage: `url(${bgGradient})`, // Set the background image
        backgroundSize: "cover", // Ensure the background covers the full container
        backgroundPosition: "center", // Center the background image
        backgroundRepeat: "no-repeat", // Ensure the image doesn't repeat
      }}
    >
      {globalState.showNotification === true && <AlertNotifier time={3000} />}
      {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={globalState.pageStates.ConversationStates.micBtnPressed}
      >
        <ListeningOverlay />
      </Backdrop>
      <SaraAvatar />
      <HeaderConversation />
      <FeedbackPage />
      <MessagesArea />
      <ShowThankYou />
    </Box>
  );
};

export default ConversationPage;
