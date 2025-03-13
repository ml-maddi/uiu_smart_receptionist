import { Box, Typography } from "@mui/material";
import TimeDisplay from "./TimeDisplay";
import DateDisplay from "./DateDisplay";
// contexts
import { useContext } from "react";
import { AppStateContext } from "../../../../AppContext";
import { DifferentPages } from "../../../../Constants";
const HeaderBottom = () => {
  const { globalState } = useContext(AppStateContext);
  // currentPage === "welcome" ?
  return (
    <Box
      sx={{
        width:
          globalState.currentPage === DifferentPages.GET_STARTED
            ? "50%"
            : "30%",
      }}
    >
      <TimeDisplay />
      <DateDisplay />
    </Box>
  );
};

export default HeaderBottom;
