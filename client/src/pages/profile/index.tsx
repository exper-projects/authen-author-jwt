import { Button, Flex, Typography, usySpacing } from "@usy-ui/base";
import { useNavigate } from "react-router-dom";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";

export const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  if (!auth.user) {
    navigate("/");
    return;
  }

  const handleSignOut = async () => {
    try {
      await axiosPrivate.post("/auth/sign-out");
      setAuth(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      widthProps={{ maxWidth: "300px" }}
      heightProps={{ height: "100vh" }}
      marginProps={{ margin: "0 auto" }}
      gap={usySpacing.px10}
    >
      <Typography>
        Hi! <strong>{auth.user.username}</strong>
      </Typography>
      <Flex justifyContent="center" gap={usySpacing.px10}>
        <Button variant="primary" size="small" onClick={handleSignOut} noSole>
          Sign Out
        </Button>
      </Flex>
    </Flex>
  );
};
