import { useCallback, useEffect, useMemo, useState } from "react";

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

export const Dashboard = () => {
  const navigate = useNavigate();
  const { auth, onSignOut } = useAuth();
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
      onSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRevokeRefreshToken = useCallback(
    async (row: RowType) => {
      try {
        await axiosPrivate.post("/auth/revoke-refresh-token", {
          username: row.username,
        });
        rootToast.success({
          content: `Revoke refresh for user ${row.name} success`,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [axiosPrivate]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns: TableColumnType<RowType>[] = useMemo(
    () => [
      {
        key: "username",
        title: "Username",
        widthProps: { width: "120px" },
      },
      {
        key: "name",
        title: "Name",
        widthProps: { width: "180px" },
      },
      {
        key: "action-1",
        title: "",
        renderRow: (row) => (
          <Button
            variant="outline"
            size="small"
            noSole
            onClick={() => handleRevokeRefreshToken(row)}
          >
            Revoke token
          </Button>
        ),
      },
    ],
    [handleRevokeRefreshToken]
  );

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
        <Button variant="outline" size="small" onClick={fetchUsers} noSole>
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
