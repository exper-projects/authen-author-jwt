import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Flex,
  rootToast,
  Table,
  TableColumnType,
  usySpacing,
} from "@usy-ui/base";
import { useNavigate } from "react-router-dom";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { UserModel } from "src/models/user.model";

type RowType = {
  username: string;
  name: string;
};

const columns: TableColumnType<RowType>[] = [
  {
    key: "username",
    title: "Username",
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "action-1",
    title: "",
    renderRow: (row) => (
      <Button
        variant="outline"
        size="small"
        noSole
        onClick={() => {
          console.log(row);
        }}
      >
        Revoke token
      </Button>
    ),
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [users, setUsers] = useState<UserModel[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (auth.user.username !== "admin") {
      rootToast.error({
        content: "Only admin has permission",
        onClose: () => {
          navigate("/");
        },
      });
    }
  }, [auth.user.username, navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/user/list");
      const filteredUsers = response.data.filter(
        ({ username }) => username !== "admin"
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate]);

  const handleSignOut = async () => {
    try {
      await axiosPrivate.post("/auth/sign-out");
      setAuth(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      widthProps={{ width: "100%" }}
      heightProps={{ height: "100vh" }}
      gap={usySpacing.px10}
    >
      <Flex justifyContent="center" gap={usySpacing.px10}>
        <Button variant="primary" size="small" onClick={fetchUsers} noSole>
          Refresh
        </Button>
        <Button variant="primary" size="small" onClick={handleSignOut} noSole>
          Sign Out
        </Button>
      </Flex>
      <Table<RowType> rowKey="username" columns={columns} dataRows={users} />
    </Flex>
  );
};
