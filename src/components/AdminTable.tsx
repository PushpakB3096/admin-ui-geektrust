import { useEffect, useState } from "react";
import { RoleType, CURRENT_PAGE_SIZE } from "../constants";
import { Member } from "../interfaces";

interface AdminTableProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const AdminTable = (props: AdminTableProps) => {
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const { members, setMembers } = props;
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(members.length / CURRENT_PAGE_SIZE)
  );

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
    // TODO: save to local storage
    setMembers(updatedMemberList);
  };

  const startEditing = (member: Member) => {
    if (memberToEdit && member.id === memberToEdit.id) {
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
    // TODO: save to local storage
    setMembers(newMemberList);
  };

  const changePage = (pageNum: number) => {
    setPageNum(pageNum);
  };

  useEffect(() => {
    if (pageNum) {
      changePage(pageNum);
    }
  }, [pageNum]);

  useEffect(() => {
    if (members.length) {
      setTotalPages(Math.ceil(members.length / CURRENT_PAGE_SIZE));
    }
  }, [members]);

  const startIdx = (pageNum - 1) * CURRENT_PAGE_SIZE;
  const endIdx = startIdx + CURRENT_PAGE_SIZE;
  const paginatedMembers = members.slice(startIdx, endIdx);

  console.log({
    totalPages,
    val: Math.ceil(members.length / CURRENT_PAGE_SIZE)
  });

  return (
    <div id='table-container'>
      <table className='table'>
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
          {paginatedMembers.map(member => (
            <tr key={member.id}>
              <td className='table-cell table-row'>
                {/* <input
                  type='checkbox'
                  className='checkbox'
                  onChange={e => onMemberSelection(e, member.id)}
                /> */}
                {member.id}
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
                <button
                  className='action-btn'
                  onClick={() => startEditing(member)}
                >
                  {memberToEdit && member.id === memberToEdit.id
                    ? "Save"
                    : "Edit"}
                </button>
                <button
                  className='action-btn del-btn'
                  onClick={() => singleDelete(member.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='table-footer'>
        <button className='action-btn' onClick={deleteSelected}>
          Delete Selected
        </button>
        <div className='pagination-container'>
          <button
            disabled={pageNum === 1}
            onClick={() => changePage(1)}
            className='pagination-btn'
          >
            {"<<"}
          </button>
          <button
            disabled={pageNum < 2}
            onClick={() => changePage(pageNum - 1)}
            className='pagination-btn'
          >
            {"<"}
          </button>
          {[
            ...Array(totalPages)
              .fill(0)
              .map((_num, idx) => {
                console.log(totalPages, _num, idx);
                return (
                  <button
                    onClick={() => changePage(idx + 1)}
                    className='pagination-btn'
                  >
                    {idx + 1}
                  </button>
                );
              })
          ]}
          <button
            disabled={pageNum === totalPages}
            onClick={() => changePage(pageNum + 1)}
            className='pagination-btn'
          >
            {">"}
          </button>
          <button
            disabled={pageNum === totalPages}
            onClick={() => changePage(1)}
            className='pagination-btn'
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
