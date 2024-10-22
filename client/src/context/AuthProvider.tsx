import { createContext, Dispatch, SetStateAction, useState } from "react";

import { UserModel } from "src/models/user.model";

type AuthContextType = {
  auth?: {
    user: UserModel;
  };
  setAuth?: Dispatch<SetStateAction<{ user: UserModel }>>;
};

const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState<{ user: UserModel }>();

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
