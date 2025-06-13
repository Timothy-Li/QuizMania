import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { googleSignIn, setGuestUser } = authContext;

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setError(null);
    const { error } = await googleSignIn();
    setLoadingGoogle(false);
    if (error) {
      setError("Google login failed. Please try again.");
      console.error(error);
    }
  };

  // guest login handler
  const handleGuestLogin = () => {
    const guestUser = {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      name: "Guest" + Math.floor(Math.random() * 10000),
      isGuest: true,
    };
    setGuestUser(guestUser);
    navigate("/home");
  };

  return (
    <div className="login-page">
      <h2>Welcome to QuizMania!</h2>
      <p>Sign in to start playing!</p>
      {error && <p className="error">{error}</p>}
      <div className="login-buttons">
        <button
          onClick={handleGoogleSignIn}
          disabled={loadingGoogle}
          className="google-btn"
          aria-label="Sign in with Google"
        >
          {loadingGoogle ? "Logging in..." : "Sign in with Google"}
        </button>
        <button
          onClick={handleGuestLogin}
          disabled={loadingGoogle}
          className="guest-btn"
          aria-label="Continue as Guest"
          style={{ marginTop: "1rem" }}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
