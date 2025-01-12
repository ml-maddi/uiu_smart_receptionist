import { Box, Typography } from "@mui/material";
import TimeDisplay from "./TimeDisplay";
import DateDisplay from "./DateDisplay";
// contexts
import { useContext } from "react";
import { AppStateContext } from "../../../../AppContext";
const HeaderBottom = () => {
  const { globalState } = useContext(AppStateContext);
  // currentPage === "welcome" ?
  return (
    <Box
      sx={{ width: globalState.currentPage === "GetStarted" ? "50%" : "30%" }}
    >
      <TimeDisplay />
      <DateDisplay />
    </Box>
  );
};

export default HeaderBottom;
