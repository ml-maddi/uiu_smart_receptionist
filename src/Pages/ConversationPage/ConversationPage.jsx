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

import axios from "axios";

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
      resetAudio();
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

  // Refs for audio management
  // Add these as component-level refs
  const audioRef = useRef(new Audio());
  const isPlayingRef = useRef(false);
  const currentAudioIndexRef = useRef(0);
  const pendingAudioGenerationRef = useRef(new Set());
  const audioUrlsRef = useRef([]); // Store audio URLs in a ref

  // Replace your existing useEffect for audio generation with this one
  useEffect(() => {
    // Function to generate audio for a specific text segment
    const generateAudioForSegment = async (text, index) => {
      // Skip if this segment is already being processed
      if (pendingAudioGenerationRef.current.has(index)) {
        return;
      }

      // Mark this segment as being processed
      pendingAudioGenerationRef.current.add(index);

      try {
        console.log(`Generating audio for segment ${index}: "${text}"`);
        const audioUrl = await generateTTSAudio(text);
        console.log(`Audio generated for segment ${index}:`, audioUrl);

        // Update our ref array directly
        while (audioUrlsRef.current.length <= index) {
          audioUrlsRef.current.push("");
        }
        audioUrlsRef.current[index] = audioUrl;

        console.log("Updated audioUrlsRef:", audioUrlsRef.current);

        // Also update the global state (for completeness)
        setGlobalState((prevState) => {
          const newSplitAudios = [
            ...(prevState.pageStates.ConversationStates.textSplitStates
              .splitAudios || []),
          ];

          // Ensure the array is long enough
          while (newSplitAudios.length <= index) {
            newSplitAudios.push("");
          }

          newSplitAudios[index] = audioUrl;

          return {
            ...prevState,
            pageStates: {
              ...prevState.pageStates,
              ConversationStates: {
                ...prevState.pageStates.ConversationStates,
                textSplitStates: {
                  ...prevState.pageStates.ConversationStates.textSplitStates,
                  splitAudios: newSplitAudios,
                },
              },
            },
          };
        });

        // If this is the first audio and we're not playing yet, start playback
        if (index === 0 && !isPlayingRef.current) {
          console.log("First audio ready, starting playback");
          startPlayback();
        }
      } catch (error) {
        console.error(`Error generating audio for segment ${index}:`, error);
      } finally {
        // Remove this segment from the processing set
        pendingAudioGenerationRef.current.delete(index);
      }
    };

    // Process text segments
    const processTextSegments = async () => {
      const currentSplitTexts =
        globalState.pageStates.ConversationStates.textSplitStates.splitTexts ||
        [];

      console.log("Processing text segments:", currentSplitTexts.length);

      // Prioritize generating the first audio
      if (
        currentSplitTexts.length > 0 &&
        !pendingAudioGenerationRef.current.has(0)
      ) {
        const existingAudio = audioUrlsRef.current[0] || "";
        if (!existingAudio) {
          console.log("Prioritizing first segment");
          await generateAudioForSegment(currentSplitTexts[0], 0);
        }
      }

      // Process remaining segments
      for (let i = 0; i < currentSplitTexts.length; i++) {
        const existingAudio = audioUrlsRef.current[i] || "";
        if (!existingAudio && !pendingAudioGenerationRef.current.has(i)) {
          generateAudioForSegment(currentSplitTexts[i], i);
        }
      }
    };

    // Run the processing function whenever splitTexts changes
    if (
      globalState.pageStates.ConversationStates.textSplitStates.splitTexts
        .length > 0
    ) {
      processTextSegments();
    }
  }, [globalState.pageStates.ConversationStates.textSplitStates.splitTexts]);

  // Function to generate TTS audio - replace with your actual TTS API call
  const generateTTSAudio = async (text) => {
    const response = await axios.post(
      `https://bright-namely-ant.ngrok-free.app/generate-audio/`,
      { text: text, lang: globalState.currentLanguage }
    );

    const data = await response.data;
    console.log(data);

    if (!data.success) {
      throw new Error(data.error || "Failed to generate audio");
    }

    // Convert base64 to blob
    const byteCharacters = atob(data.audio_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: `audio/${data.format}` });

    // Create URL from blob
    const url = URL.createObjectURL(blob);
    return url;
  };

  // Modified startPlayback function
  const startPlayback = () => {
    if (isPlayingRef.current) {
      console.log("Already playing, not starting again");
      return;
    }

    console.log("Starting audio playback");
    isPlayingRef.current = true;
    currentAudioIndexRef.current = 0;

    // Call playNextAudio which will find and play the first available audio
    playNextAudio();
  };

  // Modified playNextAudio function using the ref directly
  const playNextAudio = () => {
    if (!isPlayingRef.current) {
      console.log("Not currently in playing mode");
      return;
    }

    const currentIndex = currentAudioIndexRef.current;

    // Use our ref to access audio URLs directly
    console.log("Available audio URLs from ref:", audioUrlsRef.current);

    // Check if we've reached the end
    if (currentIndex >= audioUrlsRef.current.length) {
      console.log("Reached end of audio segments");
      isPlayingRef.current = false;
      return;
    }

    // Check if this audio is available
    const audioUrl = audioUrlsRef.current[currentIndex];
    if (!audioUrl || audioUrl === "") {
      console.log(
        `Audio ${currentIndex} not ready yet, checking again soon...`
      );
      // Audio not ready yet, check again in a moment
      setTimeout(playNextAudio, 100);
      return;
    }

    console.log(`Playing audio ${currentIndex}:`, audioUrl);

    // Set up the audio
    const audio = audioRef.current;

    // Set event handlers before changing the source
    audio.onended = () => {
      console.log(`Audio ${currentIndex} finished playing`);
      currentAudioIndexRef.current++;
      playNextAudio();
    };

    audio.onerror = (err) => {
      console.error(`Error playing audio ${currentIndex}:`, err);
      // Try to continue with next audio
      currentAudioIndexRef.current++;
      playNextAudio();
    };

    // Set new source
    audio.src = audioUrl;

    // Start playback with explicit error handling
    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error);
          console.log("Audio element state:", {
            src: audio.src,
            paused: audio.paused,
            currentTime: audio.currentTime,
            duration: audio.duration,
            readyState: audio.readyState,
          });
          // Try to continue with next audio
          currentAudioIndexRef.current++;
          playNextAudio();
        });
      }
    } catch (e) {
      console.error("Exception during audio.play():", e);
      currentAudioIndexRef.current++;
      playNextAudio();
    }
  };

  // Stop playback function remains the same
  const stopPlayback = () => {
    console.log("Stopping playback");

    // Stop the current audio
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;

    // Update state
    isPlayingRef.current = false;
    currentAudioIndexRef.current = 0;
  };

  // Modified reset function to also reset our ref
  const resetAudio = () => {
    console.log("Resetting audio state");

    // Stop any playing audio
    stopPlayback();

    // Clear any pending audio generation
    pendingAudioGenerationRef.current.clear();

    // Clear our audio URLs ref
    audioUrlsRef.current = [];

    // Clear the audio arrays in global state
    setGlobalState((prevState) => ({
      ...prevState,
      pageStates: {
        ...prevState.pageStates,
        ConversationStates: {
          ...prevState.pageStates.ConversationStates,
          textSplitStates: {
            ...prevState.pageStates.ConversationStates.textSplitStates,
            splitAudios: [],
          },
        },
      },
    }));
  };

  useEffect(() => {
    resetAudio();
  }, [globalState.pageStates.ConversationStates.micBtnPressed]);

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
