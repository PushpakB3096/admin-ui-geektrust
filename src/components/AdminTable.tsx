import { useState } from "react";
import { RoleType } from "../constants";
import { Member } from "../interfaces";

interface AdminTableProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const AdminTable = (props: AdminTableProps) => {
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const { members, setMembers } = props;

  // TODO: extract this out to a common function
  const saveToLocalStorage = (newMemberList: Member[]) => {
    localStorage.setItem("members", JSON.stringify(newMemberList));
  };

  const onMemberSelection = (
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

  const updateMember = () => {
    const updatedMemberList = members.map(member => {
      if (memberToEdit && member.id === memberToEdit.id) {
        return memberToEdit;
      }
      return member;
    });
    setMembers(updatedMemberList);
    console.log(memberToEdit);
  };

  const startEditing = (member: Member) => {
    if (memberToEdit && member.id === memberToEdit.id) {
      console.log("saving...");
      setMemberToEdit(null);
      updateMember();
    } else {
      setMemberToEdit(member);
    }
  };

  const editMember = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (memberToEdit) {
      setMemberToEdit({
        ...memberToEdit,
        [e.target.name]: e.target.value
      });
    }
  };

  // TODO: use single delete inside batch delete
  const singleDelete = (id: number) => {
    const newMemberList = members.filter(member => member.id !== id);
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
                <input
                  type='checkbox'
                  onChange={e => onMemberSelection(e, member.id)}
                />
              </td>
              <td className='table-cell table-row'>
                {memberToEdit && memberToEdit.id === member.id ? (
                  <input
                    onChange={e => editMember(e)}
                    value={memberToEdit.name}
                    name='name'
                  />
                ) : (
                  <span>{member.name}</span>
                )}
              </td>
              <td className='table-cell table-row'>
                {memberToEdit && memberToEdit.id === member.id ? (
                  <input
                    onChange={e => editMember(e)}
                    value={memberToEdit.email}
                    name='email'
                  />
                ) : (
                  <span>{member.email}</span>
                )}
              </td>
              <td className='table-cell table-row'>
                {memberToEdit && memberToEdit.id === member.id ? (
                  <select
                    onChange={e => editMember(e)}
                    // TODO: handle title casing in role enum properly
                    value={memberToEdit.role?.toUpperCase()}
                    name='role'
                  >
                    <option>Select Role</option>
                    {Object.keys(RoleType).map(type => (
                      <option key={type} value={type}>
                        {/* TODO: create a title casing util function */}
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{member.role}</span>
                )}
              </td>
              <td className='table-cell table-row'>
                <span onClick={() => startEditing(member)}>
                  {memberToEdit && member.id === memberToEdit.id
                    ? "Save"
                    : "Edit"}
                </span>
                <span onClick={() => singleDelete(member.id)}>Delete</span>
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
