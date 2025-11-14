import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

const Tmbhdata = () => {
  const navigate = useNavigate();

  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nomer, setNomer] = useState("");

  const API_URL_DATA = "http://localhost:5000/doss"; 
  const API_URL_KATEGORI = "http://localhost:5000/clok";
  const API_URL_KELAS = "http://localhost:5000/kls";

  // Fetch kategori + kelas
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get(API_URL_KATEGORI);
        const aktifKategori = res.data.filter((kat) => kat.aktif);
        setKategoriList(aktifKategori);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };

    const fetchKelas = async () => {
      try {
        const res = await axios.get(API_URL_KELAS);
        setKelasList(res.data);
      } catch (error) {
        console.error("Gagal mengambil kelas:", error);
      }
    };

    fetchKategori();
    fetchKelas();
  }, []);

  // Submit data
  const handleAddData = async () => {
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
        text: "Masukkan format email yang benar.",
      });
      return;
    }

    if (selectedKategori === "Siswa" && !selectedKelas) {
      Swal.fire({
        icon: "warning",
        title: "Kelas belum dipilih!",
        text: "Harap pilih kelas siswa.",
      });
      return;
    }

    const newData = {
      nama: name,
      email,
      nomer,
      kategori: selectedKategori,
      ...(selectedKategori === "Siswa" && {
        kelas: selectedKelas,
        jurusan: selectedJurusan,
      }),
    };

    Swal.fire({
      title: "Ingin menambahkan data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(API_URL_DATA, newData);
          Swal.fire({
            icon: "success",
            title: "Berhasil menambah!",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/h");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Tidak dapat mengirim data ke server.",
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

          {/* PILIH KATEGORI */}
          <div className="relative mb-4">
            <i className="ri-database-2-line absolute left-3 top-3 text-gray-400"></i>
            <select
              className="p-2 pl-10 border rounded w-full"
              value={selectedKategori}
              onChange={(e) => {
                setSelectedKategori(e.target.value);
                setSelectedKelas("");
                setSelectedJurusan("");
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

          {/* KELAS & JURUSAN (UNTUK SISWA SAJA) */}
          {selectedKategori === "Siswa" && (
            <>
              {/* Kelas */}
              <div className="relative mb-4">
                <i className="ri-building-2-line absolute left-3 top-3 text-gray-400"></i>
                <select
                  className="p-2 pl-10 border rounded w-full"
                  value={selectedKelas}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedKelas(val);

                    const jur = kelasList.find((k) => k.kelas === val)?.jurusan || "";
                    setSelectedJurusan(jur);
                  }}
                >
                  <option value="">Pilih Kelas</option>
                  {kelasList.map((k) => (
                    <option key={k.id} value={k.kelas}>
                      {k.kelas}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jurusan otomatis */}
              <div className="relative mb-4">
                <i className="ri-book-2-line absolute left-3 top-3 text-gray-400"></i>
                <input
                  className="p-2 pl-10 border rounded w-full bg-gray-100"
                  value={selectedJurusan}
                  readOnly
                  placeholder="Jurusan otomatis"
                />
              </div>
            </>
          )}

          {/* Nama */}
          <div className="relative mb-4">
            <i className="ri-user-3-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Nomor */}
          <div className="relative mb-4">
            <i className="ri-phone-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full"
              placeholder="Nomor Telepon"
              value={nomer}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) setNomer(e.target.value);
              }}
            />
          </div>

          {/* Email */}
          <div className="relative mb-6">
            <i className="ri-mail-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Tombol Simpan */}
          <button
            className="w-full p-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            onClick={handleAddData}
          >
            <i className="ri-save-3-line"></i> Tambahkan Data
          </button>

          {/* Tombol Kembali */}
          <button
            className="w-full mt-3 p-2 bg-red-500 text-white rounded hover:bg-red-600"
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
