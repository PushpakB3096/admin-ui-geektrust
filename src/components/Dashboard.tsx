import { useState, useEffect } from "react";
import axios from "axios";

import AdminTable from "./AdminTable";
import { API_URL } from "../constants";
import { Member } from "../interfaces";

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    axios.get(API_URL).then(data => setMembers(data.data));
  }, []);

  return (
    <div>
      <AdminTable members={members} />
    </div>
  );
};

export default Dashboard;
