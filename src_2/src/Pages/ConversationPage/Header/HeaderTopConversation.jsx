import React from "react";
import { Box, Stack } from "@mui/material";
// assets
import UIULogo1 from "../../../Assets/uiu-logo-1.svg";
import HeaderBottom from "../../GetStartedPage/Header/HeaderBottom/HeaderBottom";
// components

const HeaderTopConversation = () => {
  return (
    <Stack
      direction="row"
      spacing={10}
      alignItems={"center"}
      sx={{
        height: "10rem",
        width: "80%",
      }}
    >
      <img
        style={{ height: "3.8rem" }}
        className="UIU-logo"
        alt="Uiu logo"
        src={UIULogo1}
      />
      <HeaderBottom />
    </Stack>
  );
};

export default HeaderTopConversation;
