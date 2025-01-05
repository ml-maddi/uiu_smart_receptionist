import React, { createContext, useState } from "react";

// Create the context
export const AppStateContext = createContext();

// Create a provider component
export const AppStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    userInFront: false,
    currentPage: "Start",
    currentImageData: null,
    currentLanguage: "bn",
    currentNameData: null,
    userId: null,
    userName: "",
    userNameEn: "",
    currentQuestionData: "",
    messages: [],
    audioPlayDone: false,
    stopCurrentlyPlayingAudio: false,
    currentRatingValue: 1,
    currentRatingDetailData: null,
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
      },
      ConversationStates: {
        micBtnPressed: false,
        showThankYou: false,
      },
    },
    componentStates: {
      getStartedModalStates: {
        openModal: false,
        currentStep: 1,
        faceComponentContinueBtnPressed: false,
        showContinueToolTip: false,
        nameAudioProcessing: false,
        retakeContinueAudioPlayed: false,
      },
      feedbackStates: {
        showFeedbackModal: false,
        listeningStart: false,
        listeningEnd: false,
        currentFeedbackItem: 0,
        allFeedbackStates: [
          {
            emojiRating: 1,
            detail: "",
          },
          {
            emojiRating: 1,
            detail: "",
          },
          {
            emojiRating: 1,
            detail: "",
          },
          {
            emojiRating: 1,
            detail: "",
          },
          {
            emojiRating: 1,
            detail: "",
          },
          {
            emojiRating: 1,
            detail: "",
          },
          {
            emojiRating: 1,
            detail: "",
          },
        ],
      },
    },
  }); // Default to Bangla
  const [audioInstance, setAudioInstance] = useState(null);

  const stopCurrentAudio = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0; // Reset to the start
    }
    if (
      globalState.currentPage === "GetStarted" &&
      globalState.pageStates.getStartedStates.welcomeAudioPlayDone === false
    ) {
      setGlobalState((prevState) => {
        return {
          ...prevState,
          pageStates: {
            ...prevState.pageStates,
            getStartedStates: {
              ...prevState.pageStates.getStartedStates,
              welcomeAudioPlayDone: true,
            },
          },
        };
      });
    }
  };

  const playNewAudio = (audioFile) => {
    stopCurrentAudio();
    const newAudio = new Audio(audioFile);
    setAudioInstance(newAudio);
    newAudio.play();
  };

  return (
    <AppStateContext.Provider
      value={{ globalState, setGlobalState, stopCurrentAudio, playNewAudio }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
