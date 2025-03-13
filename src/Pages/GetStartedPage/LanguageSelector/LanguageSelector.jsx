/**
 * This componenet is used to show the language selector items.
 */

import { Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";

//styles
import "./LanguageSelector.css";
import { AppStateContext } from "../../../AppContext";

const LanguageSelector = ({
  marginTop = "58%",
  boxWidth = "25%",
  marginLeft = "3rem",
}) => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  return (
    <Box
      bgcolor="gray"
      position="relative"
      sx={{
        mt: marginTop,
        width: boxWidth,
        px: 3,
        py: 3,
        height: "2rem",
        // bgcolor: "orange",
        borderRadius: "1rem",
        ml: marginLeft,
        display: "flex",
        alignItems: "center",
        WebkitBackdropFilter: "blur(12px) brightness(100%)",
        backdropFilter: "blur(12px) brightness(100%)",
        bgcolor: "#ffffff80",
        border: "2px solid  #ffffff",
      }}
    >
      <div
        className={`slider ${
          globalState.currentLanguage === null ||
          globalState.currentLanguage === "bn"
            ? "slider-en"
            : "slider-bn"
        }`}
      />
      <Stack
        direction="row"
        spacing={6}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Box
          className={`${globalState.currentLanguage === "bn" ? "active" : ""}`}
          onClick={() => {
            setGlobalState((prevState) => ({
              ...prevState,
              currentLanguage: "bn",
            }));
          }}
          sx={{ py: 2, px: 2, cursor: "pointer" }}
        >
          <Typography
            sx={{
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            বাংলা
          </Typography>
        </Box>
        <Box
          className={`${globalState.currentLanguage === "en" ? "active" : ""}`}
          onClick={() => {
            setGlobalState((prevState) => ({
              ...prevState,
              currentLanguage: "en",
            }));
          }}
          sx={{ py: 2, px: 2, cursor: "pointer" }}
        >
          <Typography
            sx={{
              fontSize: 25,
              // fontWeight: "400",
              fontWeight: "bold",
            }}
          >
            English
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default LanguageSelector;
