import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Dasbor from './Dasbor';




const Rodd = () => {


  const filterOptions = ['Siswa', 'Karyawan', 'Guru'];
  const [selectedFilter, setSelectedFilter] = useState('Siswa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dataList, setDataList] = useState([]);
  const API_URL = 'http://localhost:5000/doss';

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setDataList(res.data))
      .catch((err) => console.error('Gagal ambil data:', err));
  }, []);


  
  const handleAddData = async () => {
    if (!name || !email) {
      Swal.fire({
        icon: 'warning',
        title: 'Data tidak lengkap!',
        text: 'Nama dan Email harus diisi.',
      });
      return;
    }


    const newData = {
      nama: name,
      email: email,
      kategori: selectedFilter,
    };


    try {
      const res = await axios.post(API_URL, newData);
      setDataList([...dataList, res.data]);

      setName('');
      setEmail('');

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
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Gagal menghapus data dari server.',
            });
          });
      }
    });
  };


  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">

        
        <Dasbor />

        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
            <div className="font-semibold bg-sky-500 text-4xl p-5 text-center text-white rounded-t-lg">
              <h3>Data </h3>
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

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-5">Data Menu</h2>
            <table className="border-collapse border border-gray-400 w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">kategori</th>
                  <th className="border border-gray-400 px-4 py-2">nama</th>
                  <th className="border border-gray-400 px-4 py-2">email</th>
                  <th className="border border-gray-400 px-4 py-2">aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((data) => (
                  <tr key={data.id}
                  className=" ">
                    <td className="text-center border border-gray-400 px-4 py-2">{data.kategori}</td>
                    <td className="text-center border border-gray-400 px-4 py-2">{data.nama}</td>
                    <td className="  border border-gray-400 px-4 py-2">{data.email}</td>
                    <td className="text-center border border-gray-400 px-4 py-2">
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
