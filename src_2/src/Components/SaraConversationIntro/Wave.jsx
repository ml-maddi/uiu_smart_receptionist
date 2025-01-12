/**
 * This componenet is used to show the wavy animated gif.
 */
import React from "react";
import waveImg from "../../Assets/wave.gif";
import { Box } from "@mui/material";
const Wave = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      height="15rem"
      // mt="-3rem"
      bgcolor="white"
      py={1}
      // overflow="hidden"
    >
      <img
        alt="wave animation"
        src={waveImg}
        style={{
          objectFit: "cover",
          width: "70%",
          mixBlendMode: "exclusion",
        }}
      />
    </Box>
  );
};

export default Wave;
