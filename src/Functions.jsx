import axios from "axios";

function countSpacesUsingIteration(str) {
  let count = 0;
  for (let char of str) {
      if (char === ' ') {
          count++;
      }
  }
  return count;
}


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
export const updateRatingSpecificPage = (setGlobalState, value) => {
  setGlobalState((prevState) => {
    const currentIndex =
      prevState.componentStates.feedbackStates.currentFeedbackItem;

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
        console.error("There was an error!", error);
        setGlobalState((prevState) => ({
          ...prevState,
          notificationStates: {
            ...prevState.notificationStates,
            showNotification: true,
            notificationType: "error",
            notificationMessage: "No voice was detected.Try again!",
            processingAudio: false,
          },
        }));
        // setLoading(false);
      });
  } catch (error) {
    console.error("There was an error!", error);
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: "No voice was detected.Try again!",
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
  toggleFeedbackPage(setGlobalState);
  saveToFile(globalState);
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

const QuestionAnswering = async (
  globalState,
  setGlobalState,
  audioRef,
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
          // user_id: globalState.userId,
          user_id: "12000test",
          query: text,
          query_answer_list: globalState.messages,
        }),
      }
    );

    if (!res.ok) {
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage: "Failed to fetch response from API!",
        },
      }));
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

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      const chunk = decoder.decode(value, { stream: true });

      // Extract only 'content' values from the chunk and update the response
      const contentMatches = [...chunk.matchAll(/content='(.*?)'/g)];
      contentMatches.forEach((match) => {
        const content = match[1];
        botResponseText += content; // Append content to bot response text
        console.log(content ,countSpacesUsingIteration(botResponseText))
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
      });
    }

    // Handle text-to-speech after the streaming response is fully received
    try {
      const audioResponse = await axios.post(
        `https://bright-namely-ant.ngrok-free.app/text_to_speech/`,
        { text: botResponseText, lang: globalState.currentLanguage },
        { responseType: "blob" }
      );

      const audioUrl = URL.createObjectURL(
        new Blob([audioResponse.data], { type: "audio/wav" })
      );
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
    } catch (error) {
      console.error("Error converting text to speech:", error);
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage: "Error converting text to speech",
        },
      }));
    }
  } catch (error) {
    console.error("There was an error!", error);
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage:
          "Sorry, there was an error processing your request. Try again!",
      },
    }));
  }
};

export const QuestionAsking = (
  globalState,
  setGlobalState,
  audioRef,
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
          setGlobalState((prevState) => ({
            ...prevState,
            notificationStates: {
              ...prevState.notificationStates,
              showNotification: true,
              notificationType: "error",
              notificationMessage: "No voice was detected.Try again!",
            },
          }));
          return;
        }

        if (globalState.currentLanguage == "bn") {
          if (containsBangla(transcript) === false) {
            console.log("zero");
            setGlobalState((prevState) => ({
              ...prevState,
              notificationStates: {
                ...prevState.notificationStates,
                showNotification: true,
                notificationType: "error",
                notificationMessage: "No voice was detected.Try again!",
              },
            }));
          } else {
            if (globalState.currentPage === "GetStarted") {
              setTimeout(() => {
                navigate("/conversation");
              }, 500); // 2000ms = 2 seconds
            }
            setGlobalState((prevState) => ({
              ...prevState,
              currentQuestionData: "",
            }));

            QuestionAnswering(
              globalState,
              setGlobalState,
              audioRef,
              transcript
            );
            console.log(transcript);
          }
        } else {
          if (globalState.currentPage === "GetStarted") {
            setTimeout(() => {
              navigate("/conversation");
            }, 500); // 2000ms = 2 seconds
          }
          setGlobalState((prevState) => ({
            ...prevState,
            currentQuestionData: "",
          }));

          QuestionAnswering(globalState, setGlobalState, audioRef, transcript);
          console.log(transcript);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setGlobalState((prevState) => ({
          ...prevState,
          notificationStates: {
            ...prevState.notificationStates,
            showNotification: true,
            notificationType: "error",
            notificationMessage: "No voice was detected.Try again!",
          },
        }));

        // setLoading(false);
      });
  } catch (error) {
    console.error("There was an error!", error);
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: "No voice was detected.Try again!",
      },
    }));
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
  await setUserName(setGlobalState, userId);
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
export const handleStartBtnClick = (setGlobalState) => {
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
export const isFaceDetectedContinuous = async (imgData, setGlobalState) => {
  try {
    const base64data = imgData.split(",")[1];
    const response = await axios.post(`http://localhost:8000/face_detect`, {
      image: base64data,
    });

    console.log("Response:", response.data.message);

    const noface = "no face";
    let msg = response.data.message;
    if (msg.includes(noface)) {
      console.log("face not detected");
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage: "Sorry, face not detected!",
        },
      }));
      return false;
    }
    console.log("face detected");
    setGlobalState((prevState) => ({
      ...prevState,
      userInFront: true,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "success",
        notificationMessage: "face detected!",
      },
    }));
    return true;
  } catch (error) {
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: "Sorry, Error detecting face!",
      },
    }));
    console.error("Error detecting face:", error);
    return false; // Consider returning false if there's an error
  }
};

export const isFaceDetected = async (globalState, setGlobalState) => {
  try {
    const base64data = globalState.currentImageData.split(",")[1];
    const response = await axios.post(`http://localhost:8000/face_detect`, {
      image: base64data,
    });

    console.log("Response:", response.data.message);

    const noface = "no face";
    let msg = response.data.message;
    if (msg.includes(noface)) {
      console.log("face not detected");
      setGlobalState((prevState) => ({
        ...prevState,
        currentImageData: null,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage: "Sorry, face not detected!",
        },
      }));
      return false;
    }
    console.log("face detected");
    setGlobalState((prevState) => ({
      ...prevState,

      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "success",
        notificationMessage: "face detected!",
      },
    }));
    return true;
  } catch (error) {
    setGlobalState((prevState) => ({
      ...prevState,
      currentImageData: null,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: "Sorry, Error detecting face!",
      },
    }));
    console.error("Error detecting face:", error);
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
    const base64data = globalState.currentImageData.split(",")[1];
    const response = await axios.post(
      `http://localhost:8000/face_recognition`,
      {
        image: base64data,
      }
    );

    console.log("Response:", response.data);

    if (response.data.user_id === null) {
      return null;
    } else {
      // Update the global state
      setGlobalState((prevState) => ({
        ...prevState,
        showNotification: true,
        notificationType: "success",
        notificationMessage: response.data.message,
        userId: response.data.user_id,
      }));

      // Return user ID for further processing
      return response.data.user_id;
    }
  } catch (error) {
    console.error("There was an error!", error);

    // Update global state with error notification
    setGlobalState((prevState) => ({
      ...prevState,
      showNotification: true,
      notificationType: "error",
      notificationMessage:
        "Sorry, There was an error in face recognition. Try Again!",
      currentImageData: null,
    }));

    // Return null to indicate failure
    return null;
  }
};

export const createUserUsingFace = async (globalState, setGlobalState) => {
  try {
    const base64data = globalState.currentImageData.split(",")[1];
    const response = await axios.post(
      `http://localhost:8000/create_user_face`,
      {
        image: base64data,
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
    console.error("There was an error!", error);

    // Update global state with error notification
    setGlobalState((prevState) => ({
      ...prevState,
      currentImageData: null,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: "Sorry, Error in creating user. Try Again!",
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
      let bn_name = response.data.bn;
      let en_name = response.data.en;
      if (bn_name !== "name not there") {
        setGlobalState((prevState) => ({
          ...prevState,
          userName: bn_name,
          userNameEn: en_name,
        }));
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage:
            "Sorry, there was an error.Please say your name again!",
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
      let bn_name = response.data.bn;
      let en_name = response.data.en;
      if (bn_name !== "name not there") {
        setGlobalState((prevState) => ({
          ...prevState,
          userName: bn_name,
          userNameEn: en_name,
        }));
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
      setGlobalState((prevState) => ({
        ...prevState,
        notificationStates: {
          ...prevState.notificationStates,
          showNotification: true,
          notificationType: "error",
          notificationMessage:
            "Sorry, there was an error.Please say your name again!",
        },
      }));

      // setLoading(false);
    });
};
export const handleNameSpeaking = (globalState, setGlobalState, base64data) => {
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
          sendMessage(globalState, setGlobalState, transcript);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setGlobalState((prevState) => ({
          ...prevState,
          notificationStates: {
            ...prevState.notificationStates,
            showNotification: true,
            notificationType: "error",
            notificationMessage: "No voice was detected.Try again!",
          },
        }));

        // setLoading(false);
      });
  } catch (error) {
    console.error("There was an error!", error);
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
        notificationType: "error",
        notificationMessage: "No voice was detected.Try again!",
      },
    }));
  } finally {
    setGlobalState((prevState) => ({
      ...prevState,
      componentStates: {
        ...prevState.componentStates,
        getStartedModalStates: {
          ...prevState.componentStates.getStartedModalStates,
          nameAudioProcessing: false,
        },
      },
    }));
  }
};
