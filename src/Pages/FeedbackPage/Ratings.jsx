import React, { useContext } from "react";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import { AppStateContext } from "../../AppContext";
import { updateRatingSpecificPage } from "../../Functions";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
  "& .MuiRating-iconEmpty .MuiTypography-root.MuiTypography-body1": {
    color: theme.palette.action.disabled,
  },
}));

const labelColors = ["red", "red", "orange", "green", "green"];
const customIcons = {
  1: {
    icon: (
      <SentimentVeryDissatisfiedIcon
        sx={{ fontSize: "3.5rem" }}
        color="error"
      />
    ),
    label: "Very Dissatisfied",
  },
  2: {
    icon: (
      <SentimentDissatisfiedIcon sx={{ fontSize: "3.5rem" }} color="error" />
    ),
    label: "Dissatisfied",
  },
  3: {
    icon: (
      <SentimentSatisfiedIcon sx={{ fontSize: "3.5rem" }} color="warning" />
    ),
    label: "Neutral",
  },
  4: {
    icon: (
      <SentimentSatisfiedAltIcon sx={{ fontSize: "3.5rem" }} color="success" />
    ),
    label: "Satisfied",
  },
  5: {
    icon: (
      <SentimentVerySatisfiedIcon sx={{ fontSize: "3.5rem" }} color="success" />
    ),
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return (
    <Box
      {...other}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        // mb: "1.5rem",
        // mx: "2rem",
        // mt: "2rem",
        p: "1rem",
      }}
    >
      {customIcons[value].icon}
      <Typography
        sx={{
          fontSize: "1.2rem",
          textAlign: "center",
          color: labelColors[value - 1],

          // color: "darkgray",
        }}
      >
        {customIcons[value].label}
      </Typography>
    </Box>
  );
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const Ratings = ({ index }) => {
  const { globalState, setGlobalState } = useContext(AppStateContext);
  // const [value, setValue] = React.useState(5);
  return (
    <StyledRating
      name="highlight-selected-only"
      value={
        globalState.componentStates.feedbackStates.allFeedbackStates[index]
          .emojiRating
      }
      // value={curValue}
      onChange={(event, newValue) => {
        // setValue(newValue);
        updateRatingSpecificPage(setGlobalState, newValue, index);
      }}
      IconContainerComponent={IconContainer}
      getLabelText={(value) => customIcons[value].label}
      highlightSelectedOnly
    />
  );
};

export default Ratings;
