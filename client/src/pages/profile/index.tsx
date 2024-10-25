import {
  Button,
  Flex,
  Input,
  rootToast,
  Typography,
  usySpacing,
} from "@usy-ui/base";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";

type FormFields = {
  name: string;
};

export const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth, onSignOut } = useAuth();

  const {
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<FormFields>({
    defaultValues: {
      name: auth?.user?.name
        ? `${auth?.user?.username} ${new Date().getTime()}`
        : "",
    },
  });

  if (!auth.user) {
    navigate("/");
    return;
  }

  const onSubmit = async (values: FormFields) => {
    try {
      const response = await axiosPrivate.post(
        `user/${auth.user.username}/update`,
        values
      );

      if (response.data) {
        reset();
        rootToast.success({
          content: "Update user success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await axiosPrivate.post("/auth/sign-out");
      onSignOut();
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          Hi! <strong>{auth.user.name}</strong>
        </Typography>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: "This field is required",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Name"
              hasError={Boolean(errors.name)}
              description={errors.name?.message}
            />
          )}
        />
        <Button type="submit" variant="primary" width="100%">
          Update
        </Button>
        <Button variant="invisible" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Flex>
    </form>
  );
};
