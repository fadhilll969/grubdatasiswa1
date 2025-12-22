import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

const Tmbhdata = () => {
  const navigate = useNavigate();

  const API_URL_DATA = "http://localhost:5000/doss";
  const API_URL_KATEGORI = "http://localhost:5000/clok";
  const API_URL_KELAS = "http://localhost:5000/kls";

  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [usedNumbers, setUsedNumbers] = useState([]);

  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [jurusanOptions, setJurusanOptions] = useState([]);

  const [nomor, setNomor] = useState("");
   const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mapel, setMapel] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [katRes, kelasRes, dataRes] = await Promise.all([
          axios.get(API_URL_KATEGORI),
          axios.get(API_URL_KELAS),
          axios.get(API_URL_DATA),
        ]);

        setKategoriList(katRes.data.filter((k) => k.aktif));
        setKelasList(kelasRes.data);
        setUsedNumbers(dataRes.data.map((d) => d.nomor));
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
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

  const handleAddData = async () => {
    if (!nomor || !name || !email || !selectedKategori) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap!",
      });
      return;
    }
    if (nomor.length !== 4) {
      Swal.fire({
        icon: "warning",
        title: "Nomor harus 4 digit!",
      });
      return;
    }

    if (usedNumbers.includes(nomor)) {
      Swal.fire({
        icon: "error",
        title: "Nomor sudah digunakan!",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Email tidak valid!",
      });
      return;
    }

    if (
      selectedKategori === "Siswa" &&
      (!selectedKelas || !selectedJurusan)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Kelas & Jurusan wajib diisi!",
      });
      return;
    }

    const newData = {
      nomor,  
      nama: name,
      email,
      kategori: selectedKategori,
      ...(selectedKategori === "Siswa" && {
        kelas: selectedKelas,
        jurusan: selectedJurusan,
      }),
      ...(selectedKategori === "Guru" && { mapel }),
    };

    Swal.fire({
      title: "Simpan data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.post(API_URL_DATA, newData);
          Swal.fire({
            icon: "success",
            title: "Data berhasil ditambahkan!",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/h");
        } catch {
          Swal.fire({
            icon: "error",
            title: "Gagal menyimpan data!",
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

          <div className="mb-3">
            <label className="font-semibold block mb-1">Kategori</label>
            <select
              value={selectedKategori}
              onChange={(e) => {
                setSelectedKategori(e.target.value);
                setSelectedKelas("");
                setSelectedJurusan("");
                setMapel("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
              <div className="mb-3">
                <label className="font-semibold block mb-1">Kelas</label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Pilih Kelas</option>
                  {[...new Set(kelasList.map((k) => k.kelas))].map((kls) => (
                    <option key={kls} value={kls}>
                      {kls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="font-semibold block mb-1">Jurusan</label>
                <select
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
            <div className="mb-3">
              <label className="font-semibold block mb-1">
                Mata Pelajaran
              </label>
              <input
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="font-semibold block mb-1">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Masukkan Nama"
            />
          </div>

          <div className="mb-3">
            <label className="font-semibold block mb-1">Nomor Unik</label>
            <input
              type="text"
              value={nomor}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 4) {
                  setNomor(val);
                 }
              }}
              maxLength={4}
              placeholder="Masukkan Nomor"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold block mb-1">Email</label>
            <input
              placeholder="Masukkan Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate("/h")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
            <button
              onClick={handleAddData}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg"
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
