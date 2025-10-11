import React, { useState } from 'react';

const Rodd = () => {
  const filterOptions = ['Siswa', 'Karyef', 'Guru'];
  const [selectedFilter, setSelectedFilter] = useState('Siswa');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTampilkanData = () => {
    console.log(`Filter: ${selectedFilter}, Entri: ${entriesPerPage}, Pencarian: ${searchQuery}`);
  };



  return (
    <div className="p-5 mt-10">
      <div className="bg-white rounded-lg shadow-md w-max-w-sm">

        <div className="font-semibold bg-sky-500 text-4xl p-5 text-center">
          <h3>
            Filter Data
          </h3>
        </div>
        <div className="flex mt-10 p-5 gap-3">
          <select
            className="p-2 border rounded"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <div className="p-2 border rounded">  Tampilkan</div>
          <input
            className="p-2 border rounded flex-1"
            type="text"
            placeholder="test"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleTampilkanData}
            className="p-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tampilkan Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rodd;
