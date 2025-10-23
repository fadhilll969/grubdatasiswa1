import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Dasbor from './Dasbor';
import { useNavigate } from 'react-router-dom';

const Rodd = () => {
  const filterOptions = ['Siswa', 'Karyawan', 'Guru'];
  const [selectedFilter, setSelectedFilter] = useState('Siswa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nomer, setNomer] = useState('');
  const [dataList, setDataList] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔍 State untuk pencarian
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

  const handleAddData = async () => {
    if (!name || !email || !nomer) {
      Swal.fire({
        icon: 'warning',
        title: 'Data tidak lengkap!',
        text: 'Nama, Nomer, dan Email harus diisi.',
      });
      return;
    }

    const newData = {
      nama: name,
      email,
      nomer,
      kategori: selectedFilter,
    };

    try {
      const res = await axios.post(API_URL, newData);
      setDataList([...dataList, res.data]);

      setName('');
      setEmail('');
      setNomer('');
      setSelectedFilter('Siswa');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil ditambahkan.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Tidak dapat menambahkan data ke server.',
      });
    }
  };

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



  const handleSaveEdit = async () => {
    if (!name || !email || !nomer) {
      Swal.fire({
        icon: 'warning',
        title: 'Data tidak lengkap!',
        text: 'Nama, Nomer, dan Email harus diisi.',
      });
      return;
    }

    const updatedData = {
      nama: name,
      email,
      nomer,
      kategori: selectedFilter,
    };

    try {
      await axios.put(`${API_URL}/${editId}`, updatedData);
      setDataList(
        dataList.map((item) =>
          item.id === editId ? { ...item, ...updatedData } : item
        )
      );

      setIsEditing(false);
      setEditId(null);
      setName('');
      setEmail('');
      setNomer('');
      setSelectedFilter('Siswa');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Tidak dapat memperbarui data.',
      });
    }
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
          <div className="bg-white rounded-lg shadow-md w-full max-w-6xl mx-auto">
            <div className="font-semibold bg-sky-500 text-4xl p-5 text-center text-white rounded-t-lg">
              <h3>Data</h3>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 p-5">
              <select
                className="p-2 border rounded w-full md:w-48"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>   

              <input
                className="p-2 border rounded w-full md:w-48"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="p-2 border rounded w-full md:w-48"
                placeholder="Nomer Telepon"
                value={nomer}
                onChange={(e) => setNomer(e.target.value)}
              />

              <input
                className="p-2 border rounded flex-1 w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="p-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddData}
              >
                Tambahkan Data
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Cari Berdasarkan Nama...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 bg-white border-2 rounded w-full md:w-64 focus:ring-2 focus:ring-sky-400"
            />


          </div>
          <select
            className="mt-5 p-2 border-2 rounded w-full md:w-60 bg-white focus:ring-2 focus:ring-sky-400"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option
              value="Semua"
            >
              Kategori
            </option>
            {filterOptions.map((option) => (
              <option
                key={option}
                value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="font-bold text-3xl mt-10">
            <h2>Data Menu</h2>
          </div>

          <div className="mt-5 overflow-x-auto">
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
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{data.kategori}</td>
                      <td className="border px-4 py-2">{data.nama}</td>
                      <td className="text-center border px-4 py-2">
                        {data.nomer}
                      </td>
                      <td className="border px-4 py-2">{data.email}</td>
                      <td className="text-center border px-4 py-2 space-x-2">
                        <button
                          className="bg-sky-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            Swal.fire({
                              title: 'Yakin ingin mengubah data ini?',
                              text: 'Kamu akan diarahkan ke halaman edit.',
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'Ya, Edit',
                              cancelButtonText: 'Batal',
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#e20e0e',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                navigate(`/edit/${data.id}`);
                              }
                            });
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
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
