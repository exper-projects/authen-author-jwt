import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { UserModel } from "src/models/user.model";

type AuthContextType = {
  auth?: {
    user: UserModel;
  };
  setAuth?: Dispatch<SetStateAction<{ user: UserModel }>>;
};

const AuthContext = createContext<AuthContextType>({});

const getInitialState = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState<{ user: UserModel }>(getInitialState);

  useEffect(() => {
    sessionStorage.setItem("currentUser", auth ? JSON.stringify(auth) : "");
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
