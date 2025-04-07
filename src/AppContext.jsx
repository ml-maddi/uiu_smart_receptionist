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
        fullTextDone: false,
        textSplitStates: {
          fullText: "",
          splitTexts: [],
          splitAudios: [],
        },
      },
    },
    // database saving wise

    // surveyData: {
    //   fullTime: {
    //     sessionId: "",
    //     userId: "",
    //     startUsingTimeStamp: "",
    //     endUsingTimeStamp: "",
    //   },
    //   recognition: {
    //     sessionIds: [], <= add current session id by matching to the user
    //     userId: "",
    //     userName: "",
    //     faceImageWeb: "",
    //     faceImageDocument: "",
    //     voiceSamples: [],
    //     documentImage: "",
    //     recognitionStartTimeStamps: [],
    //     recognitionEndTimeStamps: [],
    //     totalAttempts: [],
    //     methods: [],
    //   },
    //   incomplete_recognition: {
    //     sessionId: "",
    //     userName: "",
    //     faceImageWeb: "",
    //     faceImageDocument: "",
    //     voiceSample: [],
    //     documentImage: "",
    //     recognitionStartTimeStamp: [],
    //     recognitionEndTimeStamp: [],
    //     totalAttempts: 0,
    //     methods: [],
    //   },
    //   asr: {
    //     sessionId: "",
    //     userId: "",
    //     audioData: "",
    //     transcribedText: "",
    //     audioDuration: "",
    //     asrRecognitionStartTimeStamp: "",
    //     asrRecognitionEndTimeStamp: "",
    //   },
    //   tts: {
    //     sessionId: "",
    //     userId: "",
    //     audioData: "",
    //     llmText: "",
    //     userRating: [],
    //     ttsGenerationStartTimeStamp: "",
    //     ttsGenerationEndTimeStamp: "",
    //   },
    //   llm: {
    //     sessionId: "",
    //     userId: "",
    //     askingAudioData: "",
    //     llmAnswer: "",
    //     possibleCorrectAnswer: "",
    //     userRating: [],
    //     llmRating: [],
    //     llmGenerationStartTimeStamp: "",
    //     llmGenerationEndTimeStamp: "",
    //   },
    // },
    surveyData: {
      fullTime: {
        sessionId: "",
        userId: "",
        startUsingTimeStamp: "",
        endUsingTimeStamp: "",
      },
      recognition: {
        sessionId: "",
        userId: "",
        userName: "",
        faceImageWeb: "",
        faceImageDocument: "",
        voiceSample: "",
        documentImage: "",
        recognitionStartTimeStamp: 0,
        recognitionEndTimeStamp: 0,
        totalAttempts: 0,
        method: "",
      },
      asr: {
        sessionId: "",
        userId: "",
        audioData: "",
        transcribedText: "",
        audioDuration: "",
        asrRecognitionStartTimeStamp: "",
        asrRecognitionEndTimeStamp: "",
      },
      tts: {
        sessionId: "",
        userId: "",
        audioData: "",
        llmText: "",
        userRating: [],
        ttsGenerationStartTimeStamp: "",
        ttsGenerationEndTimeStamp: "",
      },
      llm: {
        sessionId: "",
        userId: "",
        askingAudioData: "",
        llmAnswer: "",
        possibleCorrectAnswer: "",
        userRating: [],
        llmRating: [],
        llmGenerationStartTimeStamp: "",
        llmGenerationEndTimeStamp: "",
      },
    },
    componentStates: {
      getStartedModalStates: {
        openModal: false,
        selectedLoginOption: 0,
        loginOptionBtnPressed: "",
        faceComponentContinueBtnPressed: false,
        showContinueToolTip: false,
        nameRecordingStatus: NameRecordingStatus.NOT_STARTED,
        nameProcessingStatus: NameProcessingStatus.NOT_STARTED,
        retakeContinueAudioPlayed: false,
        faceRecognition: {
          disableResetBtn: false,
          disableContinueBtn: false,
          showProgressInContinueBtn: false,
        },
      },
      feedbackStates: {
        showFeedbackModal: false,
        listeningStart: false,
        listeningEnd: false,
        currentFeedbackItem: 0,
        allFeedbackStates: Array(7).fill({
          emojiRating: 5,
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
    console.log(
      "Audio Stopped is called, audioInstance:",
      globalState.audioInstance
    );
    if (globalState.audioInstance !== null) {
      setGlobalState((prevState) => {
        // Check if there’s an audio instance
        prevState.audioInstance.pause(); // Pause the audio
        prevState.audioInstance.currentTime = 0;
        console.log("Audio paused successfully");
        // if (prevState.audioInstance) {
        //   prevState.audioInstance.pause(); // Pause the audio
        //   prevState.audioInstance.currentTime = 0; // Reset to start (optional)
        //   console.log("Audio paused successfully");
        // }
        return {
          ...prevState,
          audioInstance: null,
          audioPlayingData: null,
        };
      });
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
      setTimeout(() => {
        console.log("delaying");
      }, 3000);
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
      const audioInfo = globalState.audioPlayingData;
      console.log(audioInfo);

      if (audioInfo.file) {
        const newAudio = new Audio(audioInfo.file); // Create the Audio object first
        setGlobalState((prevState) => ({
          ...prevState,
          audioInstance: newAudio, // Store the correct Audio object
          audioPlayingData: {
            ...prevState.audioPlayingData,
            status: AudioPlayingStatus.STARTED,
          },
        }));
        await newAudio.play();
        console.log(`${audioInfo.name} started playing`);

        newAudio.onended = () => {
          stopCurrentAudio();
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
