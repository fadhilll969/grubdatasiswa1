import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

const Tmbhdata = () => {
  const navigate = useNavigate();

  const [kategoriList, setKategoriList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nomer, setNomer] = useState("");
  const [kelas, setKelas] = useState("");

  const API_URL_DATA = "http://localhost:5000/doss"; // API untuk data
  const API_URL_KATEGORI = "http://localhost:5000/clok"; // API kategori

  // Fetch kategori dari server
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get(API_URL_KATEGORI);
        // hanya kategori yang aktif
        const aktifKategori = res.data.filter((kat) => kat.aktif);
        setKategoriList(aktifKategori);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchKategori();
  }, []);

  const handleAddData = async () => {
    // validasi
    if (!name || !email || !nomer || !selectedKategori) {
      Swal.fire({
        icon: "warning",
        title: "Data tidak lengkap!",
        text: "Nama, Nomor, Email, dan Kategori harus diisi.",
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

    // jika kategori Siswa, wajib pilih kelas
    if (selectedKategori === "Siswa" && !kelas) {
      Swal.fire({
        icon: "warning",
        title: "Kelas belum dipilih!",
        text: "Pilih kelas untuk siswa.",
      });
      return;
    }

    const newData = {
      nama: name,
      email,
      nomer,
      kategori: selectedKategori,
      ...(selectedKategori === "Siswa" && { kelas }),
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
          await axios.post(API_URL_DATA, newData);
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
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
            <i className="ri-user-add-line text-sky-600 text-3xl"></i>
            Tambah Data
          </h2>

          {/* Pilih Kategori */}
          <div className="relative mb-4">
            <i className="ri-database-2-line absolute left-3 top-3 text-gray-400"></i>
            <select
              className="p-2 pl-10 border rounded w-full focus:ring-2 focus:ring-sky-400 focus:outline-none"
              value={selectedKategori}
              onChange={(e) => {
                setSelectedKategori(e.target.value);
                setKelas(""); // reset kelas
              }}
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((kat) => (
                <option key={kat.id} value={kat.kategori_nama}>
                  {kat.kategori_nama}
                </option>
              ))}
            </select>
          </div>

          {/* Nama */}
          <div className="relative mb-4">
            <i className="ri-user-3-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Kelas hanya untuk Siswa */}
          {selectedKategori === "Siswa" && (
            <div className="relative mb-4">
              <i className="ri-building-2-line absolute left-3 top-3 text-gray-400"></i>
              <select
                className="p-2 pl-10 border rounded w-full focus:ring-2 focus:ring-sky-400 focus:outline-none"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
              >
                <option value="">Pilih Kelas</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
          )}

          {/* Nomor */}
          <div className="relative mb-4">
            <i className="ri-phone-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Nomor Telepon"
              value={nomer}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) setNomer(value);
              }}
            />
          </div>

          {/* Email */}
          <div className="relative mb-6">
            <i className="ri-mail-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Tombol Tambah */}
          <button
            className="w-full p-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition duration-200 flex items-center justify-center gap-2"
            onClick={handleAddData}
          >
            <i className="ri-save-3-line"></i> Tambahkan Data
          </button>

          {/* Tombol Kembali */}
          <button
            className="w-full mt-3 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2"
            onClick={() => navigate("/h")}
          >
            <i className="ri-arrow-left-line"></i> Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tmbhdata;
