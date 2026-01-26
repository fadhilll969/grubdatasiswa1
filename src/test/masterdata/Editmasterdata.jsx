import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const Editmasterdata = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL_DATA = `${BASE_URL}/masterdata`;
  const API_URL_KATEGORI = `${BASE_URL}/kategoridata`;
  const API_URL_KELAS = `${BASE_URL}/kelas`;

  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanOptions, setJurusanOptions] = useState([]);

  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [mapel, setMapel] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nomor, setNomor] = useState("");

  // Ambil data master dan pilihan kategori/kelas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL_DATA}/${id}`);
        const data = res.data;

        setNama(data.nama || "");
        setEmail(data.email || "");
        setNomor(data.nomor || "");
        setSelectedKategori(data.kategori || "");
        if (data.kategori === "Siswa") {
          setSelectedKelas(data.kelas || "");
          setSelectedJurusan(data.jurusan || "");
        }
        if (data.kategori === "Guru") {
          setMapel(data.mapel || "");
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Gagal mengambil data",
          text: "Cek koneksi atau server",
        });
      }
    };

    const fetchAux = async () => {
      try {
        const [katRes, klsRes] = await Promise.all([
          axios.get(API_URL_KATEGORI),
          axios.get(API_URL_KELAS),
        ]);

        setKategoriList(katRes.data || []);
        setKelasList(klsRes.data || []);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Gagal mengambil kategori/kelas",
        });
      }
    };

    fetchAux();
    fetchData();
  }, [id]);

  // Update jurusan options saat kelas berubah
  useEffect(() => {
    if (selectedKelas) {
      const options = kelasList
        .filter((k) => k.kelas === selectedKelas)
        .map((k) => k.jurusan);
      setJurusanOptions(options);
      if (!options.includes(selectedJurusan)) {
        setSelectedJurusan(options[0] || "");
      }
    } else {
      setJurusanOptions([]);
      setSelectedJurusan("");
    }
  }, [selectedKelas, kelasList, selectedJurusan]);

  const handleUpdate = async () => {
    if (!nama || !email || !selectedKategori) {
      return Swal.fire({
        icon: "warning",
        title: "Data belum lengkap!",
      });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return Swal.fire({
        icon: "warning",
        title: "Email tidak valid!",
      });
    }
    if (selectedKategori === "Siswa" && (!selectedKelas || !selectedJurusan)) {
      return Swal.fire({
        icon: "warning",
        title: "Kelas & Jurusan wajib diisi!",
      });
    }
    if (selectedKategori === "Guru" && !mapel) {
      return Swal.fire({
        icon: "warning",
        title: "Mata Pelajaran wajib diisi!",
      });
    }

    const updatedData = {
      nama,
      email,
      nomor,
      kategori: selectedKategori,
      ...(selectedKategori === "Siswa" && { kelas: selectedKelas, jurusan: selectedJurusan }),
      ...(selectedKategori === "Guru" && { mapel }),
    };

    const confirm = await Swal.fire({
      title: "Simpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${API_URL_DATA}/${id}`, updatedData);
        Swal.fire({
          icon: "success",
          title: "Perubahan berhasil disimpan!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/h"); // redirect ke halaman daftar masterdata
      } catch {
        Swal.fire({
          icon: "error",
          title: "Gagal menyimpan data!",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52">
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">
            Edit Data
          </h2>

          <div className="mb-3">
            <label className="font-semibold block mb-1">Nomor</label>
            <input
              value={nomor}
              onChange={(e) => setNomor(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Masukkan Nomor"
            />
          </div>

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
                  {jurusanOptions.map((j) => (
                    <option key={j} value={j}>
                      {j.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {selectedKategori === "Guru" && (
            <div className="mb-3">
              <label className="font-semibold block mb-1">Mata Pelajaran</label>
              <input
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Masukkan Mata Pelajaran"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="font-semibold block mb-1">Nama</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Masukkan Nama"
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Masukkan Email"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/h")}
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>

            <button
              className="bg-sky-600 text-white px-4 py-2 rounded-lg"
              onClick={handleUpdate}
            >
              <i className="ri-save-3-line"></i> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editmasterdata;
