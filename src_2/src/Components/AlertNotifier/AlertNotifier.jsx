/**
 * This componenet is used to show notification in pages.
 * display position is at the top-right corner.
 * using props we set the notification type whether its warning,success,error etc. type
 * states comes from a global state context
 */

import { useContext } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Box } from "@mui/material";
import { AppStateContext } from "../../AppContext";

// default showing time is for 3 seconds
const AlertNotifier = ({ time = 3000 }) => {
  const { globalState, setGlobalState } = useContext(AppStateContext);

  // shows the alert notifier
  const handleClick = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: true,
      },
    }));

    // setGlobalState({ ...globalState, showNotification: true });
  };

  // closes the alert notifier
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setGlobalState((prevState) => ({
      ...prevState,
      notificationStates: {
        ...prevState.notificationStates,
        showNotification: false,
      },
    }));
    // setGlobalState({ ...globalState, showNotification: false });
  };

  return (
    <Snackbar
      // sx={{ height: "15rem" }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={globalState.notificationStates.showNotification}
      autoHideDuration={time}
      onClose={handleClose}
      key={"top" + "right"}
    >
      <Alert
        onClose={handleClose}
        severity={globalState.notificationStates.notificationType}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {globalState.notificationStates.notificationMessage}
      </Alert>
    </Snackbar>
  );
};
export default AlertNotifier;
