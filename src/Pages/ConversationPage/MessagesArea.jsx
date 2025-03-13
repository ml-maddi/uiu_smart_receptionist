import { Box } from "@mui/material";
import { useContext } from "react";
import Fab from "@mui/material/Fab";
import fancyBg2 from "../../Assets/body2.svg";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined"; // contexts
import Messages from "../ConversationPage/Messages/Messages";
import UserMsgItem from "../ConversationPage/Messages/MsgItem";

import Mic2 from "./Mic2";
import { AppStateContext } from "../../AppContext";
import { toggleFeedbackPage } from "../../Functions";
import { translations } from "../../Constants";

const fabStyle = {
  position: "absolute",
  bottom: 50,
  right: 30,
  fontSize: "2rem",
  bgcolor: "orange",
  fontWeight: "bold",
};

const MessagesArea = () => {
  const { globalState, setGlobalState } = useContext(AppStateContext);

  console.log(globalState.messages);

  return (
    <Box
      sx={{
        width: "85%",
        height: "85rem",
        mx: "auto",
        mt: "1.5rem",
        px: 4,
        py: 3,
        borderRadius: "2rem",
        position: "relative",
        overflow: "hidden",
        transition: "height 0.3s ease", // Add smooth animation here
      }}
    >
      <Fab
        variant="extended"
        size="large"
        sx={{ ...fabStyle, p: "2rem" }}
        onClick={() => toggleFeedbackPage(setGlobalState)}
      >
        <TaskAltOutlinedIcon
          sx={{
            mr: 1,
            fontSize: "3rem",

            fontWeight: "bold",
          }}
        />
        {translations[globalState.currentLanguage].surveyBtnText}
      </Fab>
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
        }}
      >
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
          }}
          src={fancyBg2}
        />
      </Box>

      <Box position="absolute">
        <Mic2 />
      </Box>

      <Messages />
    </Box>
  );
};

export default MessagesArea;
