import React, { Component } from "react";
import Menu from "@mui/material/Menu";
import { Box, Typography } from "@mui/material";
// assets
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom/HeaderBottom";

const Header = () => {
  return (
    <Box
      sx={{
        height: "24rem",
        width: "85%",
        // my: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        // gap: 4,
        px: 4,
        py: 3,
        bgcolor: "#ffffffe6",
        // bgcolor: "#ddd",
        mx: "auto",
        // mt: "2rem",

        borderRadius: "2rem",
        // border: "2px solid grey",
      }}
    >
      <HeaderTop />
      <HeaderBottom />
    </Box>
  );
};

export default Header;
