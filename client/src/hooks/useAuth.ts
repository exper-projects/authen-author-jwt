import { useContext } from "react";

import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthProvider";

type OnSignInSuccessParams = {
  user: any;
  navigatePath;
};

const useAuth = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  const onSignIn = ({ user, navigatePath }: OnSignInSuccessParams) => {
    setAuth({
      user,
    });
    navigate(navigatePath);
  };

  const onSignOut = () => {
    setAuth(null);
    navigate("/");
  };

  return { auth, setAuth, onSignIn, onSignOut };
};

export default useAuth;
