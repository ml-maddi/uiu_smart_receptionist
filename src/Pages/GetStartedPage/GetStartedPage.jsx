/**
 * This componenet is used to show the Get Started page
 */

// assets
import { Box } from "@mui/material";
import bgGradient from "../../Assets/orange-noisy-gradient.png";
// components
import Header from "./Header/Header";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import SaraAvatar from "../../Components/SaraAvatar/SaraAvatar";
import BottomInfo from "./BottomInfo/BottomInfo";
import { AppStateContext } from "../../AppContext";
import { useContext, useEffect, useRef, useState } from "react";
import StepComponent from "../../Components/StepComponent/StepComponent";
import AlertNotifier from "../../Components/AlertNotifier/AlertNotifier";
import SaraConversationIntro from "../../Components/SaraConversationIntro/SaraConversationIntro";
import ContinuousFaceDetect from "../../Components/ContinuousFaceDetect/ContinuousFaceDetect";
import { DifferentPages, DifferentStages, initState } from "../../Constants";
import LoginModal from "../../Components/LoginModal/LoginModal";
const GetStartedPage = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);

  useEffect(() => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentPage: DifferentPages.GET_STARTED,
      currentStage: DifferentStages.USER_IN_GET_STARTED_PAGE,
    }));

    // setGlobalState({ ...globalState, currentPage: "welcome" });
  }, [setGlobalState]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (
  //       globalState.currentStage ===
  //       DifferentStages.SIGNED_USER_IN_GET_STARTED_PAGE
  //     ) {
  //       // Check globalState value and call another function
  //       console.log("reset timer 3 started for signed in user");
  //       setGlobalState((prevState) => ({
  //         ...initState,
  //         currentPage: DifferentPages.GET_STARTED,
  //         currentStage: DifferentStages.USER_IN_GET_STARTED_PAGE,
  //       }));
  //     }
  //   }, 10000); // 10 seconds
  //   return () => clearTimeout(timer);
  // }, [globalState.currentStage]);

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
      {globalState.notificationStates &&
        globalState.notificationStates.showNotification === true && (
          <AlertNotifier time={3000} />
        )}

      {/* <StepComponent /> */}
      <LoginModal />
      <Header />
      <SaraAvatar />
      {globalState.userId === null ? (
        <LanguageSelector />
      ) : (
        <LanguageSelector marginTop="40%" />
      )}

      {/* depending upon whether registered user is visiting the page shows different components */}
      <BottomInfo />
      {/* {globalState.userId === null ? <BottomInfo /> : <SaraConversationIntro />} */}
      <ContinuousFaceDetect />
    </Box>
  );
};

export default GetStartedPage;
