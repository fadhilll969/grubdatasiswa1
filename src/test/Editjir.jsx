import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

const Editjir = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [mapel, setMapel] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nomer, setNomer] = useState("");

  const API_URL_DATA = "http://localhost:5000/doss"; 
  const API_URL_KATEGORI = "http://localhost:5000/clok";
  const API_URL_KELAS = "http://localhost:5000/kls";

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

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL_DATA}/${id}`);
        const data = res.data;
        setName(data.nama || "");
        setEmail(data.email || "");
        setNomer(data.nomer || "");
        setSelectedKategori(data.kategori || "");
        if (data.kategori === "Siswa") {
          setSelectedKelas(data.kelas || "");
          setSelectedJurusan(data.jurusan || "");
        } else if (data.kategori === "Guru") {
          setMapel(data.mapel || "");
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchKategori();
    fetchKelas();
    fetchData();
  }, [id]);

  useEffect(() => {
    // Update daftar jurusan saat kelas berubah
    if (selectedKelas) {
      const jurusanOptions = kelasList
        .filter((k) => k.kelas === selectedKelas)
        .map((k) => k.jurusan);
      setJurusanList(jurusanOptions);
      if (!jurusanOptions.includes(selectedJurusan)) {
        setSelectedJurusan(jurusanOptions[0] || "");
      }
    } else {
      setJurusanList([]);
      setSelectedJurusan("");
    }
  }, [selectedKelas, kelasList]);

  const handleUpdateData = async () => {
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

    if (selectedKategori === "Siswa" && (!selectedKelas || !selectedJurusan)) {
      Swal.fire({
        icon: "warning",
        title: "Kelas dan Jurusan belum dipilih!",
        text: "Harap pilih kelas dan jurusan siswa.",
      });
      return;
    }

    const updatedData = {
      nama: name,
      email,
      nomer,
      kategori: selectedKategori,
      ...(selectedKategori === "Siswa" && {
        kelas: selectedKelas,
        jurusan: selectedJurusan,
      }),
      ...(selectedKategori === "Guru" && { mapel }),
    };

    Swal.fire({
      title: "Ingin menyimpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`${API_URL_DATA}/${id}`, updatedData);
          Swal.fire({
            icon: "success",
            title: "Berhasil diperbarui!",
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
            <i className="ri-edit-2-line text-sky-600 text-3xl"></i>
            Edit Data
          </h2>

          <div className="relative mb-4">
            <i className="ri-database-2-line absolute left-3 top-3 text-gray-400"></i>
            <select
              className="p-2 pl-10 border rounded w-full"
              value={selectedKategori}
              onChange={(e) => {
                setSelectedKategori(e.target.value);
                setSelectedKelas("");
                setSelectedJurusan("");
                setMapel("");
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

          {selectedKategori === "Siswa" && (
            <>
              <div className="relative mb-4">
                <i className="ri-building-2-line absolute left-3 top-3 text-gray-400"></i>
                <select
                  className="p-2 pl-10 border rounded w-full"
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                >
                  <option value="">Pilih Kelas</option>
                  {[...new Set(kelasList.map((k) => k.kelas))].map((kelas) => (
                    <option key={kelas} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative mb-4">
                <i className="ri-book-2-line absolute left-3 top-3 text-gray-400"></i>
                <select
                  className="p-2 pl-10 border rounded w-full"
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanList.map((jur) => (
                    <option key={jur} value={jur}>
                      {jur}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {selectedKategori === "Guru" && (
            <div className="relative mb-4">
              <i className="ri-book-line absolute left-3 top-3 text-gray-400"></i>
              <input
                className="p-2 pl-10 border rounded w-full"
                placeholder="Mata Pelajaran"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
              />
            </div>
          )}

          <div className="relative mb-4">
            <i className="ri-user-3-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="relative mb-6">
            <i className="ri-mail-line absolute left-3 top-3 text-gray-400"></i>
            <input
              className="p-2 pl-10 border rounded w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="w-full p-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            onClick={handleUpdateData}
          >
            <i className="ri-save-3-line"></i> Simpan Perubahan
          </button>

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

export default Editjir;
