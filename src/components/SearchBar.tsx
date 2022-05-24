interface SearchBarProps {
  searchMembers: (searchTerm: string) => void;
}

const SearchBar = (props: SearchBarProps) => {
  const { searchMembers } = props;

  return (
    <div className='search-bar-container'>
      <input
        className='search-bar'
        placeholder='Search members...'
        onChange={e => searchMembers(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
