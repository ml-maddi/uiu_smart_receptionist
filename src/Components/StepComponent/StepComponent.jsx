/**
 * This componenet is used to show either the face or name input components.
 */
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { AppStateContext } from "../../AppContext";
import FaceComponent from "./FaceComponent";
import NameComponent from "./NameComponent";

const BoxStyle = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  mx: "auto",

  width: "80%",
  height: "40%",
  display: "flex",
  alignSelf: "center",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StepComponent = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);

  const handleClose = () => {
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

  return (
    <Modal
      open={globalState.componentStates.getStartedModalStates.openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          mx: "auto",
          mt: "8rem",
          width: "76%",
          height: "60%",
          borderRadius: "4rem",

          bgcolor: "rgba(0,0,0, 0.8)",
          border: "2px solid #f7931e",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {globalState.componentStates.getStartedModalStates.currentStep == 1 ? (
          <FaceComponent />
        ) : (
          <NameComponent />
        )}
      </Box>
    </Modal>
  );
};

export default StepComponent;
