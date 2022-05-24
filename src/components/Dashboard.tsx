import { useState, useEffect } from "react";
import axios from "axios";

import AdminTable from "./AdminTable";
import SearchBar from "./SearchBar";
import { API_URL } from "../constants";
import { Member } from "../interfaces";

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>(
    JSON.parse(localStorage.getItem("members")!) || []
  );

  const saveToLocalStorage = (data: Member[]) => {
    localStorage.setItem("members", JSON.stringify(data));
  };

  useEffect(() => {
    if (!members.length) {
      axios.get(API_URL).then(data => {
        saveToLocalStorage(data.data);
        setMembers(data.data);
      });
    }
  }, []);

  const searchMembers = (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }
    const filteredMembers = members.filter(member => {
      for (let key in member) {
        const prop = member[key as keyof typeof member];
        if (prop?.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
    setMembers(filteredMembers);
  };

  return (
    <div id='app-container'>
      <h2>Admin Dashboard</h2>
      <SearchBar searchMembers={searchMembers} />
      <AdminTable members={members} setMembers={setMembers} />
    </div>
  );
};

export default Dashboard;
