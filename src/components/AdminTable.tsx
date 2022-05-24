interface AdminTableProps {
  members: any;
}

const AdminTable = (props: AdminTableProps) => {
  const { members } = props;
  console.log(members);

  return <div>Admin Table</div>;
};

export default AdminTable;
