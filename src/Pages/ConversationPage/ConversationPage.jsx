import React, { useEffect, useRef, useContext, useState } from "react";
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

  // Use ref to reliably access the latest state in callbacks
  const prevFullTextRef = useRef("");

  const addToSplitTexts = (newSplitText) => {
    setGlobalState((prevState) => ({
      ...prevState,
      pageStates: {
        ...prevState.pageStates,
        ConversationStates: {
          ...prevState.pageStates.ConversationStates,
          textSplitStates: {
            ...prevState.pageStates.ConversationStates.textSplitStates,
            splitTexts: [
              ...prevState.pageStates.ConversationStates.textSplitStates
                .splitTexts,
              newSplitText,
            ],
          },
        },
      },
    }));
  };
  // to handle split texting
  // Track the position of the last processed character
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0);

  // Track the space count between splits
  const [currentSpaceCount, setCurrentSpaceCount] = useState(0);

  // Track the start index of the current split
  const [currentSplitStartIndex, setCurrentSplitStartIndex] = useState(0);

  useEffect(() => {
    setGlobalState((prevState) => ({
      ...prevState,
      currentPage: DifferentPages.CONVERSATION,
    }));

    // setGlobalState({ ...globalState, currentPage: "conversation" });
  }, [setGlobalState]);

  // Update the ref whenever the global text changes
  useEffect(() => {
    const fullText =
      globalState.pageStates.ConversationStates.textSplitStates.fullText;
    // Check if text was reset (current text is shorter than previous text)
    if (fullText.length < prevFullTextRef.current.length) {
      console.log("Text reset detected!");

      // Reset the processing state
      setLastProcessedIndex(0);
      setCurrentSpaceCount(0);
      setCurrentSplitStartIndex(0);

      // Reset the global split arrays
      setGlobalState((prevState) => ({
        ...prevState,
        pageStates: {
          ...prevState.pageStates,
          ConversationStates: {
            ...prevState.pageStates.ConversationStates,
            textSplitStates: {
              ...prevState.pageStates.ConversationStates.textSplitStates,
              splitTexts: [],
              splitAudios: [],
            },
          },
        },
      }));
    }

    prevFullTextRef.current = fullText;

    if (fullText.length > lastProcessedIndex) {
      console.log("Text length:", fullText.length);
      console.log("Last processed index:", lastProcessedIndex);

      // Pass the actual text value, not the reference to the global object
      processNewTokens(fullText);
    }
  }, [globalState.pageStates.ConversationStates.textSplitStates.fullText]);

  // Function to process only the newly arrived tokens
  const processNewTokens = (text) => {
    console.log("text splitting was called");
    console.log(text);
    if (!text) {
      console.error("Text is undefined - this shouldn't happen!");
      return;
    }

    let spaceCount = currentSpaceCount;
    let splitStartIndex = currentSplitStartIndex;

    // Process only from the last processed index to the end of current text
    for (let i = lastProcessedIndex; i < text.length; i++) {
      // Count spaces
      if (text[i] === " ") {
        spaceCount++;

        // When 5 spaces are found, create a split
        if (spaceCount === 5) {
          // Extract the text from split start position to current position (including the space)
          const splitText = text.substring(splitStartIndex, i + 1);

          addToSplitTexts(splitText);
          // setSplitTexts((prev) => [...prev, splitText]);

          // Reset space count and update split start position
          spaceCount = 0;
          splitStartIndex = i + 1;
        }
      }
    }

    // Save the current state for next processing cycle
    setLastProcessedIndex(text.length);
    setCurrentSpaceCount(spaceCount);
    setCurrentSplitStartIndex(splitStartIndex);

    // If we've reached the end of the stream, add any remaining text as final split
    if (
      globalState.pageStates.ConversationStates.fullTextDone &&
      splitStartIndex < text.length
    ) {
      const finalSplit = text.substring(splitStartIndex);
      // setSplitTexts((prev) => [...prev, finalSplit]);
      addToSplitTexts(finalSplit);
    }
  };

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
