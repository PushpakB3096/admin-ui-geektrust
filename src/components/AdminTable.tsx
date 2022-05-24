import { useEffect, useState } from "react";
import { RoleType, CURRENT_PAGE_SIZE } from "../constants";
import { TableCellMember } from "../interfaces";
import { convertToTitleCase } from "../utils/string";

interface AdminTableProps {
  members: TableCellMember[];
  setMembers: React.Dispatch<React.SetStateAction<TableCellMember[]>>;
  cacheAndUpdate: (data: TableCellMember[]) => void;
}

const AdminTable = (props: AdminTableProps) => {
  const { members, setMembers, cacheAndUpdate } = props;
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [memberToEdit, setMemberToEdit] = useState<TableCellMember | null>(
    null
  );
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    // standard formula to determine the total number of pages needed for pagination
    Math.ceil(members.length / CURRENT_PAGE_SIZE)
  );

  const onMemberSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentId: number
  ) => {
    if (e.target.checked) {
      // selecting a row should save it for deletion later on
      setIdsToDelete([...idsToDelete, currentId]);
    } else {
      // opposite will happen on uncheck
      setIdsToDelete(idsToDelete.filter(id => id !== currentId));
    }
    setMembers(
      members.map(member => {
        if (member.id === currentId) {
          return {
            ...member,
            // toggle the row selection in storage
            checked: !member.checked
          };
        }
        return member;
      })
    );
  };

  const deleteSelected = () => {
    // iterate through the original list and remove whichever were deleted
    const newMemberList = members.filter(
      member => !idsToDelete.includes(member.id)
    );
    cacheAndUpdate(newMemberList);
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
    // clicking on delete button should just remove that row
    const newMemberList = members.filter(member => member.id !== id);
    cacheAndUpdate(newMemberList);
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
          // checking the select all checkbox should select all, and should remove it otherwise
          checked: !member.checked
        };
      })
    );
  };

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

  // below lines contain standard formula to do client-side pagination
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
                  {/* based on the row being edited, display the corresponding text */}
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
            onClick={() => setPageNum(1)}
            className='pagination-btn'
          >
            {"<<"}
          </button>
          <button
            disabled={pageNum < 2}
            onClick={() => setPageNum(pageNum - 1)}
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
                    onClick={() => setPageNum(idx + 1)}
                    className='pagination-btn'
                  >
                    {idx + 1}
                  </button>
                );
              })
          ]}
          <button
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(pageNum + 1)}
            className='pagination-btn'
          >
            {">"}
          </button>
          <button
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(1)}
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
