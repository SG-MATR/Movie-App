import searchImage from '../../public/search.svg'
const Search = (props) => {
  const {searchItem,setSearchItem}=props
  console.log(searchItem)
  return (
    <div className="search">
      <div>
        <img src={searchImage} alt="Search" className="" />
        <input type="text" value={searchItem} onChange={(e)=>setSearchItem(e.target.value)} placeholder='Search A Movie In Thousands Of Movies'/>
      </div>
    </div>
  )
}

export default Search