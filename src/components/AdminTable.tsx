import { Member } from "../interfaces";

interface AdminTableProps {
  members: Member[];
}

const AdminTable = (props: AdminTableProps) => {
  const { members } = props;

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th className='table-cell'>Select </th>
            <th className='table-cell'>Name</th>
            <th className='table-cell'>Email</th>
            <th className='table-cell'>Role</th>
            <th className='table-cell'>Actions</th>
          </tr>
          {members.map(member => (
            <tr key={member.id}>
              <td className='table-cell'>{member.id}</td>
              <td className='table-cell'>{member.name}</td>
              <td className='table-cell'>{member.email}</td>
              <td className='table-cell'>{member.role}</td>
              <td className='table-cell'>Edit | Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
