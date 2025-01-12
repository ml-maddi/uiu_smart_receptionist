import { Box, Modal, Paper, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { AppStateContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import { initState } from "../Constants";
const ShowThankYou = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const navigate = useNavigate();

  // after 2s of showing thank you , goes back to Get Started page, with user setting as logged out
  useEffect(() => {
    if (globalState.pageStates.ConversationStates.showThankYou === true) {
      setTimeout(() => {
        setGlobalState((prevState) => ({
          ...initState,
        }));
        navigate("/getStart");
      }, 2000);
    }
  }, [globalState.pageStates.ConversationStates.showThankYou]);
  return (
    <Modal open={globalState.pageStates.ConversationStates.showThankYou}>
      <Paper
        // width="50rem"
        // height="60%"
        sx={{
          mt: "40%",
          mx: "auto",
          width: "80%",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "2rem",
        }}
      >
        <VerifiedIcon color="warning" sx={{ fontSize: "8rem" }} />
        <Typography variant="h3" sx={{ fontWeight: "bold", mt: "2rem" }}>
          Thanks for Your Feedback!
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "200", mt: "2rem" }}>
          We truly value your input and support.Your feedback
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "200" }}>
          helps us improve and serve you better!
        </Typography>
      </Paper>
    </Modal>
  );
};

export default ShowThankYou;
