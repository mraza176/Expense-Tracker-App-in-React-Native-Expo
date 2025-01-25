import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContextType, UserType } from "@/types";
import { auth, db } from "@/config/firebaseConfig";
import { router } from "expo-router";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser?.uid);
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/welcome");
      }
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        msg:
          error.message.includes("(auth/invalid-credential)") ||
          error.message.includes("(auth/invalid-email)")
            ? "Invalid Credentials"
            : error.message,
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", response.user.uid), {
        name,
        email,
        uid: response.user.uid,
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        msg: error.message.includes("(auth/email-already-in-use)")
          ? "Email Already In Use"
          : error.message.includes("(auth/invalid-email)")
          ? "Invalid Email"
          : error.message.includes("(auth/weak-password)")
          ? "Password should be at least 6 characters"
          : error.message,
      };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
        setUser(userData);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
