import { useCallback, useEffect, useState } from "react";

import { Button, Flex } from "@usy-ui/base";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { UserModel } from "src/models/user.model";

export const Dashboard = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/user/list");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Flex>
      <div>
        {users.map((user) => (
          <p key={user.username}>{user.username}</p>
        ))}
      </div>
      <Button onClick={fetchUsers}>Refresh</Button>
    </Flex>
  );
};
