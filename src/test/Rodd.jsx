import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Dasbor from './Dasbor';

const Rodd = () => {
  const filterOptions = ['Siswa', 'Karyawan', 'Guru'];
  const [selectedFilter, setSelectedFilter] = useState('Siswa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nomer, setNomer] = useState('');
  const [dataList, setDataList] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:5000/doss';

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setDataList(res.data))
      .catch((err) => console.error('Gagal ambil data:', err));
  }, []);

  const handleAddData = async () => {
    if (!name || !email || !nomer) {
      Swal.fire({
        icon: 'warning',
        title: 'Data tidak lengkap!',
        text: 'Nama, Email, dan Nomer harus diisi.',
      });
      return;
    }

    const newData = {
      nama: name,
      email: email,
      nomer: nomer,
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
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_URL}/${id}`)
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

  const handleEdit = (data) => {
    setIsEditing(true);
    setEditId(data.id);
    setName(data.nama);
    setEmail(data.email);
    setNomer(data.nomer || '');   
    setSelectedFilter(data.kategori);
  };

  const handleSaveEdit = async () => {
    if (!name || !email || !nomer) {
      Swal.fire({
        icon: 'warning',
        title: 'Data tidak lengkap!',
        text: 'Nama, Email, dan Nomer harus diisi.',
      });
      return;
    }

    const updatedData = {
      nama: name,
      email: email,
      nomer: nomer,
      kategori: selectedFilter,
    };

    try {
      await axios.put(`${API_URL}/${editId}`, updatedData);
      setDataList(dataList.map(item => item.id === editId ? { ...item, ...updatedData } : item));

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Dasbor />

        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
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
                  <option key={option} value={option}>{option}</option>
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

              {isEditing ? (
                <>
                  <button
                    className="p-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={handleSaveEdit}
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    className="p-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => {
                      setIsEditing(false);
                      setEditId(null);
                      setName('');
                      setEmail('');
                      setNomer('');
                      setSelectedFilter('Siswa');
                    }}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  className="p-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleAddData}
                >
                  Tambahkan Data
                </button>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-5">Data Menu</h2>
            <table className="border-collapse border border-gray-400 w-full">
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
                {dataList.map((data, index) => (
                  <tr key={data.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="  border px-4 py-2">{data.kategori}</td>
                    <td className=" border px-4 py-2">{data.nama}</td>
                    <td className="text-center border px-4 py-2">{data.nomer}</td>
                    <td className="border px-4 py-2">{data.email}</td>
                    <td className="text-center border px-4 py-2 space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => handleEdit(data)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rodd;
