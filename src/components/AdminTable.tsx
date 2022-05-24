import { useEffect, useState } from "react";
import { RoleType, CURRENT_PAGE_SIZE } from "../constants";
import { TableCellMember } from "../interfaces";
import { convertToTitleCase } from "../utils/string";

interface AdminTableProps {
  members: TableCellMember[];
  setMembers: React.Dispatch<React.SetStateAction<TableCellMember[]>>;
}

const AdminTable = (props: AdminTableProps) => {
  const { members, setMembers } = props;
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [memberToEdit, setMemberToEdit] = useState<TableCellMember | null>(
    null
  );
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(members.length / CURRENT_PAGE_SIZE)
  );

  const onMemberSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentId: number
  ) => {
    if (e.target.checked) {
      setIdsToDelete([...idsToDelete, currentId]);
    } else {
      setIdsToDelete(idsToDelete.filter(id => id !== currentId));
    }
    setMembers(
      members.map(member => {
        if (member.id === currentId) {
          return {
            ...member,
            checked: !member.checked
          };
        }
        return member;
      })
    );
  };

  const deleteSelected = () => {
    const newMemberList = members.filter(
      member => !idsToDelete.includes(member.id)
    );
    cacheAndUpdate(newMemberList);
  };

  const cacheAndUpdate = (updatedMemberList: TableCellMember[]) => {
    localStorage.setItem("members", JSON.stringify(updatedMemberList));
    setMembers(updatedMemberList);
  };

  const updateMember = () => {
    const updatedMemberList = members.map(member => {
      if (memberToEdit && member.id === memberToEdit.id) {
        return memberToEdit;
      }
      return member;
    });
    cacheAndUpdate(updatedMemberList);
  };

  const startEditing = (member: TableCellMember) => {
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

  const singleDelete = (id: number) => {
    const newMemberList = members.filter(member => member.id !== id);
    cacheAndUpdate(newMemberList);
  };

  const changePage = (pageNum: number) => {
    setPageNum(pageNum);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIdsToDelete(members.map(member => member.id));
    } else {
      setIdsToDelete([]);
    }
    setMembers(
      members.map(member => {
        return {
          ...member,
          checked: !member.checked
        };
      })
    );
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

  useEffect(() => {
    setMembers(
      members.map(member => {
        return {
          ...member,
          checked: false
        };
      })
    );
  }, []);

  const startIdx = (pageNum - 1) * CURRENT_PAGE_SIZE;
  const endIdx = startIdx + CURRENT_PAGE_SIZE;
  const paginatedMembers = members.slice(startIdx, endIdx);

  return (
    <div id='table-container'>
      <table className='table'>
        <tbody>
          <tr>
            <th className='table-cell'>
              <input type='checkbox' onChange={e => handleSelectAll(e)} />
            </th>
            <th className='table-cell'>Name</th>
            <th className='table-cell'>Email</th>
            <th className='table-cell'>Role</th>
            <th className='table-cell'>Actions</th>
          </tr>
          {paginatedMembers.map(member => (
            <tr key={member.id}>
              <td className='table-cell table-row'>
                <input
                  type='checkbox'
                  className='checkbox'
                  onChange={e => onMemberSelection(e, member.id)}
                  checked={member.checked}
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
                    value={memberToEdit.role?.toUpperCase()}
                    name='role'
                  >
                    <option>Select Role</option>
                    {Object.keys(RoleType).map(type => (
                      <option key={type} value={type}>
                        {convertToTitleCase(type)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{convertToTitleCase(member.role!)}</span>
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
        <button className='action-btn delete-all-btn' onClick={deleteSelected}>
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
                return (
                  <button
                    key={idx}
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
