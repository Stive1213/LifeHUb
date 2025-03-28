import React from 'react';

const Search = () => {
  return (
    <div className=" mt-10 bg-black-500 text-white p-4 text-center">
      <input type="text" className="p-2 border border-gray-300 rounded-md text-black" placeholder="Search..." />
      <button  className='  ml-2 p-2 bg-blue-500 '>search</button>
    </div>
  );
}

export default Search;
