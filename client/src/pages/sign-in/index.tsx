import { useContext } from "react";

import {
  Button,
  Flex,
  Input,
  Password,
  Typography,
  usySpacing,
} from "@usy-ui/base";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/context/AuthProvider";
import axios from "src/core/axios";

type FormFields = {
  username: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const {
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<FormFields>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormFields) => {
    try {
      const abortController = new AbortController();
      const response = await axios.post("/auth/sign-in", values, {
        signal: abortController.signal,
      });

      if (response.data) {
        console.log(response.data);
        setAuth({
          user: response.data,
        });
        reset();
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        direction="column"
        widthProps={{ maxWidth: "300px" }}
        marginProps={{ margin: "auto", marginTop: "25vh" }}
        gap={usySpacing.px20}
      >
        <Typography size="gigant-1">Sign In</Typography>
        <Controller
          control={control}
          name="username"
          rules={{
            required: {
              value: true,
              message: "This field is required",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Username"
              hasError={Boolean(errors.username)}
              description={errors.username?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: {
              value: true,
              message: "This field is required",
            },
          }}
          render={({ field }) => (
            <Password
              {...field}
              label="Password"
              hasError={Boolean(errors.password)}
              description={errors.password?.message}
            />
          )}
        />
        <Button type="submit" variant="primary" width="100%">
          Sign In
        </Button>
        <Button variant="invisible" onClick={() => navigate("/sign-up")}>
          Go to Sign Up
        </Button>
      </Flex>
    </form>
  );
};
