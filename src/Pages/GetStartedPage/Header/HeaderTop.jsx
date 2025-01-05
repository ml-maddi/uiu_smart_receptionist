// import React from "react";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
// assets
import UIULogo1 from "../../../Assets/uiu-logo-1.svg";

const HeaderTop = () => {
  const navigate = useNavigate();

  const handleGoToConversationPage = () => {
    navigate("/conversation");
  };
  return (
    <Box
      sx={{
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        // bgcolor: "ButtonFace",
        width: 1,
      }}
    >
      <img
        style={{ height: "6rem" }}
        className="UIU-logo"
        alt="Uiu logo"
        src={UIULogo1}
      />
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleGoToConversationPage}
      >
        <MenuIcon sx={{ fontSize: 60 }} />
      </IconButton>
    </Box>
  );
};

export default HeaderTop;
