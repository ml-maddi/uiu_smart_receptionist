import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "animate.css";
// global state
import { AppStateProvider } from "./AppContext";
// pages
import GetStartedPage from "./Pages/GetStartedPage/GetStartedPage";
import StartPage from "./Pages/StartPage";
import ConversationPage from "./Pages/ConversationPage/ConversationPage";
import ShowThankYou from "./Components/ShowThankYou";
import ListeningOverlay from "./Pages/ConversationPage/ListeningOverlay";
import Ratings from "./Pages/FeedbackPage/Ratings";
import FeedbackPage from "./Pages/FeedbackPage/FeedbackPage";
import IncrementalTextSplitter from "./Components/Test1";
import AudioPlayer from "./Components/Test2";

function App() {
  return (
    <AppStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/getStart" element={<GetStartedPage />} />

          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/thanks" element={<ShowThankYou />} />
          <Route path="/test" element={<IncrementalTextSplitter />} />
          <Route path="/test-audio" element={<AudioPlayer />} />
        </Routes>
      </Router>
    </AppStateProvider>
  );
}

export default App;
