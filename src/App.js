import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// global state
import { AppStateProvider } from "./AppContext";
// pages
import GetStartedPage from "./Pages/GetStartedPage/GetStartedPage";
import StartPage from "./Pages/StartPage";
import ConversationPage from "./Pages/ConversationPage/ConversationPage";
import ShowThankYou from "./Components/ShowThankYou";

function App() {
  return (
    <AppStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/getStart" element={<GetStartedPage />} />

          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/thanks" element={<ShowThankYou />} />
        </Routes>
      </Router>
    </AppStateProvider>
  );
}

export default App;
