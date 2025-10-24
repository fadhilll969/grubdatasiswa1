import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";

const Tmbhdata = () => {
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState("Siswa");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nomer, setNomer] = useState("");

  const API_URL = "http://localhost:5000/doss";

  const handleAddData = async () => {
    if (!name || !email || !nomer) {
      Swal.fire({
        icon: "warning",
        title: "Data tidak lengkap!",
        text: "Nama, Nomor, dan Email harus diisi.",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Email tidak valid!",
        text: "Masukkan email yang benar.",
      });
      return;
    }

    const newData = {
      nama: name,
      email,
      nomer,
      kategori: selectedFilter,
    };

    Swal.fire({
      title: "Yakin ingin menambahkan data?",
      text: "Pastikan semua data sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#e20e0e",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(API_URL, newData);
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data berhasil ditambahkan.",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/h");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Tidak dapat menambahkan data ke server.",
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white rounded-lg shadow-md w-full max-w-xl p-6">
          <h2 className="text-2xl font-semibold mb-5 text-center">
            Tambah Data
          </h2>

          <select
            className="p-2 border rounded w-full mb-4 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="Siswa">Siswa</option>
            <option value="Karyawan">Karyawan</option>
            <option value="Guru">Guru</option>
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
            onClick={handleAddData}
          >
            Tambahkan Data
          </button>

          <button
            className="w-full mt-3 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            onClick={() => navigate("/h")}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tmbhdata;
