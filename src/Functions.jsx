import axios from "axios";
import {
  NameRecordingStatus,
  NameProcessingStatus,
  translations,
  QuestionEditingStatus,
  AudioPlayingStatus,
  DifferentPages,
} from "./Constants";

const noface = "no face";

export const getPlaceholderText = (globalState) => {
  if (
    globalState.componentStates.getStartedModalStates.nameRecordingStatus ===
    NameRecordingStatus.STARTED
  ) {
    return "Recording...";
  } else if (
    globalState.componentStates.getStartedModalStates.nameRecordingStatus ===
      NameRecordingStatus.DONE &&
    globalState.componentStates.getStartedModalStates.nameProcessingStatus ===
      NameProcessingStatus.STARTED
  ) {
    return "Processing...";
  } else {
    return translations[globalState.currentLanguage].nameInputPlaceHolder;
  }
};
function countSpacesUsingIteration(str) {
  let count = 0;
  for (let char of str) {
    if (char === " ") {
      count++;
    }
  }
  return count;
}

// let A = ""; // Initial string
// let processedIndex = 0; // Tracks where the last processing ended

const checkAndExtract = async (
  responseMsg,
  sliceIndex,
  globalState,
  setGlobalState
) => {
  console.log(responseMsg);
  console.log(sliceIndex);

  let spaceCount = 0;
  let extractionEndIndex = sliceIndex;
  let extracted = "";

  for (let i = sliceIndex; i < responseMsg.length; i++) {
    const char = responseMsg[i];
    extracted += char;

    if (char === " ") {
      spaceCount++;
    }

    if (spaceCount === 4) {
      extractionEndIndex = i + 1; // Include the 4th space
      break;
    }
  }

  // If 4 spaces were found
  if (spaceCount === 4) {
    const B = extracted.trimEnd(); // Extracted substring
    console.log("Extracted:", B);
    (async () => {
      await speakOut(B, globalState, setGlobalState); // Perform the task
      console.log("Background task complete");
    })();

    // await speakOut(B, globalState, setGlobalState, audioRef); // Perform the task
    // setProcessedIndex(extractionEndIndex); // Update processed index
  }

  return extractionEndIndex;
};

// Global audio reference
let globalAudioRef = null;

// A queue to manage audio tasks
const audioQueue = [];
let isPlaying = false;

// Function to process audio queue sequentially
const processAudioQueue = async () => {
  if (audioQueue.length === 0 || isPlaying) {
    return; // Do nothing if no tasks or already playing
  }

  const { audioUrl, onComplete } = audioQueue.shift(); // Dequeue the first task
  globalAudioRef = new Audio(audioUrl);
  isPlaying = true;

  // Play the audio
  try {
    await globalAudioRef.play();
    console.log(`Playing audio: ${audioUrl}`);

    globalAudioRef.onended = () => {
      isPlaying = false; // Mark as not playing
      if (onComplete) onComplete();
      processAudioQueue(); // Process the next task
    };

    globalAudioRef.onerror = (error) => {
      console.error("Audio playback error:", error);
      isPlaying = false;
      processAudioQueue(); // Continue with the next task
    };
  } catch (error) {
    console.error("Error during audio playback:", error);
    isPlaying = false;
    processAudioQueue(); // Continue with the next task
  }
};

// Function to add tasks to the queue
// const speakOut = async (msgText, globalState, setGlobalState) => {
//   console.log("Performing task on:", msgText);

//   try {
//     const audioResponse = await axios.post(
//       `https://bright-namely-ant.ngrok-free.app/text_to_speech/`,
//       { text: msgText, lang: globalState.currentLanguage },
//       { responseType: "blob" }
//     );

//     const audioUrl = URL.createObjectURL(
//       new Blob([audioResponse.data], { type: "audio/wav" })
//     );

//     // Add task to the queue
//     audioQueue.push({
//       audioUrl,
//       onComplete: () => console.log(`Completed audio for: ${msgText}`),
//     });

//     // Process the queue
//     processAudioQueue();
//   } catch (error) {
//     const errorMessage =
//       error.code === "ERR_NETWORK"
//         ? "Network error! Please check your connection."
//         : "Error converting text to speech";

//     console.error("Error converting text to speech:", error);
//     setGlobalState((prevState) => ({
//       ...prevState,
//       notificationStates: {
//         ...prevState.notificationStates,
//         showNotification: true,
//         notificationType: "error",
//         notificationMessage: errorMessage,
//       },
//     }));
//   }
// };

const speakOut = async (
  msgText,
  globalState,
  setGlobalState,
  addAudioToQueue
) => {
  console.log("Performing task on:", msgText);

  try {
    const audioResponse = await axios.post(
      `https://bright-namely-ant.ngrok-free.app/text_to_speech/`,
      { text: msgText, lang: globalState.currentLanguage },
      { responseType: "blob" }
    );

    const audioUrl = URL.createObjectURL(
      new Blob([audioResponse.data], { type: "audio/wav" })
    );

    const AnswerAudioData = {
      name: "Answer audio",
      file: audioUrl,
      delay: 300,
      status: AudioPlayingStatus.NOT_STARTED,
    };
    addAudioToQueue(AnswerAudioData);
    // Add task to the queue
    // audioQueue.push({
    //   audioUrl,
    //   onComplete: () => console.log(`Completed audio for: ${msgText}`),
    // });

    // // Process the queue
    // processAudioQueue();
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Error converting text to speech";

    console.error("Error converting text to speech:", error);
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: errorMessage,
      },
    }));
  }
};

export const speakNameOut = async (
  globalState,
  setGlobalState,
  addAudioToQueue
) => {
  console.log("Performing task on:", globalState.userName);

  try {
    const audioResponse = await axios.post(
      `https://bright-namely-ant.ngrok-free.app/name_to_speech/`,
      { text: globalState.userName, lang: globalState.currentLanguage },
      { responseType: "blob" }
    );

    const audioUrl = URL.createObjectURL(
      new Blob([audioResponse.data], { type: "audio/wav" })
    );

    const NameAudioData = {
      name: "Name audio",
      file: audioUrl,
      delay: 300,
      status: AudioPlayingStatus.NOT_STARTED,
    };
    addAudioToQueue(NameAudioData);
    // Add task to the queue
    // audioQueue.push({
    //   audioUrl,
    //   onComplete: () => console.log(`Completed audio for: ${msgText}`),
    // });

    // // Process the queue
    // processAudioQueue();
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Error converting name to speech";

    console.error("Error converting name to speech:", error);
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: errorMessage,
      },
    }));
  }
};

export const stopPlayingAudio = (setGlobalState) => {
  setGlobalState((prevState) => {
    return {
      ...prevState,
      stopCurrentlyPlayingAudio: true,
    };
  });
};

export const containsBangla = (str) => /[\u0980-\u09FF]/.test(str);

export const getCurrentRatingSpecificPage = (globalState) => {
  return globalState.componentStates.feedbackStates.allFeedbackStates[
    globalState.componentStates.feedbackStates.currentFeedbackItem
  ].emojiRating;
};
export const getCurrentDetailRatingSpecificPage = (globalState) => {
  console.log(
    globalState.componentStates.feedbackStates.allFeedbackStates[
      globalState.componentStates.feedbackStates.currentFeedbackItem
    ].detail
  );
  return globalState.componentStates.feedbackStates.allFeedbackStates[
    globalState.componentStates.feedbackStates.currentFeedbackItem
  ].detail;
};
export const updateRatingSpecificPage = (
  setGlobalState,
  value,
  currentIndex
) => {
  setGlobalState((prevState) => {
    // const currentIndex =
    //   prevState.componentStates.feedbackStates.currentFeedbackItem;

    // Create a new array with the updated emojiRating
    const updatedFeedbackStates =
      prevState.componentStates.feedbackStates.allFeedbackStates.map(
        (item, index) =>
          index === currentIndex
            ? { ...item, emojiRating: value } // Update the specific item
            : item // Keep other items unchanged
      );

    // Return the updated state
    return {
      ...prevState,
      currentRatingValue: value,
      componentStates: {
        ...prevState.componentStates,
        feedbackStates: {
          ...prevState.componentStates.feedbackStates,
          allFeedbackStates: updatedFeedbackStates, // Use the updated array
        },
      },
    };
  });
};
export const updateDetailRatingSpecificPage = (setGlobalState, value) => {
  setGlobalState((prevState) => {
    const currentIndex =
      prevState.componentStates.feedbackStates.currentFeedbackItem;

    // Create a new array with the updated emojiRating
    const updatedFeedbackStates =
      prevState.componentStates.feedbackStates.allFeedbackStates.map(
        (item, index) =>
          index === currentIndex
            ? { ...item, detail: value } // Update the specific item
            : item // Keep other items unchanged
      );

    // Return the updated state
    return {
      ...prevState,
      // currentRatingValue: value,
      componentStates: {
        ...prevState.componentStates,
        feedbackStates: {
          ...prevState.componentStates.feedbackStates,
          allFeedbackStates: updatedFeedbackStates, // Use the updated array
        },
      },
    };
  });
};
export const updateCurrentFeedbackPageNumber = (setGlobalState, command) => {
  setGlobalState((prevState) => ({
    ...prevState,
    componentStates: {
      ...prevState.componentStates,
      feedbackStates: {
        ...prevState.componentStates.feedbackStates,
        currentFeedbackItem:
          command === "next"
            ? prevState.componentStates.feedbackStates.currentFeedbackItem + 1
            : prevState.componentStates.feedbackStates.currentFeedbackItem - 1,
      },
    },
  }));
};
export const toggleFeedbackPage = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    componentStates: {
      ...prevState.componentStates,
      feedbackStates: {
        ...prevState.componentStates.feedbackStates,
        showFeedbackModal:
          !prevState.componentStates.feedbackStates.showFeedbackModal,
      },
    },
  }));
};
export const handleFeedbackSpeaking = (
  globalState,
  setGlobalState,
  base64data
) => {
  setGlobalState((prevState) => ({
    ...prevState,
    notificationStates: {
      ...prevState.notificationStates,

      showNotification: true,
      notificationType: "success",
      notificationMessage: "Audio Received!",
      processingAudio: true,
    },
  }));
  try {
    axios
      .post(`https://bright-namely-ant.ngrok-free.app/speech_to_text`, {
        audio: base64data,
        lang: globalState.currentLanguage,
        // lang: "en",
      })
      .then((response) => {
        const transcript = response.data.transcript;
        console.log(transcript);
        console.log(transcript.length);
        if (transcript.length > 0) {
          setGlobalState((prevState) => ({
            ...prevState,
            notificationStates: {
              ...prevState.notificationStates,
              showNotification: true,
              notificationType: "success",
              notificationMessage: "Audio processed!",
              processingAudio: false,
            },
          }));
          updateDetailRatingSpecificPage(setGlobalState, transcript);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.code === "ERR_NETWORK"
            ? "Network error! Please check your connection."
            : "No voice was detected.Try again!";

        console.error("There was an error!", error);
        setGlobalState((prevState) => ({
          ...prevState,
          notificationStates: {
            ...prevState.notificationStates,
            showNotification: true,
            notificationType: "error",
            notificationMessage: errorMessage,
            processingAudio: false,
          },
        }));
        // setLoading(false);
      });
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "No voice was detected.Try again!";

    console.error("There was an error!", error);
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: errorMessage,
        processingAudio: false,
      },
    }));
  }
};

const saveToFile = (globalState) => {
  // Convert JSON data to string
  const jsonString = JSON.stringify(
    globalState.componentStates.feedbackStates.allFeedbackStates,
    null,
    2
  ); // Pretty formatting with 2 spaces

  // Create a Blob object
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a link element
  const link = document.createElement("a");

  // Create a URL for the Blob and set it as the href
  link.href = URL.createObjectURL(blob);

  // Set the download attribute with a filename
  link.download =
    globalState.userId !== null
      ? `feedbackStates_${globalState.userId}.json`
      : `feedbackStates_${new Date().toISOString().replace(/:/g, "-")}.json`;

  // Append link to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleFeedbackSubmitting = async (globalState, setGlobalState) => {
  saveToFile(globalState);
  toggleFeedbackPage(setGlobalState);
  console.log(globalState.componentStates.feedbackStates.allFeedbackStates);
  await submitSurveyToDB(globalState);
  setGlobalState((prevState) => ({
    ...prevState,
    pageStates: {
      ...prevState.pageStates,
      ConversationStates: {
        ...prevState.pageStates.ConversationStates,
        showThankYou: true,
      },
    },
  }));
};
const addUserQuestionToMessages = (setGlobalState, text) => {
  const messageId = Date.now(); // Unique ID based on timestamp
  console.log(messageId);
  const userMessage = {
    user_id: String(messageId),
    user_type: "user",
    text: text,
    status: QuestionEditingStatus.NOT_STARTED,
  };
  setGlobalState((prevState) => ({
    ...prevState,
    messages: [...prevState.messages, userMessage],
    currentMessage: userMessage,

    pageStates: {
      ...prevState.pageStates,
      ConversationStates: {
        ...prevState.pageStates.ConversationStates,
        responseStringProcessedIndex: 0,
      },
    },
  }));
};

export const QuestionAnswering = async (
  globalState,
  setGlobalState,
  addAudioToQueue,
  text
) => {
  const messageId = Date.now(); // Unique ID based on timestamp
  console.log(messageId);
  const userMessage = {
    user_id: String(messageId),
    user_type: "user",
    text: text,
  };
  const botId = String(messageId + 1);
  setGlobalState((prevState) => ({
    ...prevState,
    messages: [...prevState.messages, userMessage],
    currentMessage: userMessage,
  }));
  try {
    console.log(globalState.messages);
    // Start the streaming request
    const res = await fetch(
      `https://bright-namely-ant.ngrok-free.app/llm_answer_stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: globalState.userId,
          // user_id: "12000test",
          query: text,
          query_answer_list: globalState.messages,
        }),
      }
    );

    if (!res.ok) {
      showNotificationError(
        setGlobalState,
        "Failed to fetch response from API!"
      );

      throw new Error("Failed to fetch response from API");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let done = false;
    let botResponseText = ""; // Initialize bot response text

    // Initialize the bot response object

    console.log(botId);
    const botResponse = { user_id: botId, user_type: "bot", text: "" };

    setGlobalState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, botResponse],
    }));

    let sliceIndex = 0;
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      const chunk = decoder.decode(value, { stream: true });

      // Extract only 'content' values from the chunk and update the response
      const contentMatches = [...chunk.matchAll(/content='(.*?)'/g)];
      contentMatches.forEach((match) => {
        const content = match[1];
        botResponseText += content; // Append content to bot response text
        botResponse.text = botResponseText; // Update the bot response text

        // Update the existing bot message in the global state
        setGlobalState((prevState) => {
          const updatedMessages = prevState.messages.map((msg) => {
            // Check if the message ID matches
            if (msg.user_id === botId) {
              return botResponse; // Update the existing bot response
            }
            return msg; // Return unchanged message
          });
          console.log(updatedMessages);
          return { ...prevState, messages: updatedMessages };
        });
        //   checkAndExtract(
        //     botResponseText,
        //     sliceIndex,
        //     globalState,
        //     setGlobalState
        //   ).then((newSliceIndex) => {
        //     sliceIndex = newSliceIndex; // Update sliceIndex once resolved
        //     botResponse.text = botResponseText; // Update the bot response text

        //     // Update the existing bot message in the global state
        //     setGlobalState((prevState) => {
        //       const updatedMessages = prevState.messages.map((msg) => {
        //         // Check if the message ID matches
        //         if (msg.user_id === botId) {
        //           return botResponse; // Update the existing bot response
        //         }
        //         return msg; // Return unchanged message
        //       });
        //       console.log(updatedMessages);
        //       return { ...prevState, messages: updatedMessages };
        //     });
        //   });
      });
    }
    // (async () => {
    //   await speakOut(
    //     botResponse.text,
    //     globalState,
    //     setGlobalState,
    //     addAudioToQueue
    //   ); // Perform the task
    //   console.log("Background task complete");
    // })();
    await addQuestionAnswerToDB(globalState.userId, text, botResponse.text);
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Sorry, there was an error processing your request. Try again!";

    showNotificationError(setGlobalState, errorMessage);
  }
  // finally{
  //   setGlobalState((prevState) => {
  //     return {
  //       ...prevState,
  //       pageStates:{
  //         ...prevState.pageStates,
  //         ConversationStates: {
  //           ...prevState.pageStates.ConversationStates,
  //           responseStringProcessedIndex: 0
  //         },
  //       }
  //     };
  //   });
  // }
};

export const QuestionAsking = (
  globalState,
  setGlobalState,
  addAudioToQueue,
  navigate,
  base64data
) => {
  try {
    axios
      .post(`https://bright-namely-ant.ngrok-free.app/speech_to_text`, {
        audio: base64data,
        lang: globalState.currentLanguage,
      })
      .then((response) => {
        const transcript = response.data.transcript;
        console.log(transcript);
        console.log(transcript.length);
        if (transcript.length === 0) {
          showNotificationError(
            setGlobalState,
            "No voice was detected.Try again!"
          );
          return;
        }

        if (globalState.currentLanguage === "bn") {
          if (containsBangla(transcript) === false) {
            console.log("zero");
            showNotificationError(
              setGlobalState,
              "No voice was detected.Try again!"
            );
          } else {
            setGlobalState((prevState) => ({
              ...prevState,
              currentQuestionData: "",
            }));

            // addUserQuestionToMessages(setGlobalState, transcript);
            QuestionAnswering(
              globalState,
              setGlobalState,
              addAudioToQueue,
              transcript
            );
            console.log(transcript);
          }
        } else {
          if (globalState.currentPage === DifferentPages.GET_STARTED) {
            setTimeout(() => {
              navigate("/conversation");
            }, 500); // 2000ms = 2 seconds
          }
          setGlobalState((prevState) => ({
            ...prevState,
            currentQuestionData: "",
          }));

          // addUserQuestionToMessages(setGlobalState, transcript);
          QuestionAnswering(
            globalState,
            setGlobalState,
            addAudioToQueue,
            transcript
          );
          console.log(transcript);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.code === "ERR_NETWORK"
            ? "Network error! Please check your connection."
            : "No voice was detected.Try again!";
        console.error("There was an error!", error);
        setTimeout(() => {
          showNotificationError(setGlobalState, errorMessage);
        }, 3000);

        // setLoading(false);
      });
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "No voice was detected.Try again!";

    setTimeout(() => {
      showNotificationError(setGlobalState, errorMessage);
    }, 3000);
  }
};

export const handleGetStartedMicBtnPressed = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    pageStates: {
      ...prevState.pageStates,
      getStartedStates: {
        ...prevState.pageStates.getStartedStates,
        micBtnPressed: true,
      },
    },
  }));
};

export const handleConversationMicBtnPressed = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    pageStates: {
      ...prevState.pageStates,
      ConversationStates: {
        ...prevState.pageStates.ConversationStates,
        micBtnPressed: true,
      },
    },
  }));
};

export const handleFaceComponentContinueBtnPressed = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    componentStates: {
      ...prevState.componentStates,
      getStartedModalStates: {
        ...prevState.componentStates.getStartedModalStates,
        faceComponentContinueBtnPressed: true,
      },
    },
  }));
};
export const gotoNameAdd = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    componentStates: {
      ...prevState.componentStates,
      getStartedModalStates: {
        ...prevState.componentStates.getStartedModalStates,
        currentStep: 2,
      },
    },
  }));
};
export const handleUserFound = async (setGlobalState, userId) => {
  // need to update setusername later, python server code first need to be updated correclty to handle this func call
  // await setUserName(setGlobalState, userId);
  setGlobalState((prevState) => ({
    ...prevState,
    componentStates: {
      ...prevState.componentStates,
      getStartedModalStates: {
        ...prevState.componentStates.getStartedModalStates,
        openModal: false,
      },
    },
  }));
};
const detectLanguage = (inputText) => {
  const banglaCount = Array.from(inputText).filter(
    (char) => char.charCodeAt(0) >= 0x0980 && char.charCodeAt(0) <= 0x09ff
  ).length;

  const englishCount = Array.from(inputText).filter(
    (char) =>
      (char.charCodeAt(0) >= 0x0041 && char.charCodeAt(0) <= 0x007a) || // A-Z or a-z
      (char.charCodeAt(0) >= 0x0030 && char.charCodeAt(0) <= 0x0039) // 0-9
  ).length;

  if (banglaCount > englishCount) {
    return "Bangla";
  } else if (englishCount > banglaCount) {
    return "English";
  } else {
    return "Mixed or Unknown";
  }
};
const nameInputOkay = (globalState) => {
  if (
    globalState.currentLanguage === "bn" &&
    detectLanguage(globalState.userName) === "Bangla"
  ) {
    return true;
  } else if (
    globalState.currentLanguage === "en" &&
    detectLanguage(globalState.userName) === "English"
  ) {
    return true;
  } else {
    return false;
  }
};
export const handleStartBtnClick = async (globalState, setGlobalState) => {
  if (globalState.userName === "") {
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: "Please add your name to continue!",
      },
    }));
  } else if (nameInputOkay(globalState) === false) {
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage:
          "Please enter Bangla text when Bangla language is selected and English text when English language is selected!",
      },
    }));
  } else {
    const userId = await createUserUsingFaceName(globalState, setGlobalState);
    console.log(userId);

    setGlobalState((prevState) => ({
      ...prevState,
      componentStates: {
        ...prevState.componentStates,
        getStartedModalStates: {
          ...prevState.componentStates.getStartedModalStates,
          openModal: false,
        },
      },
    }));
  }
};

const setUserInFront = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    userInFront: true,
  }));
};
const resetUserInFront = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    userInFront: false,
  }));
};

const setUserID = (setGlobalState, id) => {
  setGlobalState((prevState) => ({
    ...prevState,
    userId: id,
  }));
};
const resetUserID = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    userId: null,
  }));
};

export const isFaceDetectedContinuous = async (imgData, setGlobalState) => {
  try {
    let msg = await handleFaceDetect(imgData);
    if (msg.includes(noface)) {
      showNotificationError(setGlobalState, "face not detected");
      resetUserInFront(setGlobalState);
      resetCurrentImageData(setGlobalState);
      return false;
    } else {
      setCurrentImageData(setGlobalState, imgData);
      setUserInFront(setGlobalState);
      showNotificationSuccess(setGlobalState, "face got detected");
      return true;
    }
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Sorry, error detecting face!";

    showNotificationError(setGlobalState, errorMessage);
    return false; // Consider returning false if there's an error
  }
};

export const isFaceDetected = async (globalState, setGlobalState) => {
  try {
    const imgData = globalState.currentImageData;
    let msg = await handleFaceDetect(imgData);
    if (msg.includes(noface)) {
      showNotificationError(setGlobalState, "face not detected");
      resetCurrentImageData(setGlobalState);
      return false;
    } else {
      showNotificationSuccess(setGlobalState, "face got detected");
      return true;
    }
  } catch (error) {
    // Specific error message for network issues
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Sorry, error detecting face!";

    showNotificationError(setGlobalState, errorMessage);
    resetCurrentImageData(setGlobalState);
    return false; // Consider returning false if there's an error
  }
};

const showNotificationSuccess = (setGlobalState, successMessage) => {
  console.log(successMessage);
  setGlobalState((prevState) => ({
    ...prevState,
    notificationStates: {
      ...prevState.notificationStates,
      showNotification: true,
      notificationType: "success",
      notificationMessage: successMessage,
    },
  }));
};
const showNotificationError = (setGlobalState, errorMessage) => {
  console.log("Error:", errorMessage);
  setGlobalState((prevState) => ({
    ...prevState,
    notificationStates: {
      ...prevState.notificationStates,
      showNotification: true,
      notificationType: "error",
      notificationMessage: errorMessage,
    },
  }));
};
export const setFaceImageWeb = (setGlobalState, imgData) => {
  console.log("setting face image web");
  setGlobalState((prevState) => ({
    ...prevState,
    surveyData: {
      ...prevState.surveyData,
      recognition: {
        ...prevState.surveyData.recognition,
        faceImageWeb: imgData.split(",")[1],
      },
    },
  }));
};

export const resetFaceImageWeb = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    surveyData: {
      ...prevState.surveyData,
      recognition: {
        ...prevState.surveyData.recognition,
        faceImageWeb: "",
      },
    },
  }));
};
export const setCurrentImageData = (setGlobalState, imgData) => {
  console.log(imgData);
  setGlobalState((prevState) => ({
    ...prevState,
    currentImageData: imgData.split(",")[1],
  }));
};
const resetCurrentImageData = (setGlobalState) => {
  setGlobalState((prevState) => ({
    ...prevState,
    currentImageData: null,
  }));
};
export const disableFaceRecogContinueBtn = (setGlobalState, value = false) => {
  setGlobalState((prevState) => ({
    ...prevState,

    componentStates: {
      ...prevState.componentStates,
      getStartedModalStates: {
        ...prevState.componentStates.getStartedModalStates,
        faceRecognition: {
          ...prevState.componentStates.getStartedModalStates.faceRecognition,
          disableContinueBtn: value,
        },
      },
    },
  }));
};

export const getFaceRecogContinueBtnState = (globalState) => {
  return globalState.componentStates.getStartedModalStates.faceRecognition
    .disableContinueBtn;
};

const handleFaceDetect = async (imgData, format = "continuous") => {
  // console.log(imgData);
  const response = await axios.post(`http://localhost:8000/face_detect`, {
    image: imgData,
    format: format,
  });

  console.log("Response:", response.data.message);
  return response.data.message;
};
export const isFaceDetectedInFaceRecogMethod = async (
  globalState,
  setGlobalState
) => {
  try {
    const imgData = globalState.surveyData.recognition.faceImageWeb;
    let msg = await handleFaceDetect(imgData, "recog");
    if (msg.includes(noface)) {
      const errorMessage = "Sorry, face not detected!";
      resetFaceImageWeb(setGlobalState);
      disableFaceRecogContinueBtn(setGlobalState, true);
      showNotificationError(setGlobalState, errorMessage);
      return false;
    } else {
      disableFaceRecogContinueBtn(setGlobalState, false);
      showNotificationSuccess(setGlobalState, "face got detected");
      return true;
    }
  } catch (error) {
    // Specific error message for network issues
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Sorry, error detecting face!";
    resetFaceImageWeb(setGlobalState);
    disableFaceRecogContinueBtn(setGlobalState, true);
    showNotificationError(setGlobalState, errorMessage);

    return false; // Consider returning false if there's an error
  }
};

// export const recognizeFace = async (imgData, setGlobalState) => {
//   const base64data = imgData.split(",")[1];
//   axios
//     .post("https://wildcat-factual-painfully.ngrok-free.app/face_recognition", {
//       image: base64data,
//     })
//     .then((response) => {
//       console.log("Response:", response.data);
//       setGlobalState((prevState) => ({
//         ...prevState,
//         showNotification: true,
//         notificationType: "success",
//         notificationMessage: response.data.message,
//         userId: response.data.user_id,
//       }));
//       return response.data.user_id;
//     })
//     .catch((error) => {
//       console.error("There was an error!", error);
//       setGlobalState((prevState) => ({
//         ...prevState,
//         showNotification: true,
//         notificationType: "error",
//         notificationMessage:
//           "Sorry, There was an error in face recognition.Try Again!",
//         currentImageData: null,
//       }));
//       return null;
//     });
// };

// export const doesNameExist = async (userId) => {
//   axios
//     .post("https://wildcat-factual-painfully.ngrok-free.app/does_name_exist", {
//       user_id: userId,
//     })
//     .then((response) => {
//       console.log("Response:", response.data);
//       if (response.data.message === "name found") {
//         return response.data.name;
//       } else {
//         return null;
//       }
//     });
// };

export const recognizeFace = async (globalState, setGlobalState) => {
  try {
    const data = globalState.surveyData.recognition;
    const response = await axios.post(
      `http://localhost:8000/face_recognition`,
      {
        ...data,
      }
    );

    console.log("Response:", response.data);

    if (response.data.user_id === null) {
      showNotificationError(setGlobalState, response.data.message);
      return null;
    } else {
      setUserID(setGlobalState, response.data.user_id);
      showNotificationSuccess(setGlobalState, response.data.message);

      // Return user ID for further processing
      return response.data.user_id;
    }
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Sorry, There was an error in face recognition. Try Again!";

    showNotificationError(setGlobalState, errorMessage);
    resetFaceImageWeb(setGlobalState);
    // Return null to indicate failure
    return null;
  }
};

export const createUserUsingFaceName = async (globalState, setGlobalState) => {
  try {
    const base64data = globalState.currentImageData.split(",")[1];
    const response = await axios.post(
      `http://localhost:8000/create_user_face_name`,
      {
        image: base64data,
        name: globalState.userName,
      }
    );

    console.log("Response:", response.data);

    if (response.data.user_id === null) {
      return null;
    } else {
      // Update the global state
      setGlobalState((prevState) => ({
        ...prevState,
        userId: response.data.user_id,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "success",
          notificationMessage: response.data.message,
        },
      }));

      // Return user ID for further processing
      return response.data.user_id;
    }
  } catch (error) {
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Network error! Please check your connection."
        : "Sorry, Error in creating user. Try Again!";

    console.error("There was an error!", error);

    // Update global state with error notification
    setGlobalState((prevState) => ({
      ...prevState,
      currentImageData: null,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: errorMessage,
      },
    }));

    // Return null to indicate failure
    return null;
  }
};

export const doesNameExist = async (userId) => {
  try {
    const response = await axios.post(
      `https://bright-namely-ant.ngrok-free.app/does_name_exist`,
      {
        user_id: userId,
      }
    );

    console.log("Response:", response.data);

    // Return the name if found, otherwise return null
    if (response.data.message === "name found") {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking if name exists:", error);
    return null; // Return null if there is an error
  }
};

export const setUserName = (setGlobalState, user_id) => {
  axios
    .post(`http://localhost:8000/get_user_name_by_id`, {
      user_id,
    })
    .then(async (response) => {
      console.log(response.data);
      let name = response.data.name;
      if (name !== "name not there") {
        setGlobalState((prevState) => ({
          ...prevState,
          userName: name,
        }));
      }
    })
    .catch((error) => {
      const errorMessage =
        error.code === "ERR_NETWORK"
          ? "Network error! Please check your connection."
          : "Sorry, there was an error.Please say your name again!";

      console.error("There was an error!", error);
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage: errorMessage,
        },
      }));
    });
};
// name functions
export const sendMessage = (globalState, setGlobalState, text) => {
  axios
    .post(`https://bright-namely-ant.ngrok-free.app/llm_name_extract`, {
      sentence: text,
      // user_id: globalState.userId,
      user_id: "12000test",
      lang: globalState.currentLanguage,
      // lang: "en",
    })
    .then(async (response) => {
      console.log(response.data);
      let name = response.data.name;
      if (name !== "name not there") {
        setGlobalState((prevState) => ({
          ...prevState,
          userName: name,
        }));
      }
    })
    .catch((error) => {
      const errorMessage =
        error.code === "ERR_NETWORK"
          ? "Network error! Please check your connection."
          : "Sorry, there was an error.Please say your name again!";

      console.error("There was an error!", error);
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage: errorMessage,
        },
      }));

      // setLoading(false);
    });
};
export const handleNameSpeaking = (globalState, setGlobalState, base64data) => {
  setGlobalState((prevState) => ({
    ...prevState,
    currentNameData: null,
    componentStates: {
      ...prevState.componentStates,
      getStartedModalStates: {
        ...prevState.componentStates.getStartedModalStates,
        nameProcessingStatus: NameProcessingStatus.STARTED,
        // nameRecordingStatus: NameRecordingStatus.DONE,
      },
    },
  }));
  axios
    .post(`https://bright-namely-ant.ngrok-free.app/speech_to_text`, {
      audio: base64data,
      lang: globalState.currentLanguage,
      // lang: "en",
    })
    .then((response) => {
      const transcript = response.data.transcript;
      console.log(transcript);
      console.log(transcript.length);
      if (transcript.length > 0) {
        // sendMessage(globalState, setGlobalState, transcript);
        setGlobalState((prevState) => ({
          ...prevState,
          userName: transcript,
        }));
      }
    })
    .catch((error) => {
      const errorMessage =
        error.code === "ERR_NETWORK"
          ? "Network error! Please check your connection."
          : "No voice was detected.Try again!";

      console.error("There was an error!", error);
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage: errorMessage,
        },
      }));

      // setLoading(false);
    })
    .finally(() =>
      setGlobalState((prevState) => ({
        ...prevState,
        componentStates: {
          ...prevState.componentStates,
          getStartedModalStates: {
            ...prevState.componentStates.getStartedModalStates,
            nameProcessingStatus: NameProcessingStatus.DONE,
            // nameRecordingStatus: NameRecordingStatus.DONE,
          },
        },
      }))
    );
};

export const addQuestionAnswerToDB = (user_id, question, answer) => {
  axios
    .post(`http://localhost:8000/add_qa_pair_to_db`, {
      user_id,
      query: question,
      answer,
    })
    .then(async (response) => {
      // console.log(response.data);
      let msg = response.data.message;
      console.log(msg);
      // if (name !== "name not there") {
      //   setGlobalState((prevState) => ({
      //     ...prevState,
      //     userName: name,
      //   }));
      // }
    })
    .catch((error) => {
      const errorMessage =
        error.code === "ERR_NETWORK"
          ? "Network error! Please check your connection."
          : "Sorry, there was an error adding qa to db!";

      console.error("There was an error adding qa to db!", error);
      // setGlobalState((prevState) => ({
      //   ...prevState,
      //   notificationStates: {
      //     ...prevState.notificationStates,
      //     showNotification: true,
      //     notificationType: "error",
      //     notificationMessage: errorMessage,
      //   },
      // }));
    });
};

export const submitSurveyToDB = (globalState) => {
  axios
    .post(`http://localhost:8000/add-feedback`, {
      user_id: globalState.userId,
      feedbacks: globalState.componentStates.feedbackStates.allFeedbackStates,
    })
    .then(async (response) => {
      // console.log(response.data);
      let msg = response.data.message;
      console.log(msg);
      // if (name !== "name not there") {
      //   setGlobalState((prevState) => ({
      //     ...prevState,
      //     userName: name,
      //   }));
      // }
    })
    .catch((error) => {
      const errorMessage =
        error.code === "ERR_NETWORK"
          ? "Network error! Please check your connection."
          : "Sorry, there was an error adding survey submission to db!";

      console.error(
        "There was an error adding survey submission to db!",
        error
      );
      // setGlobalState((prevState) => ({
      //   ...prevState,
      //   notificationStates: {
      //     ...prevState.notificationStates,
      //     showNotification: true,
      //     notificationType: "error",
      //     notificationMessage: errorMessage,
      //   },
      // }));
    });
};
