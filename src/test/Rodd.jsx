import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Dasbor from './Dasbor';
import { useNavigate } from 'react-router-dom';

const Rodd = () => {
  const filterOptions = ['Siswa', 'Karyawan', 'Guru'];

  const [dataList, setDataList] = useState([]);


  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('Semua');

  const API_URL = 'http://localhost:5000/doss';
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setDataList(res.data))
      .catch((err) => console.error('Gagal ambil data:', err));
  }, []);


  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus data ini?',
      text: 'Data yang dihapus tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/${id}`)
          .then(() => {
            setDataList(dataList.filter((item) => item.id !== id));
            Swal.fire({
              icon: 'success',
              title: 'Data Terhapus!',
              text: 'Data berhasil dihapus.',
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Gagal menghapus data dari server.',
            });
          });
      }
    });
  };

  const filteredData = dataList.filter((data) => {
    const matchName = data.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      searchCategory === 'Semua' || data.kategori === searchCategory;
    return matchName && matchCategory;
  });

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="flex">
        <Dasbor />

        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-sky-500 text-4xl p-5 rounded-t-lg">
              <h3 className="font-semibold text-center text-white">Data</h3>
            </div>

            <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Cari Berdasarkan Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border-2 rounded w-full md:w-1/3 bg-white focus:ring-2 focus:ring-sky-400"
              />
              <select
                className="p-2 border-2 rounded w-full md:w-1/3 bg-white focus:ring-2 focus:ring-sky-400"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="Semua">Semua Kategori</option>
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>


              <button
                className="p-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 w-full md:w-auto"
                onClick={() => navigate("/t")}
              >
                Tambahkan Data
              </button>

            </div>
          </div>



          <div className="mt-5 p-5 overflow-x-auto">
            <table className="border-collapse border w-full bg-white">
              <thead>
                <tr className="bg-sky-500">
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Kategori</th>
                  <th className="border px-4 py-2">Nama</th>
                  <th className="border px-4 py-2">Nomer</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((data, index) => (
                    <tr key={data.id}>
                      <td className="border text-center px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{data.kategori}</td>
                      <td className="border px-4 py-2">{data.nama}</td>
                      <td className="text-center border px-4 py-2">{data.nomer}</td>
                      <td className="border px-4 py-2">{data.email}</td>
                      <td className="text-center border px-4 py-2 space-x-2">
                        <button
                          className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
                          onClick={() => navigate(`/edit/${data.id}`)}
                        >
                          Edit
                        </button>

                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(data.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-4 text-gray-500 italic"
                    >
                      Tidak ada data yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Rodd;
