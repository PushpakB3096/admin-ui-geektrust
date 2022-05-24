import { useState, useEffect } from "react";
import axios from "axios";

import AdminTable from "./AdminTable";
import { API_URL } from "../constants";
import { Member } from "../interfaces";

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);

  const saveToLocalStorage = (data: Member[]) => {
    localStorage.setItem("members", JSON.stringify(data));
  };

  useEffect(() => {
    axios.get(API_URL).then(data => {
      saveToLocalStorage(data.data);
      setMembers(data.data);
    });
  }, []);

  return (
    <div>
      <AdminTable members={members} setMembers={setMembers} />
    </div>
  );
};

export default Dashboard;
