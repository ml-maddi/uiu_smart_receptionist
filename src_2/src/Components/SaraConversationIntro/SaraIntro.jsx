/**
 * This componenet is used to show welcome message at the bottom area for the Get Started page.
 */

import { Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import waveImg from "../../Assets/wave.gif";

// constants
import { translations } from "../../Constants";
import { AppStateContext } from "../../AppContext";

const SaraIntro = () => {
  const { globalState } = useContext(AppStateContext);
  return (
    <Stack
      direction="column"
      spacing="2"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography
        variant="h4"
        fontWeight="600"
        // fontSize={30}
        // textAlign="center"
      >
        {translations[globalState.currentLanguage].welcome1}
      </Typography>
      <Typography variant="h4" fontWeight="600">
        {translations[globalState.currentLanguage].welcome2}
      </Typography>
    </Stack>
  );
};

export default SaraIntro;
