/**
 * This componenet is used to show a text ,if user voice is getting recording or not
 */

import { Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import waveImg from "../../Assets/wave.gif";

// constants
import { translations } from "../../Constants";
import { AppStateContext } from "../../AppContext";

const ListeningIntro = () => {
  const { globalState } = useContext(AppStateContext);
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography
        variant="h3"
        fontWeight="600"
        // fontSize={30}
        // textAlign="center"
      >
        {translations[globalState.currentLanguage].listening}
      </Typography>
    </Box>
  );
};

export default ListeningIntro;
