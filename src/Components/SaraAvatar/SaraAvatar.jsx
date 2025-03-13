/**
 * This component is used to show Sara video avatar on pages.
 */

import { Box } from "@mui/material";

// assets
import avatarVideo from "../../Assets/sara_avatar_idle.mp4";
import union from "../../Assets/Union.png";
import vec1 from "../../Assets/vector-7164.svg";
// contexts
import { useContext } from "react";
import { AppStateContext } from "../../AppContext";
import { DifferentPages } from "../../Constants";

const SaraAvatar = () => {
  const { globalState } = useContext(AppStateContext);

  return (
    <Box
      sx={{
        position: "absolute",
        height: "80%",
        top:
          globalState.currentPage === DifferentPages.GET_STARTED ? "15rem" : 0,
        width: "100%",
        transition:
          globalState.currentPage === DifferentPages.CONVERSATION
            ? "top 0.8s ease, left 0.8s ease"
            : null,
      }}
    >
      <Box position="relative" height="100%" width="100%">
        <img
          style={{
            position: "absolute",
            right: "3rem",
            width:
              globalState.currentPage === DifferentPages.GET_STARTED
                ? "85%"
                : "42%",
            top:
              globalState.currentPage === DifferentPages.GET_STARTED
                ? "30%"
                : "18rem",
          }}
          src={
            globalState.currentPage === DifferentPages.GET_STARTED
              ? union
              : vec1
          }
        />

        <video
          style={{
            position: "absolute",
            right: "3rem",
            height:
              globalState.currentPage === DifferentPages.GET_STARTED
                ? "70%"
                : "35%",
            top:
              globalState.currentPage === DifferentPages.GET_STARTED
                ? null
                : "5rem",
          }}
          src={avatarVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </Box>
    </Box>
  );
};

export default SaraAvatar;
