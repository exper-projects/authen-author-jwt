import axios from "src/core/axios";

import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (refreshToken: string) => {
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
  };
  return refresh;
};

export default useRefreshToken;
