import { Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
// constants
import { initState, translations } from "../../../Constants";

// contexts
import { useContext } from "react";
import { AppStateContext } from "../../../AppContext";

const HeaderReturnConversation = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  const navigate = useNavigate();

  const handleGoToWelcomePage = () => {
    setGlobalState(initState);

    navigate("/getStart");
  };
  return (
    <Stack
      direction="row"
      spacing={4}
      alignItems={"center"}
      ml="1rem"
      sx={{
        height: "10rem",
        width: "85%",
        // background:
        //   "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <IconButton onClick={handleGoToWelcomePage}>
        <KeyboardBackspaceIcon sx={{ fontSize: 50, color: "black" }} />
      </IconButton>

      <Typography variant="h4" fontWeight="bold">
        {translations[globalState.currentLanguage].conversationTitle}
      </Typography>
    </Stack>
  );
};

export default HeaderReturnConversation;
