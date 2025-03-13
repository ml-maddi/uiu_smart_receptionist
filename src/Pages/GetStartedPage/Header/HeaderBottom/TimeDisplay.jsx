import { Box, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";

// constants
import { banglaDigits, DifferentPages } from "../../../../Constants";

// contexts
import { AppStateContext } from "../../../../AppContext";

// Helper function to convert English numerals to Bangla
const convertToBanglaNumerals = (englishNumber) => {
  return englishNumber.replace(/\d/g, (digit) => banglaDigits[digit]);
};

const TimeDisplay = () => {
  const { globalState } = useContext(AppStateContext);
  // currentPage === "welcome" ?

  const [time, setTime] = useState({
    hoursMinutes: "",
    period: "",
  });

  useEffect(() => {
    const updateTime = () => {
      const currentTime = new Date();
      let hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const period =
        hours >= 12
          ? globalState.currentLanguage === "en"
            ? "pm"
            : "অপরাহ্ণ"
          : globalState.currentLanguage === "en"
          ? "am"
          : "পূর্বাহ্ণ";

      hours = hours % 12 || 12; // Convert 24-hour to 12-hour format, keeping 12 as 12 instead of 0.
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      let hoursMinutes = `${hours}:${formattedMinutes}`;

      // If language is Bangla, convert the numerals
      if (globalState.currentLanguage === "bn") {
        hoursMinutes = convertToBanglaNumerals(hoursMinutes);
      }

      setTime({
        hoursMinutes: hoursMinutes,
        period: period,
      });
    };

    // Initial call to set the time
    updateTime();

    // Update time every second
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [globalState.currentLanguage]);

  return (
    <Box sx={{ display: "flex", alignItems: "baseline" }}>
      <Typography
        variant={
          globalState.currentPage === DifferentPages.GET_STARTED ? "h2" : "h3"
        }
        sx={{ mr: 1, color: "#eb8908", fontWeight: 600 }}
      >
        {time.hoursMinutes}
      </Typography>
      <Typography
        variant={
          globalState.currentPage === DifferentPages.GET_STARTED ? "h3" : "h4"
        }
        sx={{ color: "#000000de" }}
      >
        {time.period}
      </Typography>
    </Box>
  );
};

export default TimeDisplay;
