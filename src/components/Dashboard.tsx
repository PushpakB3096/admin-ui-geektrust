import { useState, useEffect } from "react";
import axios from "axios";

import AdminTable from "./AdminTable";
import SearchBar from "./SearchBar";
import { API_URL } from "../constants";
import { Member, TableCellMember } from "../interfaces";

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>(
    // try to get the list of members from localStorage, if not present then use empty array
    JSON.parse(localStorage.getItem("members")!) || []
  );

  // stores the changed list to localStorage and updates the state
  const cacheAndUpdate = (data: TableCellMember[]) => {
    localStorage.setItem("members", JSON.stringify(data));
    setMembers(data);
  };

  useEffect(() => {
    // fetch new list from server only if localStorage doesn't have a local copy
    if (!members.length) {
      axios.get(API_URL).then(data => {
        cacheAndUpdate(data.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchMembers = (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }
    const filteredMembers = members.filter(member => {
      // iterate through all the properties of the member and try to match it with the search term
      for (let key in member) {
        const prop = member[key as keyof typeof member];
        if (prop?.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
          // if any of the property of the member has a containing search term, we need to return it
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
      <AdminTable
        members={members}
        setMembers={setMembers}
        cacheAndUpdate={cacheAndUpdate}
      />
    </div>
  );
};

export default Dashboard;
