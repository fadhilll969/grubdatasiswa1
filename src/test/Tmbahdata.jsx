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
  const [jurusanOptions, setJurusanOptions] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nomor, setNomor] = useState("");
  const [mapel, setMapel] = useState("");

  const API_URL_DATA = "http://localhost:5000/doss";
  const API_URL_KATEGORI = "http://localhost:5000/clok";
  const API_URL_KELAS = "http://localhost:5000/kls";

  const generateNumber = () => Math.floor(1000 + Math.random() * 9000);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get(API_URL_KATEGORI);
        setKategoriList(res.data.filter((k) => k.aktif));
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

  useEffect(() => {
    if (selectedKelas) {
      const jurusan = kelasList
        .filter((k) => k.kelas === selectedKelas)
        .map((k) => k.jurusan);

      setJurusanOptions(jurusan);
      setSelectedJurusan("");
    } else {
      setJurusanOptions([]);
      setSelectedJurusan("");
    }
  }, [selectedKelas, kelasList]);

  const handleKategoriChange = (value) => {
    setSelectedKategori(value);
    setSelectedKelas("");
    setSelectedJurusan("");
    setMapel("");

    if (value) {
      const prefix =
        value === "Siswa" ? "RFID" : value === "Guru" ? "RFID" : "RFID";
      setNomor(`${prefix}-${generateNumber()}`);
    } else {
      setNomor("");
    }
  };

  const handleAddData = async () => {
    if (!name || !email || !selectedKategori) {
      Swal.fire({
        icon: "warning",
        title: "Data tidak lengkap!",
        text: "Nama, Email, dan Kategori harus diisi.",
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

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Email tidak valid!",
        text: "Masukkan format email yang benar.",
      });
      return;
    }

    const newData = {
      nama: name,
      email,
      kategori: selectedKategori,
      nomor,
      ...(selectedKategori === "Siswa" && {
        kelas: selectedKelas,
        jurusan: selectedJurusan,
      }),
      ...(selectedKategori === "Guru" && { mapel }),
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
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52">
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">
            Tambah Data
          </h2>
          <div className="mb-2">
            <label className="font-semibold block mb-1">Nomor Unik</label>
            <input
              value={nomor}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Kategori</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
              value={selectedKategori}
              onChange={(e) => handleKategoriChange(e.target.value)}
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
              <div className="mb-4">
                <label className="block font-semibold mb-1">Kelas</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                >
                  <option value="">Pilih Kelas</option>
                  {[...new Set(kelasList.map((k) => k.kelas))].map((kls) => (
                    <option key={kls} value={kls}>
                      {kls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">Jurusan</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanOptions.map((j, i) => (
                    <option key={i} value={j}>
                      {j.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {selectedKategori === "Guru" && (
            <div className="mb-4">
              <label className="block font-semibold mb-1">Mata Pelajaran</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Masukkan mapel"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block font-semibold mb-1">Nama</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Alamat Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/h")}
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>

            <button
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
              onClick={handleAddData}
            >
              <i className="ri-save-3-line"></i> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tmbhdata;
