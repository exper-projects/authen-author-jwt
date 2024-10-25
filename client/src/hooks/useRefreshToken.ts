import { useNavigate } from "react-router-dom";
import axios from "src/core/axios";

import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const refresh = async (refreshToken: string) => {
    try {
      const response = await axios.post("/auth/refresh-token", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      });

      setAuth((prev) => {
        return {
          ...prev,
          user: {
            ...prev.user,
            accessToken: response.data.accessToken,
          },
        };
      });

      return response.data.accessToken;
    } catch (error) {
      if (error.response.status === 403) {
        alert("Refresh token revoked. redirecting to Sign In page...");
        navigate("/");
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
