import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Dasbor from './Dasbor';

const Editjir = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/doss';

  const filterOptions = ['Siswa', 'Karyawan', 'Guru'];

  const [selectedFilter, setSelectedFilter] = useState('Siswa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nomer, setNomer] = useState('');

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        const data = res.data;
        setName(data.nama);
        setEmail(data.email);
        setNomer(data.nomer || '');
        setSelectedFilter(data.kategori);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Data tidak ditemukan.',
        });
        navigate('/h');
      });
  }, [id, navigate]);

  const handleSaveEdit = async () => {
    if (!name || !email || !nomer) {
      Swal.fire({
        icon: 'warning',
        title: 'Data tidak lengkap!',
        text: 'Nama, Nomer, dan Email harus diisi.',
      });
      return;
    }

    if (!/^\d+$/.test(nomer)) {
      Swal.fire({
        icon: 'warning',
        title: 'Nomor tidak valid!',
        text: 'Nomor telepon hanya boleh berisi angka.',
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Email tidak valid!',
        text: 'Masukkan alamat email yang benar.',
      });
      return;
    }

    const updatedData = { nama: name, email, nomer, kategori: selectedFilter };

    const result = await Swal.fire({
      title: 'Yakin ingin menyimpan perubahan?',
      text: 'Data yang diubah akan diperbarui.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Simpan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#e20e0e',
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: 'Menyimpan...',
      text: 'Mohon tunggu sebentar.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await axios.put(`${API_URL}/${id}`, updatedData);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/h');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Tidak dapat memperbarui data.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
          <h2 className="text-2xl font-semibold mb-5 text-center text-gray-800">
            Edit Data
          </h2>

          <select
            className="p-2 border rounded w-full mb-4 focus:ring-2 focus:ring-sky-400 focus:outline-none"
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
            className="p-2 border rounded w-full mb-4 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="p-2 border rounded w-full mb-4 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Nomor Telepon"
            value={nomer}
            onChange={(e) => setNomer(e.target.value)}
          />

          <input
            className="p-2 border rounded w-full mb-6 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="w-full p-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition duration-200"
            onClick={handleSaveEdit}
          >
            Simpan Perubahan
          </button>

          <button
            className="w-full mt-3 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            onClick={() => navigate('/h')}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editjir;
