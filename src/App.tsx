import { Route, Routes, Navigate } from "react-router-dom";
import Lobby from "./Pages/QuizLobbyPage/Lobby";
import QuizPage from "./Pages/QuizPage/QuizPage";
import EndPage from "./Pages/EndPage/EndPage";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import QuizPageMulti from "./Pages/QuizPageMulti/QuizPageMulti";
import { Analytics } from "@vercel/analytics/react";
import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";

function App() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  // Get both session and guestUser from your AuthContext
  const { session, guestUser } = authContext;

  // Consider authenticated if session OR guestUser exists
  const isAuthenticated = !!session || !!guestUser;

  return (
    <>
      <Analytics />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" />}
        />
        <Route
          path="/quiz-lobby"
          element={isAuthenticated ? <Lobby /> : <Navigate to="/" />}
        />
        <Route
          path="/quiz"
          element={isAuthenticated ? <QuizPage /> : <Navigate to="/" />}
        />
        <Route
          path="/quiz-multi"
          element={isAuthenticated ? <QuizPageMulti /> : <Navigate to="/" />}
        />
        <Route
          path="/end"
          element={isAuthenticated ? <EndPage /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
