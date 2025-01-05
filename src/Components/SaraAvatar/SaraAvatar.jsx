/**
 * This componenet is used to show sara image avatar on pages .
 */

import { Box } from "@mui/material";

// assets
import avatar from "../../Assets/avatar.png";
// import union from "../../Assets/union.svg";
import union from "../../Assets/Union.png";
import vec1 from "../../Assets/vector-7164.svg";
// contexts
import { useContext } from "react";
import { AppStateContext } from "../../AppContext";
const SaraAvatar = () => {
  // const { currentPage } = useContext(CurrentPageContext);
  const { globalState } = useContext(AppStateContext);

  return (
    <Box
      sx={{
        position: "absolute",
        height: "80%",
        // bgcolor: "#333",
        top: globalState.currentPage === "GetStarted" ? "15rem" : 0,

        width: "100%",
        // transform:
        //   globalState.currentPage === "conversation"
        //     ? "translate(0.6rem,0)"
        //     : null,
        transition:
          globalState.currentPage === "conversation"
            ? "top 0.8s ease, left 0.8s ease "
            : null, // Animate on load
      }}
    >
      <Box position="relative" height="100%" width="100%">
        <img
          style={{
            position: "absolute",
            right: "3rem",

            // height: globalState.currentPage === "GetStarted" ? "60%" : "30%",
            // objectFit: "contain",
            width: globalState.currentPage === "GetStarted" ? "85%" : "42%",
            top: globalState.currentPage === "GetStarted" ? "30%" : "18rem",
          }}
          src={globalState.currentPage === "GetStarted" ? union : vec1}
        />

        {/* sets different positioning based on which page its getting showed */}
        <img
          style={{
            position: "absolute",
            right: "3rem",
            height: globalState.currentPage === "GetStarted" ? "70%" : "35%",
            top: globalState.currentPage === "GetStarted" ? null : "5rem",
          }}
          src={avatar}
        />
      </Box>
      {/* hello */}
    </Box>
  );
};

export default SaraAvatar;
