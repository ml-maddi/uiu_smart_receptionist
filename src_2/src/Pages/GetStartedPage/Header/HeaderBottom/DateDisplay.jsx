import React, { useState, useEffect, useContext } from "react";
import { Box, Typography } from "@mui/material";

// constants
import { banglaDays, banglaMonths, banglaDigits } from "../../../../Constants";

// contexts
import { AppStateContext } from "../../../../AppContext";

// Helper function to convert English numerals to Bangla
const convertToBanglaNumerals = (englishNumber) => {
  return englishNumber.replace(/\d/g, (digit) => banglaDigits[digit]);
};

// Helper function to map English day and month names to Bangla
const convertToBanglaDate = (day, month) => {
  return {
    day: banglaDays[day] || day,
    month: banglaMonths[month] || month,
  };
};

const DateDisplay = () => {
  const { globalState } = useContext(AppStateContext);

  // currentPage === "welcome" ?

  const [dateInfo, setDateInfo] = useState({
    day: "",
    date: "",
  });

  useEffect(() => {
    const updateDate = () => {
      const options = {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        day: "numeric",
        month: "long",
      };
      const currentDate = new Date().toLocaleDateString("en-US", options);

      // Split the date string into day and date part
      const [day, monthDay] = currentDate.split(", ");

      // Further split the monthDay to get month and day
      const [month, dayOfMonth] = monthDay.split(" ");

      let displayDay = day;
      let displayDate = `${dayOfMonth} ${month}`;

      // If the language is Bangla, convert both day and date to Bangla
      if (globalState.currentLanguage === "bn") {
        const banglaDate = convertToBanglaDate(day, month);
        displayDay = banglaDate.day;
        displayDate = ` ${convertToBanglaNumerals(dayOfMonth)} ${
          banglaDate.month
        }`;
      }

      setDateInfo({
        day: displayDay,
        date: displayDate,
      });
    };

    // Initial call to set the date
    updateDate();
  }, [globalState.currentLanguage]);

  return (
    <Box sx={{ display: "flex", alignItems: "baseline" }}>
      <Typography
        variant={globalState.currentPage === "GetStarted" ? "h5" : "h6"}
        sx={{
          color: globalState.currentPage === "GetStarted" ? "#000000a6" : null,
        }}
      >
        {dateInfo.day}
      </Typography>
      <Typography
        variant={globalState.currentPage === "GetStarted" ? "h5" : "h6"}
        sx={{
          color: globalState.currentPage === "GetStarted" ? "#000000a6" : null,
        }}
      >
        , {dateInfo.date}
      </Typography>
    </Box>
  );
};

export default DateDisplay;
