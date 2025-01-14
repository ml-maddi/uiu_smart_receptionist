import React, { createContext, useState } from "react";
import {
  AudioPlayingStatus,
  DifferentPages,
  NameProcessingStatus,
  NameRecordingStatus,
} from "./Constants";

// Create the context
export const AppStateContext = createContext();

let timer;
// Create a provider component
export const AppStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    userInFront: false,
    currentPage: DifferentPages.START,
    currentStage: "",
    currentImageData: null,
    currentLanguage: "bn",
    currentNameData: null,
    userId: null,
    userName: "",
    currentQuestionData: "",
    currentQuestionText: "",
    messages: [],
    audioPlayDone: false,
    stopCurrentlyPlayingAudio: false,
    currentRatingValue: 1,
    currentRatingDetailData: null,
    audioPlayingData: null,
    audioInstance: null, // Moved audio instance here
    notificationStates: {
      showNotification: false,
      notificationType: "",
      notificationMessage: "",
      processingAudio: false,
    },
    pageStates: {
      startStates: {
        btnPressed: false,
      },
      getStartedStates: {
        getStartedBtnPressed: false,
        micBtnPressed: false,
        showMicToolTip: false,
        welcomeAudioPlayDone: false,
        greetNameAudioPlayDone: false,
        questionAskAudioPlayDone: false,
      },
      ConversationStates: {
        micBtnPressed: false,
        showThankYou: false,
        showKeyboard: false,
        keyboardRef: null,
        stopListening: false,
      },
    },
    componentStates: {
      getStartedModalStates: {
        openModal: false,
        currentStep: 1,
        faceComponentContinueBtnPressed: false,
        showContinueToolTip: false,
        nameRecordingStatus: NameRecordingStatus.NOT_STARTED,
        nameProcessingStatus: NameProcessingStatus.NOT_STARTED,
        retakeContinueAudioPlayed: false,
      },
      feedbackStates: {
        showFeedbackModal: false,
        listeningStart: false,
        listeningEnd: false,
        currentFeedbackItem: 0,
        allFeedbackStates: Array(7).fill({
          emojiRating: 1,
          detail: "",
        }),
      },
    },
  });
  const addAudioToQueue = (newAudio) => {
    setGlobalState((prevState) => ({
      ...prevState,
      audioPlayingData: newAudio, // Add new item to the array
    }));
  };
  // Utility function to stop current audio
  const stopCurrentAudio = () => {
    console.log("Audio Stopped is called");
    if (globalState.audioInstance !== null) {
      globalState.audioInstance.pause();
      globalState.audioInstance.currentTime = 0; // Reset to the start
      console.log("I was called stop audio from here");
    }
    if (
      globalState.currentPage === DifferentPages.GET_STARTED &&
      globalState.audioPlayingData.name === "Welcome audio" &&
      !globalState.pageStates.getStartedStates.welcomeAudioPlayDone
    ) {
      setGlobalState((prevState) => ({
        ...prevState,
        pageStates: {
          ...prevState.pageStates,
          getStartedStates: {
            ...prevState.pageStates.getStartedStates,
            welcomeAudioPlayDone: true,
          },
        },
      }));
    }
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "Question_ask audio" &&
      !globalState.pageStates.getStartedStates.questionAskAudioPlayDone
    ) {
      setGlobalState((prevState) => ({
        ...prevState,
        pageStates: {
          ...prevState.pageStates,
          getStartedStates: {
            ...prevState.pageStates.getStartedStates,
            questionAskAudioPlayDone: true,
          },
        },
      }));
    }
    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.name === "Name audio" &&
      !globalState.pageStates.getStartedStates.greetNameAudioPlayDone
    ) {
      setGlobalState((prevState) => ({
        ...prevState,
        pageStates: {
          ...prevState.pageStates,
          getStartedStates: {
            ...prevState.pageStates.getStartedStates,
            greetNameAudioPlayDone: true,
          },
        },
      }));
    }
  };

  // Utility function to play new audio
  const playNewAudio = async () => {
    console.log("playing audio is called");
    stopCurrentAudio(); // Stop any currently playing audio
    console.log(globalState.audioPlayingData);

    if (
      globalState.audioPlayingData !== null &&
      globalState.audioPlayingData.status === AudioPlayingStatus.NOT_STARTED
    ) {
      // Use a functional state update to handle the shift
      const audioInfo = globalState.audioPlayingData; // Get the first item

      console.log(audioInfo); // Log the item being processed

      if (audioInfo.file) {
        setGlobalState((prevState) => ({
          ...prevState,
          audioInstance: newAudio, // Store new audio instance in globalState
          audioPlayingData: {
            ...prevState.audioPlayingData,
            status: AudioPlayingStatus.STARTED,
          },
        }));
        const newAudio = new Audio(audioInfo.file);
        await newAudio.play();
        console.log(`${audioInfo.name} started playing`);

        newAudio.onended = () => {
          setGlobalState((prevState) => ({
            ...prevState,
            audioInstance: null,
            audioPlayingData: {
              ...prevState.audioPlayingData,
              status: AudioPlayingStatus.DONE,
            },
          }));
          if (audioInfo.name === "Question_ask audio") {
            setGlobalState((prevState) => ({
              ...prevState,
              pageStates: {
                ...prevState.pageStates,
                getStartedStates: {
                  ...prevState.pageStates.getStartedStates,
                  questionAskAudioPlayDone: true,
                },
              },
            }));
          } else if (audioInfo.name === "Name audio") {
            setGlobalState((prevState) => ({
              ...prevState,
              pageStates: {
                ...prevState.pageStates,
                getStartedStates: {
                  ...prevState.pageStates.getStartedStates,
                  greetNameAudioPlayDone: true,
                },
              },
            }));
          } else if (audioInfo.name === "Welcome audio") {
            setGlobalState((prevState) => ({
              ...prevState,
              pageStates: {
                ...prevState.pageStates,
                getStartedStates: {
                  ...prevState.pageStates.getStartedStates,
                  welcomeAudioPlayDone: true,
                },
              },
            }));
          }
        };
      } else if (audioInfo.data) {
        const newAudio = new Audio(audioInfo.data);
        newAudio.play();
        console.log(`${audioInfo.name} started playing`);

        setGlobalState((prevState) => ({
          ...prevState,
          audioInstance: newAudio, // Store new audio instance in globalState
          audioPlayingData: {
            ...prevState.audioPlayingData,
            status: AudioPlayingStatus.STARTED,
          },
        }));
        newAudio.onended = () => {
          setGlobalState((prevState) => ({
            ...prevState,
            audioInstance: null,
            audioPlayingData: {
              ...prevState.audioPlayingData,
              status: AudioPlayingStatus.DONE,
            },
          }));
        };
      }
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        globalState,
        setGlobalState,
        addAudioToQueue,
        playNewAudio,
        stopCurrentAudio,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
