import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";

export interface GuestUser {
  id: string;
  name: string;
  isGuest: true;
}

interface AuthContextType {
  session: Session | null;
  guestUser: GuestUser | null;
  googleSignIn: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  setGuestUser: (guestUser: GuestUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        if (event === "SIGNED_IN") {
          setGuestUser(null); // clear guest on sign-in
          navigate("/home");
        } else if (event === "SIGNED_OUT") {
          setGuestUser(null);
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setGuestUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        guestUser,
        googleSignIn,
        signOut,
        setGuestUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
