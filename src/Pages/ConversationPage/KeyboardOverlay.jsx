import React, { useContext, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { AppStateContext } from "../../AppContext";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./styles.css";

// Import keyboard layouts
import englishLayout from "simple-keyboard-layouts/build/layouts/english";
import bengaliLayout from "simple-keyboard-layouts/build/layouts/bengali";

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

const KeyboardOverlay = ({ updateQuestion }) => {
  const [layout, setLayout] = useState("default");
  const [keyboardLayout, setKeyboardLayout] = useState(englishLayout);

  const { globalState, setGlobalState } = useContext(AppStateContext);

  useEffect(() => {
    // Update keyboard layout when the language changes
    setKeyboardLayout(
      globalState.currentLanguage === "bn" ? bengaliLayout : englishLayout
    );
  }, [globalState.currentLanguage]);

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    const currentLayout = layout;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";
    setLayout(shiftToggle);
  };
  const handleClickOpen = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      pageStates: {
        ...prevState.pageStates,
        ConversationStates: {
          ...prevState.pageStates.ConversationStates,
          showKeyboard: true,
        },
      },
    }));
    globalState.keyboardRef.current.setInput(globalState.currentQuestionText);
  };

  const handleClose = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      pageStates: {
        ...prevState.pageStates,
        ConversationStates: {
          ...prevState.pageStates.ConversationStates,
          showKeyboard: false,
        },
      },
    }));
  };

  return (
    <Dialog
      open={globalState.pageStates.ConversationStates.showKeyboard}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Subscribe
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Keyboard
            keyboardRef={(r) =>
              (globalState.pageStates.ConversationStates.keyboardRef.current =
                r)
            }
            layoutName={layout}
            // onChangeAll={onChangeAll}
            onChange={updateQuestion}
            onKeyPress={onKeyPress}
            {...keyboardLayout}
          />
        </DialogContentText>
      </DialogContent>
      {/* <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default KeyboardOverlay;
