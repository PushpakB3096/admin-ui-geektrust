import { useState } from "react";
import { Member } from "../interfaces";

interface AdminTableProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const AdminTable = (props: AdminTableProps) => {
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const { members, setMembers } = props;

  // TODO: extract this out to a common function
  const saveToLocalStorage = (newMemberList: Member[]) => {
    localStorage.setItem("members", JSON.stringify(newMemberList));
  };

  const onCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentId: number
  ) => {
    if (e.target.checked) {
      setIdsToDelete([...idsToDelete, currentId]);
    } else {
      setIdsToDelete(idsToDelete.filter(id => id !== currentId));
    }
  };

  const deleteSelected = () => {
    const newMemberList = members.filter(
      member => !idsToDelete.includes(member.id)
    );
    saveToLocalStorage(newMemberList);
    setMembers(newMemberList);
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th className='table-cell'>
              <input type='checkbox' />
            </th>
            <th className='table-cell'>Name</th>
            <th className='table-cell'>Email</th>
            <th className='table-cell'>Role</th>
            <th className='table-cell'>Actions</th>
          </tr>
          {members.map(member => (
            <tr key={member.id}>
              <td className='table-cell table-row'>
                <input type='checkbox' onChange={e => onCheck(e, member.id)} />
              </td>
              <td className='table-cell table-row'>{member.name}</td>
              <td className='table-cell table-row'>{member.email}</td>
              <td className='table-cell table-row'>{member.role}</td>
              <td className='table-cell table-row'>
                <span>Edit</span>
                <span>Delete</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={deleteSelected}>Delete selected</button>
    </div>
  );
};

export default AdminTable;
