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
    // TODO: only fetch if local storage not there
    axios.get(API_URL).then(data => {
      saveToLocalStorage(data.data);
      setMembers(data.data);
    });
  }, []);

  return (
    <div id='app-container'>
      <h2>Admin Dashboard</h2>
      {/* SearchBar here */}
      <AdminTable members={members} setMembers={setMembers} />
    </div>
  );
};

export default Dashboard;
