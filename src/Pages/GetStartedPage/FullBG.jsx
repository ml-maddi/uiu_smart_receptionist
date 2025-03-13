/**
 * This componenet is used to show the custom bg shape image
 */
import React from "react";
// assets

import bgGradient from "../../Assets/orange-noisy-gradient.png";
const FullBG = () => {
  return (
    // <Box position="relative" height="100%" width="100%" top={0} left={0}>
    <img
      style={{
        position: "absolute",
        //   right: "1.5rem",
        // height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        objectFit: "contain",
      }}
      src={bgGradient}
    />
    // </Box>
  );
};

export default FullBG;
